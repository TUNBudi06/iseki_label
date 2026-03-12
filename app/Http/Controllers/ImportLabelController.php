<?php

namespace App\Http\Controllers;

use App\Imports\LabelQueueFromExcelImport;
use App\Models\QueueLabelPrint;
use App\Models\RackPartList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ImportLabelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('ImportLabel/index');
    }

    /**
     * API: search rack_part_lists by rack_no, item_code, or part_name.
     */
    public function searchRack(Request $request): JsonResponse
    {
        $search = $request->input('q', '');

        $results = RackPartList::query()
            ->when($search, function ($query) use ($search) {
                $query->where('rack_no', 'like', "%{$search}%")
                    ->orWhere('item_code', 'like', "%{$search}%")
                    ->orWhere('part_name', 'like', "%{$search}%");
            })
            ->orderBy('rack_no')
            ->limit(20)
            ->get(['id', 'rack_no', 'item_code', 'part_name', 'type_tractor']);

        return response()->json($results);
    }

    /**
     * Store manual queue items.
     *
     * @param  array{items: array<int, array{rack_code: string, label_type: string, quantity: int, requested_by: string, area_name: string|null, urgent: bool, auto_print: bool}>}  $validated
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.rack_code' => 'required|string|max:50|exists:rack_part_lists,rack_no',
            'items.*.label_type' => 'required|in:kecil,besar,pallet',
            'items.*.quantity' => 'required|integer|min:1|max:999',
            'items.*.requested_by' => 'required|string|max:255',
            'items.*.area_name' => 'nullable|string|max:255',
            'items.*.urgent' => 'boolean',
            'items.*.auto_print' => 'boolean',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('items') as $item) {
                QueueLabelPrint::create([
                    'rack_code' => $item['rack_code'],
                    'label_type' => $item['label_type'],
                    'quantity' => $item['quantity'],
                    'requested_by' => $item['requested_by'],
                    'area_name' => $item['area_name'] ?? null,
                    'urgent' => $item['urgent'] ?? false,
                    'auto_print' => $item['auto_print'] ?? false,
                    'printed' => false,
                ]);
            }
        });

        return back()->with('success', count($request->input('items')).' label berhasil ditambahkan ke queue.');
    }

    /**
     * Import queue items from Excel.
     * Required column: rack_no. Optional: label_type, quantity, requested_by, area_name, urgent.
     */
    public function importFromExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'requested_by' => 'required|string|max:255',
            'label_type' => 'required|in:kecil,besar,pallet',
            'auto_print' => 'boolean',
        ]);

        try {
            $import = new LabelQueueFromExcelImport(
                $request->input('requested_by'),
                $request->input('label_type'),
                (bool) $request->input('auto_print', false),
            );

            Excel::import($import, $request->file('file'));

            $count = $import->getImportedCount();

            return back()->with('success', "{$count} label berhasil diimport dari Excel.");
        } catch (\Exception $e) {
            \Log::error('Import label Excel failed: '.$e->getMessage());

            return back()->with('error', 'Import gagal: '.$e->getMessage());
        }
    }

    /**
     * Download blank Excel template for bulk import.
     */
    public function template()
    {
        return Excel::download(
            new class implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings
            {
                public function array(): array
                {
                    return [
                        ['SX-A264', 'besar', 1, 'Nama Requester', 'Area Gudang', 'NO'],
                        ['SX-B101', 'kecil', 2, 'Nama Requester', 'Line A', 'YES'],
                    ];
                }

                public function headings(): array
                {
                    return ['rack_no', 'label_type', 'quantity', 'requested_by', 'area_name', 'urgent'];
                }
            },
            'template-import-label.xlsx',
        );
    }
}

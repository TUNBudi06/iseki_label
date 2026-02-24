<?php

namespace App\Http\Controllers;

use App\Exports\RackPartListExport;
use App\Imports\RackPartListImport;
use App\Models\RackPartList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RackPartListController extends Controller
{
    public function index(Request $request)
    {
        $total = RackPartList::count();

        $rows = RackPartList::orderBy('rack_no')
            ->limit(10)->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Rack/index', [
            'rackData' => $rows,
            'totalRacks' => $total,
        ]);
    }

    public function export()
    {
        return Excel::download(
            new RackPartListExport,
            'rack-part-list-'.now()->format('Ymd_His').'.xlsx'
        );
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            DB::beginTransaction();

            // Step 1: Find rack_no that appear more than once
            $duplicateRackNos = RackPartList::select('rack_no')
                ->groupBy('rack_no')
                ->havingRaw('COUNT(*) > 1')
                ->pluck('rack_no')
                ->toArray();

            // Step 2: Delete ALL records with those rack_no
            if (!empty($duplicateRackNos)) {
                RackPartList::whereIn('rack_no', $duplicateRackNos)->delete();
                \Log::info('Deleted duplicates for racks: ' . implode(', ', $duplicateRackNos));
            }

            // Step 3: Import with knowledge of which were deleted
            // Pass the duplicate list so import knows to treat these as fresh inserts
            $import = new RackPartListImport($duplicateRackNos);
            Excel::import($import, $request->file('file'));

            DB::commit();

            $msg = 'Data berhasil diimport.';
            if (!empty($duplicateRackNos)) {
                $msg .= ' ' . count($duplicateRackNos) . ' rack duplikat diperbarui: ' . implode(', ', $duplicateRackNos);
            }

            return back()->with('success', $msg);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Import failed: ' . $e->getMessage());
            return back()->with('error', 'Import gagal: ' . $e->getMessage());
        }
    }

    public function template()
    {
        // Return a blank template with just the headings
        return Excel::download(
            new class implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings
            {
                public function array(): array
                {
                    return [];
                }

                public function headings(): array
                {
                    return [
                        'rack_no', 'item_code', 'part_name', 'cek',
                        'supplier', 'part_hydrolis', 'type_tractor', 'satuan', 'sample',
                    ];
                }
            },
            'rack-part-list-template.xlsx'
        );
    }
}

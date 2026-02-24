<?php

namespace App\Http\Controllers;

use App\Exports\RackPartListExport;
use App\Imports\RackPartListDuplicateScanner;
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

        $file = $request->file('file');

        try {
            DB::beginTransaction();

            // PHASE 1: Scan Excel to find duplicates within the file
            $scanner = new RackPartListDuplicateScanner();
            Excel::import($scanner, $file);

            $duplicatesInExcel = $scanner->getDuplicates();
            $allRackNosInExcel = $scanner->getAllRackNos();

            debugbar()->info('Excel scan complete', [
                'total_racks' => count($allRackNosInExcel),
                'duplicates_in_excel' => $duplicatesInExcel
            ]);

            // PHASE 2: Delete from database where rack_no appears multiple times in Excel
            // OR where rack_no exists in DB but will be replaced by Excel data
            if (!empty($duplicatesInExcel)) {
                // Delete duplicates that exist in Excel multiple times
                RackPartList::whereIn('rack_no', $duplicatesInExcel)->delete();
                debugbar()->info('Deleted DB duplicates for: ' . implode(', ', $duplicatesInExcel));
            }

            // Reset file pointer for second read
            $file->getRealPath(); // Ensure it's saved

            // PHASE 3: Import with knowledge of which were duplicates
            $import = new RackPartListImport($duplicatesInExcel);
            Excel::import($import, $file);

            DB::commit();

            $msg = 'Data berhasil diimport.';
            if (!empty($duplicatesInExcel)) {
                $msg .= ' ' . count($duplicatesInExcel) . ' duplikat ditemukan dan diperbaiki.';
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

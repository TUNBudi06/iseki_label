<?php

namespace App\Http\Controllers;

use App\Exports\RackPartListExport;
use App\Imports\RackPartListImport;
use App\Models\RackPartList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RackPartListController extends Controller
{
    public function index(Request $request)
    {
        $total = RackPartList::count();

        $rows = RackPartList::orderBy('rack_no')
            ->limit(10)
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

        Excel::import(new RackPartListImport, $request->file('file'));

        return back()->with('success', 'Data berhasil diimport.');
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

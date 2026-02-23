<?php

namespace App\Exports;

use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RackPartListExport implements FromCollection, ShouldAutoSize, WithEvents, WithHeadings, WithMapping, WithStyles
{
    // ...existing code...

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // A1:J1 covers all 10 heading columns
                $event->sheet->getDelegate()->setAutoFilter('A1:J1');
            },
        ];
    }

    public function collection()
    {
        return RackPartList::orderBy('rack_no')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Rack No',
            'Item Code',
            'Part Name',
            'CEK',
            'Supplier',
            'Part Hydrolis',
            'Type Tractor',
            'Satuan',
            'Sample',
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->rack_no,
            $row->item_code,
            $row->part_name,
            $row->cek,
            $row->supplier,
            $row->part_hydrolis ? 'Yes' : 'No',
            $row->type_tractor,
            $row->satuan,
            $row->sample,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F3F4F6'],
                ],
            ],
        ];
    }
}

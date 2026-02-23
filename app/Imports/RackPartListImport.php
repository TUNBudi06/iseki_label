<?php

namespace App\Imports;

use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class RackPartListImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function model(array $row): ?RackPartList
    {
        // Skip empty rows
        if (empty($row['item_code']) || empty($row['part_name'])) {
            return null;
        }

        $row = RackPartList::where('item_code', $row['item_code'])->orWhere('part_name', $row['part_name'])->orWhere('rack_no', $row['rack_no'])->first();

        if ($row) {
            $row->rack_no = $row['rack_no'];
            $row->item_code = $row['item_code'];
            $row->part_name = $row['part_name'];
            $row->cek = $row['cek'] ?? null;
            $row->supplier = $row['supplier'] ?? null;
            $row->part_hydrolis = $row['part_hydrolis'] ?? null;
            $row->type_tractor = $row['type_tractor'] ?? null;
            $row->satuan = $row['satuan'] ?? null;
            $row->sample = $row['sample'] ?? null;

            return $row;
        } else {
            return new RackPartList([
                'rack_no' => $row['rack_no'] ?? null,
                'item_code' => $row['item_code'],
                'part_name' => $row['part_name'],
                'cek' => in_array($row['cek'] ?? null, ['BENAR', 'SALAH'])
                    ? $row['cek']
                    : null,
                'supplier' => $row['supplier'] ?? null,
                'part_hydrolis' => strtolower($row['part_hydrolis'] ?? '') === 'yes' ? true : false,
                'type_tractor' => $row['type_tractor'] ?? null,
                'satuan' => $row['satuan'] ?? null,
                'sample' => $row['sample'] ?? null,
            ]);
        }
    }

    public function batchSize(): int
    {
        return 500;
    }

    public function chunkSize(): int
    {
        return 500;
    }
}

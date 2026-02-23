<?php

namespace App\Imports;

use App\Models\LoggerPerubahanModel;
use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;

class RackPartListImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow, WithUpserts
{
    public function model(array $row): ?RackPartList
    {
        // Skip empty rows
        if (empty($row['item_code']) || empty($row['rack_no'])) {
            return null;
        }

        // Check if record exists by item_code (unique identifier)
        $existing = RackPartList::where('rack_no', $row['rack_no'])->first();

        if ($existing && $existing->item_code != $row['item_code']) {
            $logger = new LoggerPerubahanModel();

            // Update existing record
            $logger->no_rack = $existing->rack_no = $row['rack_no'] ?? $existing->rack_no;
            $existing->part_name = $row['part_name'];
            $logger->before = $existing->item_code;
            $logger->after = $existing->item_code = $row['item_code'];
            $existing->cek = in_array($row['cek'] ?? null, ['BENAR', 'SALAH'])
                ? $row['cek']
                : $existing->cek;
            $existing->supplier = $row['supplier'] ?? $existing->supplier;
            $existing->part_hydrolis = (bool)$row['part_hydrolis'];
            $existing->type_tractor = $row['type_tractor'] ?? $existing->type_tractor;
            $existing->satuan = $row['satuan'] ?? $existing->satuan;
            $existing->sample = $row['sample'] ?? $existing->sample;

            if($logger->no_rack) $logger->save(); //prevent for null no_rack

            return $existing;
        } elseif ($existing && $existing->item_code === $row['item_code']){
            return $existing;
        }

        // Create new record
        return new RackPartList([
            'rack_no' => $row['rack_no'] ?? null,
            'item_code' => $row['item_code'],
            'part_name' => $row['part_name'],
            'cek' => in_array($row['cek'] ?? null, ['BENAR', 'SALAH'])
                ? $row['cek']
                : null,
            'supplier' => $row['supplier'] ?? null,
            'part_hydrolis' => strtolower($row['part_hydrolis'] ?? '') === 'yes'
                ? true
                : false,
            'type_tractor' => $row['type_tractor'] ?? null,
            'satuan' => $row['satuan'] ?? null,
            'sample' => $row['sample'] ?? null,
        ]);
    }

    public function uniqueBy(): string|array
    {
        return 'item_code'; // Prevents duplicates at database level
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

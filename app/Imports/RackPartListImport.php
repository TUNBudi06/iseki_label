<?php

namespace App\Imports;

use App\Models\LoggerPerubahanModel;
use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class RackPartListImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    private array $processedRacks = [];
    private array $duplicatesInExcel; // These should be fresh inserted

    public function __construct(array $duplicatesInExcel = [])
    {
        $this->duplicatesInExcel = $duplicatesInExcel;
    }

    public function model(array $row): ?RackPartList
    {
        if (empty($row['item_code']) || empty($row['rack_no'])) {
            return null;
        }

        $rackNo = $row['rack_no'];

        // Skip if we've processed this rack_no (duplicate in Excel)
        // make sure if it's a duplicate in Excel, we still process it once (fresh insert), but skip any further duplicates
        if (isset($this->processedRacks[$rackNo]) && !in_array($rackNo, $this->duplicatesInExcel)) {
            return null;
        }
        $this->processedRacks[$rackNo] = true;

        // Check if this was a duplicate in Excel (deleted from DB, should be fresh insert)
        $isExcelDuplicate = in_array($rackNo, $this->duplicatesInExcel);

        if ($isExcelDuplicate) {
            // Fresh insert (DB was cleared for this rack_no)
            return $this->createNewRecord($row);
        }

        // Check if exists in DB (non-duplicate, should update)
        $existing = RackPartList::where('rack_no', $rackNo)->first();

        if ($existing) {
            // Update and save immediately
            $this->updateExisting($existing, $row);
            return null;
        }

        // New record
        return $this->createNewRecord($row);
    }

    private function createNewRecord(array $row): RackPartList
    {
        return new RackPartList([
            'rack_no' => $row['rack_no'],
            'item_code' => $row['item_code'],
            'part_name' => $row['part_name'] ?? null,
            'cek' => in_array($row['cek'] ?? null, ['BENAR', 'SALAH']) ? $row['cek'] : null,
            'supplier' => $row['supplier'] ?? null,
            'part_hydrolis' => $this->parseBoolean($row['part_hydrolis'] ?? false),
            'type_tractor' => $row['type_tractor'] ?? null,
            'satuan' => $row['satuan'] ?? null,
            'sample' => $row['sample'] ?? null,
        ]);
    }

    private function updateExisting(RackPartList $existing, array $row): void
    {
        if ($existing->item_code != $row['item_code']) {
            try {
                $logger = new LoggerPerubahanModel();
                $logger->no_rack = $existing->rack_no;
                $logger->before = $existing->item_code;
                $logger->after = $row['item_code'];
                $logger->save();
            } catch (\Exception $e) {
                \Log::error('Failed to log change: ' . $e->getMessage());
            }
            $existing->item_code = $row['item_code'];
        }

        $existing->part_name = $row['part_name'] ?? $existing->part_name;
        $existing->cek = in_array($row['cek'] ?? null, ['BENAR', 'SALAH']) ? $row['cek'] : $existing->cek;
        $existing->supplier = $row['supplier'] ?? $existing->supplier;
        $existing->part_hydrolis = $this->parseBoolean($row['part_hydrolis'] ?? false);
        $existing->type_tractor = $row['type_tractor'] ?? $existing->type_tractor;
        $existing->satuan = $row['satuan'] ?? $existing->satuan;
        $existing->sample = $row['sample'] ?? $existing->sample;

        $existing->save();
    }

    private function parseBoolean($value): bool
    {
        if (is_bool($value)) return $value;
        if (is_numeric($value)) return (bool) $value;
        return strtolower((string)$value) === 'yes' || $value === '1' || $value === 'true';
    }

    public function batchSize(): int { return 500; }
    public function chunkSize(): int { return 500; }
}

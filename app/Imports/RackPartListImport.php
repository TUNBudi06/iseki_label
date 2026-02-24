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
    private array $duplicatesToRefresh; // Rack numbers that were deleted (should be fresh insert)

    public function __construct(array $duplicatesToRefresh = [])
    {
        $this->duplicatesToRefresh = $duplicatesToRefresh;
    }

    public function model(array $row): ?RackPartList
    {
        if (empty($row['item_code']) || empty($row['rack_no'])) {
            return null;
        }

        $rackNo = $row['rack_no'];
        $itemCode = $row['item_code'];

        //for checking if rack no is in dupplicate
        $isOnduplicate = !in_array($rackNo, $this->duplicatesToRefresh);

        // Skip duplicates within same file
        if (isset($this->processedRacks[$rackNo]) &&$isOnduplicate) {
            return null;
        }
        $this->processedRacks[$rackNo] = $itemCode;

        // Check if this rack was marked for refresh (deleted in controller)
        $isFreshInsert = in_array($rackNo, $this->duplicatesToRefresh);

        // If it's a fresh insert (was deleted), just create new
        if ($isFreshInsert) {
            return $this->createNewRecord($row);
        }

        // Otherwise, try to update existing
        $existing = RackPartList::where('rack_no', $rackNo)->first();

        if ($existing) {
            // Update existing and save immediately (don't return for batch)
            $this->updateExisting($existing, $row);
            return null; // Exclude from batch insert
        }

        // No existing found, create new
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
        // Log change if item_code differs
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

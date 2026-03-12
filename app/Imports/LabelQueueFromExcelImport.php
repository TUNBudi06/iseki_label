<?php

namespace App\Imports;

use App\Models\QueueLabelPrint;
use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class LabelQueueFromExcelImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    private int $importedCount = 0;

    public function __construct(
        private readonly string $defaultRequestedBy,
        private readonly string $defaultLabelType,
        private readonly bool $autoPrint = false,
    ) {}

    public function model(array $row): ?QueueLabelPrint
    {
        $rackNo = trim($row['rack_no'] ?? '');

        if (empty($rackNo)) {
            return null;
        }

        if (! RackPartList::where('rack_no', $rackNo)->exists()) {
            return null;
        }

        $labelType = in_array($row['label_type'] ?? '', ['kecil', 'besar', 'pallet'])
            ? $row['label_type']
            : $this->defaultLabelType;

        $quantity = isset($row['quantity']) && is_numeric($row['quantity']) && $row['quantity'] > 0
            ? (int) $row['quantity']
            : 1;

        $requestedBy = ! empty(trim($row['requested_by'] ?? ''))
            ? trim($row['requested_by'])
            : $this->defaultRequestedBy;

        $areaName = trim($row['area_name'] ?? '') ?: null;

        $urgent = in_array(strtolower(trim($row['urgent'] ?? '')), ['1', 'yes', 'ya', 'true']);

        $this->importedCount++;

        return new QueueLabelPrint([
            'rack_code' => $rackNo,
            'label_type' => $labelType,
            'quantity' => $quantity,
            'requested_by' => $requestedBy,
            'area_name' => $areaName,
            'urgent' => $urgent,
            'auto_print' => $this->autoPrint,
            'printed' => false,
        ]);
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }
}

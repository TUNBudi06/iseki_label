<?php

namespace App\Imports;

use App\Models\RackPartList;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

// First, scan the Excel to find duplicates
class RackPartListDuplicateScanner implements ToArray, WithHeadingRow
{
    private array $rackNos = [];
    private array $duplicates = [];

    public function array(array $array): ?array
    {
        foreach ($array as $row) {
            if (empty($row['rack_no'])) continue;

            $rackNo = $row['rack_no'];

            if (isset($this->rackNos[$rackNo])) {
                $this->duplicates[$rackNo] = true;
            } else {
                $this->rackNos[$rackNo] = true;
            }
        }

        return null; // Don't actually import
    }

    public function getDuplicates(): array
    {
        return array_keys($this->duplicates);
    }

    public function getAllRackNos(): array
    {
        return array_keys($this->rackNos);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QueueLabelPrint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PagePrintController extends Controller
{
    public function index(Request $request)
    {
        $ids = $request->query('labels', null);
        $idsPrint = [];
        if ($ids) {
            $idsPrint = json_decode($ids, true);
        }

        $list = [];
        QueueLabelPrint::with('RackList')->get()->each(function ($item) use ($idsPrint, &$list) {
            if (! in_array($item->id, $idsPrint)) {
                return null;
            }
            $data = [
                'rack_code' => $item->RackList->rack_no,
                'label_type' => $item->label_type,
                'id_label' => $item->id,
                'item_code' => $item->RackList ? $item->RackList->item_code : null,
                'type_tractor' => $item->RackList ? $item->RackList->type_tractor : null,
                'item_name' => $item->RackList ? $item->RackList->part_name : null,
                'sample' => $item->RackList ? $item->RackList->sample : null,
                'vendor' => $item->RackList ? $item->RackList->supplier : null,
                'hydrolist' => $item->RackList ? $item->RackList->part_hydrolis : null,
            ];

            if ($item->quantity > 1) {
                for ($i = 0; $i < $item->quantity; $i++) {
                    $list[] = $data;
                }
            } else {
                $list[] = $data;
            }

            return null;
        });

        return Inertia::render('PagePrint', [
            'idsPrint' => $idsPrint,
            'list' => $list,
        ]);
    }

    public function alreadyPrinted(Request $request)
    {
        $ids = $request->query('labels', null);
        $idsPrint = [];
        if ($ids) {
            $idsPrint = json_decode($ids, true);
        }

        return DB::transaction(function () use ($idsPrint) {
            $printedLabels = QueueLabelPrint::with('RackList')
                ->whereIn('id', $idsPrint)
                ->where('printed', true)
                ->get();

            $printedLabels->each(function ($item) {
                $item->printed = true;
                $item->save();
            });

            return response()->json([
                'success' => true,
                'message' => 'Labels marked as printed',
            ]);
        });
    }
}

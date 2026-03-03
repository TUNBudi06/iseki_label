<?php

namespace App\Http\Controllers;

use App\Models\QueueLabelPrint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutoPrintController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('AutoPrint/AutoPrintPage');
    }

    public function getAutoPrintList()
    {
        $autoPrintList = QueueLabelPrint::where('auto_print', true)
            ->where('printed', false)
            ->with('RackList')
            ->limit(10)
            ->get();

        debugbar()->log($autoPrintList);

        return response()->json($autoPrintList);
    }

    public function markAsPrinted(Request $request)
    {
        $ids = $request->input('ids');

        // Support both JSON-encoded string and plain array
        if (is_string($ids)) {
            $id_list = json_decode($ids, true);
        } else {
            $id_list = (array) $ids;
        }

        if (empty($id_list)) {
            return response()->json(['error' => 'No IDs provided'], 422);
        }

        debugbar()->info($id_list);
        QueueLabelPrint::whereIn('id', $id_list)->update(['printed' => true]);

        return response()->json(['marked' => count($id_list), 'ids' => $id_list]);
    }
}

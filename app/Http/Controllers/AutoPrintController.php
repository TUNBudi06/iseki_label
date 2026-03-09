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

    public function listAuto()
    {
        $autoPrintList = QueueLabelPrint::where('auto_print', true)
            ->where('printed', false)
            ->with('RackList')
            ->limit(10)
            ->get();

        debugbar()->log($autoPrintList);

        return response()->json($autoPrintList);
    }

    // Keep old name as alias for backward compatibility
    public function getAutoPrintList()
    {
        return $this->listAuto();
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

        // Use the actual DB update count — not just the submitted ID count.
        // This way the frontend can detect if rows weren't actually updated.
        $updated = QueueLabelPrint::whereIn('id', $id_list)->update(['printed' => true]);

        return response()->json([
            'marked' => $updated,
            'submitted' => count($id_list),
            'ids' => $id_list,
        ]);
    }
}

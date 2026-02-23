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
        $timestamp = now()->getTimestamp();
        $autoPrintList = QueueLabelPrint::where('auto_print', true)
            ->where('printed', false)
            ->with('RackList')
            ->get();

        debugbar()->log($autoPrintList);

        return response()->json($autoPrintList);
    }

    public function markAsPrinted(Request $request)
    {
        $ids = $request->input('ids');
        $id_list = json_decode($ids, true);
        debugbar()->info($id_list);
        QueueLabelPrint::whereIn('id', $id_list)->update(['printed' => true]);

        return $id_list;
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QueueLabelPrint;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): Response
    {
        $query = QueueLabelPrint::with('RackList')->get();

        $labelNotPrinted = $query->map(function ($item) {
            if (! $item->printed) {
                return $item;
            }

            return null;
        })->filter();

        $totallabeltoday = $query->map(function ($item) {
            $itemDate = Carbon::parse($item->created_at)->format('Y-m-d');
            $currentDate = Carbon::now()->format('Y-m-d');
            if ($itemDate == $currentDate) {
                return $item;
            }
        })->filter();

        $totallabelprinted = $query->map(function ($item) {
            if ($item->printed) {
                return $item;
            }
        })->filter();

        //        debugbar()->info($labelNotPrinted->toArray());

        return Inertia::render('Home', [
            'message' => 'Welcome to the Home Page!',
            'labelNotPrinted' => $labelNotPrinted,
            'totalLabelToday' => $totallabeltoday->count(),
            'totalLabelPrinted' => $totallabelprinted->count(),
        ]);
    }

    /**
     * Delete a label from queue.
     */
    public function destroy(int $id)
    {
        try {
            $label = QueueLabelPrint::findOrFail($id);

            $label->delete();

            return response()->json([
                'success' => true,
                'message' => 'Label berhasil dihapus dari queue',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus label: '.$e->getMessage(),
            ], 500);
        }
    }

    public function markAsPrinted(Request $request)
    {
        $index = $request->validate([
            'id' => 'required|integer',
        ])['id'];

        try {
            return DB::transaction(function () use ($index) {
                $label = QueueLabelPrint::findOrFail($index);
                $label->printed = true;
                $label->save();

                return \response(null, 204);
            });
        } catch (Exception $e) {
            return \response(null, 500);
        }
    }

    /**
     * Toggle auto_print flag for a queue item.
     */
    public function toggleAutoPrint(int $id)
    {
        try {
            $label = QueueLabelPrint::findOrFail($id);
            $label->auto_print = ! $label->auto_print;
            $label->save();

            return response()->json([
                'success' => true,
                'auto_print' => $label->auto_print,
                'message' => $label->auto_print
                    ? 'Label ditambahkan ke auto print queue'
                    : 'Label dikeluarkan dari auto print queue',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status auto print: '.$e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QueueLabelPrint;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrintHistoryController extends Controller
{
    /**
     * Display the print history page.
     */
    public function index(): Response
    {
        // Get only printed labels with RackList relationship
        $printedLabels = QueueLabelPrint::with('RackList')
            ->where('printed', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        // Count labels printed today
        $printedToday = QueueLabelPrint::where('printed', true)
            ->whereDate('updated_at', Carbon::today())
            ->count();

        // Total printed labels
        $totalPrinted = $printedLabels->count();

        return Inertia::render('PrintHistory', [
            'historyData' => $printedLabels,
            'printedToday' => $printedToday,
            'totalPrinted' => $totalPrinted,
        ]);
    }

    /**
     * Reprint a single label.
     */
    public function reprintSingle(Request $request, int $id)
    {
        try {
            $label = QueueLabelPrint::with('RackList')->findOrFail($id);

            // Generate print URL with label ID
            $printUrl = route('print.label', ['labels' => json_encode([$id])]);

            return response()->json([
                'success' => true,
                'message' => 'Label ready to print',
                'printUrl' => $printUrl,
                'label' => $label,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reprint label: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reprint multiple labels.
     */
    public function reprintMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:queue_label_prints,id',
        ]);

        try {
            $ids = $request->input('ids');

            // Verify all IDs exist and are printed
            $labels = QueueLabelPrint::whereIn('id', $ids)
                ->where('printed', true)
                ->get();

            if ($labels->count() !== count($ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Some labels not found or not yet printed',
                ], 400);
            }

            // Generate print URL with label IDs
            $printUrl = route('print.label', ['labels' => json_encode($ids)]);

            return response()->json([
                'success' => true,
                'message' => count($ids).' labels ready to reprint',
                'printUrl' => $printUrl,
                'count' => count($ids),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reprint labels: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a label from history.
     */
    public function destroy(int $id)
    {
        try {
            $label = QueueLabelPrint::findOrFail($id);

            // Only allow deletion of printed labels
            if (! $label->printed) {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only delete printed labels from history',
                ], 400);
            }

            $label->delete();

            return response()->json([
                'success' => true,
                'message' => 'Label deleted from history',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete label: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete multiple labels from history.
     */
    public function destroyMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:queue_label_prints,id',
        ]);

        try {
            $ids = $request->input('ids');

            // Only delete printed labels
            $deleted = QueueLabelPrint::whereIn('id', $ids)
                ->where('printed', true)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => $deleted.' labels deleted from history',
                'deleted_count' => $deleted,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete labels: '.$e->getMessage(),
            ], 500);
        }
    }
}

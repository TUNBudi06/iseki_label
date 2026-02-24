<?php

namespace App\Http\Controllers;

use App\Models\LoggerPerubahanModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoggerPerubahanController extends Controller
{
    public function index(Request $request)
    {
        $query = LoggerPerubahanModel::query()
            ->orderBy('created_at', 'desc');

        // Filter by rack no
        if ($request->filled('no_rack')) {
            $query->where('no_rack', 'like', '%' . $request->no_rack . '%');
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->get();

        return Inertia::render('Rack/logs-perubahan', [
            'logs' => $logs,
            'filters' => $request->only(['no_rack', 'date_from', 'date_to']),
        ]);
    }

    public function destroy($id)
    {
        $log = LoggerPerubahanModel::findOrFail($id);
        $log->delete();

        return redirect()->back()->with('success', 'Log deleted successfully');
    }
}

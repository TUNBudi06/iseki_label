<?php

namespace App\Http\Controllers;

use App\Models\QueueLabelPrint;
use Carbon\Carbon;
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

        $labelNotPrinted =  $query->map(function ($item) {
            if(!$item->printed){
                return $item;
            }
            return null;
        });

        $totallabeltoday = $query->map(function ($item) {
            $itemDate = Carbon::parse($item->created_at)->format('Y-m-d');
            $currentDate = Carbon::now()->format('Y-m-d');
            if ($itemDate == $currentDate) {
                return $item;
            }
        });

        $totallabelprinted = $query->map(function ($item) {
            if($item->printed){
                return $item;
            }
        });

        return Inertia::render('Home', [
            'message' => 'Welcome to the Home Page!',
            'labelNotPrinted' => $labelNotPrinted->filter(),
            'totalLabelToday' => $totallabeltoday->filter()->count(),
            'totalLabelPrinted' => $totallabelprinted->filter()->count(),
        ]);
    }
}


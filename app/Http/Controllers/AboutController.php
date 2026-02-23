<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the about page.
     */
    public function index(): Response
    {
        return Inertia::render('About', [
            'title' => 'About This Project',
            'description' => 'Learn more about the technologies used in this demo',
        ]);
    }
}

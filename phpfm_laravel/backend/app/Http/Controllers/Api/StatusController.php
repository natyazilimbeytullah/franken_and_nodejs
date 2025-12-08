<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Return a simple JSON status response. No DB operations.
     */
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'ok'
        ],200);
    }
}

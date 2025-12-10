<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExampleController extends Controller
{
    private static int $counter = 0;

    public function index($id )
    {

        sleep($id);
        
        self::$counter++;

        return response()->json([
            'counter2' => self::$counter
        ]);
    }
}

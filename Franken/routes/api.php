<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExampleController;

Route::get('/status', function () {
    return response()->json(['status' => 'ok2'], 200);
});


Route::get('/example/{id?}',[ExampleController::class,'index']);

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Henkilo;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//function comp($a, $b) {
//    echo $a;
//    return strcmp($a->teksti, $b->teksti);
//}

Route::get('users/{userId}/cards', function($userId) {
    $templateCard = [
        'id' => -1,
        'teksti' => "This is a template card",
        'hallitsija' => true
    ];

    $cards = Henkilo::find($userId)->cards()->get();
    $cards->push($templateCard);
    $cards = $cards->sortBy("teksti")->values();
    return $cards;
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    #return $request->user();
    return true;
});


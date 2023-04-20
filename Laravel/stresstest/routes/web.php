<?php

use Illuminate\Support\Facades\Route;
#use App\Events\SendTimeToClientEvent;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*Route::get('/clock', function(Request $request) {
    print($request);
    $message = $request->input("message", null);
    if($message == "requestTime") {
        //event(new SendTimeToClientEvent());
        SendTimeToClientEvent::dispatch();
    }
    //return view('eventListener');
    return null;
});*/

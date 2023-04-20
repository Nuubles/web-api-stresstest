<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Henkilo;
//use App\Http\Websocket;

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

function cmp($a, $b) {
    echo $a;
    return strcmp($a->teksti, $b->teksti);
}

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

Route::get('/clock', function() {
    //event(new \App\Events\ClockEvent());
    return null;
});

//Route::get('/clock', function(Request $request) {
//    $message = $request->input("message", null);
//    if($message == "requestTime") {
//        SendTimeToClientEvent::dispatch();
//    }
//    return null;
//});

//Route::get('/clock', function(Request $request) {
//    $message = $request->input("message", null);
//    if($message == "requestTime") {
//        SendTimeToClientEvent::dispatch();
//    }
//    return null;
//});
//Route::get('/clock', function () {
//    return view('welcome');
//});

//WebSocketsRouter::webSocket('/clock', function ($webSocket) {
//    $webSocket->onMessage('requestTime', function ($client, $data) use ($webSocket) {
//        $webSocket->broadcast()->emit('systemTime', date('Y-m-d H:i:s'));
//    });
//});

//Route::get('/clock', function(Request $request) {
//    $message = $request->input("message", null);
//    if($message == "requestTime") {
//        ClockEvent::dispatch();
//    }
//    return null;
//});
//Route::get('/clock', function() {
//    event(new \App\Events\ClockEvent());
//    return null;
//});
#WebSocketsRouter::webSocket('/clock', [\App\Http\Controllers\WebsocketController::class, 'clock']);

#WebSocketsRouter::webSocket('/clock', 'App\Http\Controllers\WebsocketController@clock');
#\Http\Controllers\WebsocketController::class, 'clock']);
#WebSocketsRouter::webSocket('/clock', [\App\Http\Controllers\WebsocketController::class, 'clock']);
#WebSocketsRouter::webSocket('clock', \App\WebSocketHandlers\ClockHandler::class);
#Route::get('/clock', [WebsocketController::class, 'clock'])->name('websocket.clock');


#Route::get('/clock', function () {
#    $server = IoServer::factory(
#        new HttpServer(
#            new WsServer(
#                new Websocket()
#            )
#        ),
#        3000
#    );
#
#    $server->run();
#});

#Route::get('/clock', 'WebsocketController@onOpen');
#Route::get('/clock', function(Request $request) {
#    $message = $request->input("message", null);
#    if($message == "requestTime") {
#        SendTimeToClientEvent::dispatch();
#    }
#    return null;
#});

#Route::get('/clock', function () {
#    return view('websocket');
#});

#WebSocketsRouter::webSocket('/clock', App\Http\Controllers\WebSocketController::class);
#Route::post('/clock', 'EventController@handleRequestTime');
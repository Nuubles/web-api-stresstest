<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('clock-channel', function($user) {
    return true;
});

#Broadcast::channel('clock', function ($user) {
#    return true;
#});
#Broadcast::channel('App.User.{id}', function ($user, $id) {
#    return (int) $user->id === (int) $id;
#});
#use App\Http\Controllers\WebSocketController;

#Broadcast::channel('clock', [WebSocketController::class, 'authorize']);
#Broadcast::channel('system-time', function () {
#    return true;
#});
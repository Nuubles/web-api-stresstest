<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        #Route::get('/socket', function () {
        #    return view('socket');
        #});
#
        #WebSocketsRouter::webSocket('/clock', App\Http\Controllers\WebSocketController::class);
    }
}

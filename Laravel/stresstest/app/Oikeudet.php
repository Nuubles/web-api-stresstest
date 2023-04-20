<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Oikeudet extends Model
{
    protected $table = 'oikeudet';

    protected $hidden = [
        'laravel_through_key'
    ];
}

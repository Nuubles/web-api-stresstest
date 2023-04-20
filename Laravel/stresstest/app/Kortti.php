<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Kortti extends Model
{
    protected $table = 'kortti';
    protected $primaryKey = 'id';

    protected $hidden = [
        'laravel_through_key'
    ];
}

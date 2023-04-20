<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Henkilo extends Model
{
    protected $table = 'henkilo';
    protected $primaryKey = 'id';

    public function cards(): HasManyThrough
    {
        return $this->hasManyThrough(Kortti::class, Oikeudet::class, 'henkilo_id', 'id', 'id', 'kortti_id')->select('id', 'teksti', 'hallitsija');
    }
}

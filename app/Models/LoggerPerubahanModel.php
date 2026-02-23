<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoggerPerubahanModel extends Model
{
    protected $table = 'logger_perubahan_models';

    protected $fillable = [
        'no_rack',
        'before',
        'after',
        'description',
    ];
}

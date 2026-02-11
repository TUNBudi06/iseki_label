<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueLabelPrint extends Model
{
    // Define the table associated with the model
    protected $table = 'queue_label_prints';

    // Dont use id incrementing
    public $incrementing = false;
    // Define the primary key
    protected $primaryKey = 'rack_code';

    // Define the fillable attributes
    protected $fillable = [
        'rack_code',
        'label_type',
        'quantity',
        'requested_by',
        'area_name',
    ];
}

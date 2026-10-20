<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'slug',
        'short_description',
        'description',
        'event_type',
        'banner_image',
        'start_date',
        'end_date',
        'modality',
        'location_name',
        'address',
        'city',
        'link',
        'admission_type',
        'admission_price',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'admission_price' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}


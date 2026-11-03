<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommercialDocument extends Model
{
    use HasFactory;

    protected $table = 'commercial_documents';

    protected $fillable = [
        'company_id',
        'doc_number',
        'doc_type',
        'title',
        'client_name',
        'client_nit',
        'client_phone',
        'client_email',
        'client_city',
        'client_address',
        'date',
        'due_date',
        'status',
        'payment_terms',
        'delivery_time',
        'validity_days',
        'currency',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total',
        'notes',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
        'validity_days' => 'integer',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CommercialDocumentItem::class, 'document_id');
    }
}


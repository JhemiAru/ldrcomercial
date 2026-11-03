<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommercialDocumentItem extends Model
{
    use HasFactory;

    protected $table = 'commercial_document_items';

    protected $fillable = [
        'document_id',
        'product_id',
        'name',
        'sku',
        'unit',
        'quantity',
        'price',
        'discount',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(CommercialDocument::class, 'document_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}


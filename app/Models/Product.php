<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'category_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'price',
        'original_price',
        'wholesale_price',
        'min_wholesale_qty',
        'currency',
        'price_type',
        'unit',
        'main_image',
        'images',
        'in_stock',
        'stock_quantity',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'min_wholesale_qty' => 'integer',
        'images' => 'array',
        'in_stock' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}


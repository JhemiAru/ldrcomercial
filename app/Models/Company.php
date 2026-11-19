<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'legal_name',
        'slug',
        'tax_id',
        'logo',
        'banner',
        'banner_2',
        'banner_3',
        'qr_payment',
        'bank_account_info',
        'short_description',
        'description',
        'phone',
        'whatsapp',
        'email',
        'website',
        'address',
        'city',
        'department',
        'latitude',
        'longitude',
        'google_maps_link',
        'facebook',
        'instagram',
        'tiktok',
        'linkedin',
        'is_verified',
        'is_active',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Utilizar el slug para generar rutas amigables en Laravel (con fallback al ID)
     */
    public function getRouteKey()
    {
        return $this->slug ?: $this->getKey();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted()
    {
        static::creating(function ($company) {
            if (empty($company->slug)) {
                $company->slug = static::generateUniqueSlug($company->name);
            }
        });
    }

    /**
     * Genera un slug limpio y único basado en el nombre de la empresa.
     */
    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = \Illuminate\Support\Str::slug($name);
        if (empty($baseSlug)) {
            $baseSlug = 'empresa';
        }

        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $counter++;
            $slug = "{$baseSlug}-{$counter}";
        }

        return $slug;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function commercialDocuments(): HasMany
    {
        return $this->hasMany(CommercialDocument::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(CommercialDocument::class)->where('doc_type', 'quotation');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(CommercialDocument::class)->where('doc_type', 'sale');
    }
}


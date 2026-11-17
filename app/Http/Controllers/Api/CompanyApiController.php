<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyApiController extends BaseApiController
{
    /**
     * Listado de empresas para el mapa interactivo y directorio comercial.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Company::with(['category', 'products' => function ($q) {
            $q->where('status', 'published');
        }])
        ->where('is_active', true)
        ->where('is_verified', true);

        // Filtro por categoría (id o slug)
        if ($request->filled('category')) {
            $categoryParam = $request->category;
            $query->where(function ($q) use ($categoryParam) {
                if (is_numeric($categoryParam)) {
                    $q->where('category_id', $categoryParam);
                } else {
                    $q->whereHas('category', function ($catQ) use ($categoryParam) {
                        $catQ->where('slug', $categoryParam)->orWhere('name', 'like', "%{$categoryParam}%");
                    });
                }
            });
        }

        // Filtro por búsqueda textual
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('legal_name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($catQ) use ($search) {
                      $catQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por ciudad
        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        $companies = $query->get()->map(function ($c) {
            return $this->formatCompany($c);
        });

        return $this->successResponse($companies, 'Empresas obtenidas exitosamente');
    }

    /**
     * Detalle completo de una empresa junto con su catálogo de productos.
     */
    public function show($idOrSlug): JsonResponse
    {
        $query = Company::with([
            'category',
            'products' => function ($q) {
                $q->where('status', 'published')->with(['brand', 'category'])->latest();
            },
            'events' => function ($q) {
                $q->where('status', 'active')->latest();
            }
        ]);

        $company = is_numeric($idOrSlug)
            ? $query->where('id', $idOrSlug)->first()
            : $query->where('slug', $idOrSlug)->first();

        if (!$company || (!$company->is_active && !auth('sanctum')->check())) {
            return $this->errorResponse('Empresa no encontrada', 404);
        }

        $formatted = $this->formatCompany($company);

        // Agregar productos detallados
        $formatted['products'] = $company->products->map(function ($p) use ($company) {
            $imageUrl = self::formatImageUrl($p->main_image);
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'sku' => $p->sku,
                'short_description' => $p->short_description,
                'description' => $p->description,
                'price' => (float) $p->price,
                'original_price' => $p->original_price ? (float) $p->original_price : null,
                'currency' => $p->currency ?: 'BOB',
                'in_stock' => (bool) $p->in_stock,
                'image_url' => $imageUrl,
                'brand_name' => $p->brand ? $p->brand->name : null,
                'category_name' => $p->category ? $p->category->name : null,
                // Compatibilidad Android
                'nombre' => $p->name,
                'precio' => (float) $p->price,
                'descuento' => $p->original_price ? (float) $p->original_price : 0.0,
                'imagen' => $imageUrl ?: '',
                'empresa' => $company->name,
                'redireccion' => $company->slug,
                'telefono' => $company->whatsapp ?: $company->phone,
            ];
        });

        // Agregar eventos
        $formatted['events'] = $company->events->map(function ($e) use ($company) {
            $bannerUrl = self::formatImageUrl($e->banner_image);
            return [
                'id' => $e->id,
                'title' => $e->title,
                'slug' => $e->slug,
                'short_description' => $e->short_description,
                'banner_image_url' => $bannerUrl,
                'start_date' => $e->start_date ? $e->start_date->toISOString() : null,
                'end_date' => $e->end_date ? $e->end_date->toISOString() : null,
                'link' => $e->link,
                // Compatibilidad Android
                'titulo' => $e->title,
                'fecha' => $e->start_date ? $e->start_date->format('Y-m-d') : '',
                'imagen' => $bannerUrl ?: '',
                'video' => $e->link ?: '',
                'redireccion' => $company->slug,
            ];
        });

        return $this->successResponse($formatted, 'Detalle de empresa obtenido');
    }

    private function formatCompany(Company $c): array
    {
        $logoUrl = self::formatImageUrl($c->logo);
        $bannerUrl = self::formatImageUrl($c->banner);
        $banner2Url = self::formatImageUrl($c->banner_2);
        $banner3Url = self::formatImageUrl($c->banner_3);

        $carouselImages = array_values(array_filter([
            $bannerUrl,
            $banner2Url,
            $banner3Url,
        ]));

        if (empty($carouselImages) && $logoUrl) {
            $carouselImages = [$logoUrl];
        }

        $phoneOrWa = $c->whatsapp ?: $c->phone ?: '';

        return [
            'id' => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
            'legal_name' => $c->legal_name,
            'tax_id' => $c->tax_id,
            'logo_url' => $logoUrl,
            'banner_url' => $bannerUrl,
            'banner_2_url' => $banner2Url,
            'banner_3_url' => $banner3Url,
            'carousel_images' => $carouselImages,
            'qr_payment_url' => self::formatImageUrl($c->qr_payment),
            'short_description' => $c->short_description,
            'description' => $c->description,
            'phone' => $c->phone,
            'whatsapp' => $c->whatsapp,
            'email' => $c->email,
            'website' => $c->website,
            'address' => $c->address,
            'city' => $c->city,
            'department' => $c->department,
            'latitude' => $c->latitude !== null ? (float) $c->latitude : null,
            'longitude' => $c->longitude !== null ? (float) $c->longitude : null,
            'google_maps_link' => $c->google_maps_link,
            'facebook' => $c->facebook,
            'instagram' => $c->instagram,
            'tiktok' => $c->tiktok,
            'linkedin' => $c->linkedin,
            'is_verified' => (bool) $c->is_verified,
            'products_count' => $c->products ? $c->products->count() : 0,
            'category' => $c->category ? [
                'id' => $c->category->id,
                'name' => $c->category->name,
                'slug' => $c->category->slug,
                'icon' => $c->category->icon,
            ] : null,
            // Campos de compatibilidad directa con el modelo Lugar de Android
            'nombre' => $c->name,
            'icono' => $logoUrl ?: '',
            'promocion' => $c->short_description ?: $c->description ?: '',
            'promo' => $c->description ?: '',
            'categoria' => $c->category ? $c->category->name : 'Comercial',
            'numero' => $phoneOrWa,
            'atencion' => 'Lunes a Viernes 08:30 - 18:30',
            'redireccion' => $c->slug,
            'imagenes' => $carouselImages,
            'ubicacion' => [
                'latitude' => (float) ($c->latitude ?? -16.5000),
                'longitude' => (float) ($c->longitude ?? -68.1500),
            ],
        ];
    }
}

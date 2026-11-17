<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\HomeBanner;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HomeApiController extends BaseApiController
{
    /**
     * Datos completos para la pantalla de inicio de la aplicación móvil.
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('refresh')) {
            Cache::forget('api_v1_home_feed');
        }

        $data = Cache::remember('api_v1_home_feed', 60, function () {
            return $this->buildHomeFeed();
        });

        return $this->successResponse($data, 'Datos de inicio cargados exitosamente');
    }

    private function buildHomeFeed(): array
    {
        // 1. Banners principales
        $bannersCollection = HomeBanner::active()->ordered()->get();

        if ($bannersCollection->isEmpty()) {
            // Fallback a empresas verificadas con banner o fotos
            $banners = Company::where('is_active', true)
                ->where(function ($q) {
                    $q->whereNotNull('banner')
                        ->orWhereNotNull('carousel_banners')
                        ->orWhereNotNull('logo');
                })
                ->take(5)
                ->get()
                ->map(function ($c, $index) {
                    $img = $c->banner ?: (is_array($c->carousel_banners) && !empty($c->carousel_banners) ? $c->carousel_banners[0] : $c->logo);
                    $imageUrl = self::formatImageUrl($img);
                    return [
                        'id' => $c->id,
                        'title' => $c->name,
                        'subtitle' => $c->slogan ?: $c->description,
                        'image_url' => $imageUrl,
                        'link' => $c->slug,
                        'order' => $index,
                        'nombre' => $c->name,
                        'imagen' => $imageUrl,
                        'redireccion' => $c->slug,
                    ];
                })
                ->filter(function ($b) {
                    return !empty($b['imagen']);
                })
                ->values();
        } else {
            $banners = $bannersCollection->map(function ($b) {
                $imageUrl = self::formatImageUrl($b->image);
                return [
                    'id' => $b->id,
                    'title' => $b->title,
                    'subtitle' => $b->subtitle,
                    'image_url' => $imageUrl,
                    'link' => $b->link,
                    'order' => $b->order,
                    // Alias compatibles con la app Android
                    'nombre' => $b->title,
                    'imagen' => $imageUrl,
                    'redireccion' => $b->link ?: '',
                ];
            });
        }

        // 2. Categorías activas
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }, 'companies' => function ($q) {
                $q->where('is_active', true)->where('is_verified', true);
            }])
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'icon' => $cat->icon,
                    'type' => $cat->type,
                    'description' => $cat->description,
                    'products_count' => $cat->products_count,
                    'companies_count' => $cat->companies_count,
                ];
            });

        // 3. Productos en oferta / promoción
        $promotions = Product::with(['company', 'category', 'brand'])
            ->whereNotNull('original_price')
            ->whereColumn('original_price', '>', 'price')
            ->where('status', 'published')
            ->take(10)
            ->get()
            ->map(function ($p) {
                return $this->formatProduct($p);
            });

        // 4. Productos destacados
        $featuredProducts = Product::with(['company', 'category', 'brand'])
            ->where('is_featured', true)
            ->where('status', 'published')
            ->take(15)
            ->get()
            ->map(function ($p) {
                return $this->formatProduct($p);
            });

        // 5. Empresas destacadas / activas
        $companies = Company::with('category')
            ->where('is_active', true)
            ->where('is_verified', true)
            ->take(10)
            ->get()
            ->map(function ($c) {
                return $this->formatCompanySummary($c);
            });

        // 6. Productos recientes para carruseles por categoría
        $recentProducts = Product::with(['company', 'category', 'brand'])
            ->where('status', 'published')
            ->latest()
            ->take(60)
            ->get()
            ->map(function ($p) {
                return $this->formatProduct($p);
            });

        // 7. Próximos eventos
        $events = Event::with('company')
            ->where('status', 'active')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($e) {
                return $this->formatEvent($e);
            });

        // 7. Productos agrupados por categoría para carruseles horizontales
        $sections = [];
        $activeCatsWithProducts = Category::where('is_active', true)
            ->whereHas('products', function ($q) {
                $q->where('status', 'published');
            })
            ->with(['products' => function ($q) {
                $q->where('status', 'published')->with(['company', 'brand'])->latest()->take(10);
            }])
            ->take(8)
            ->get();

        foreach ($activeCatsWithProducts as $cat) {
            $sections[] = [
                'category_id' => $cat->id,
                'category_name' => $cat->name,
                'category_slug' => $cat->slug,
                'category_icon' => $cat->icon,
                'products' => $cat->products->map(function ($p) use ($cat) {
                    $p->setRelation('category', $cat);
                    return $this->formatProduct($p);
                }),
            ];
        }

        return [
            'banners' => $banners,
            'categories' => $categories,
            'featured_products' => $featuredProducts,
            'promotions' => $promotions,
            'recent_products' => $recentProducts,
            'companies' => $companies,
            'events' => $events,
            'sections' => $sections,
        ];
    }

    private function formatProduct(Product $p): array
    {
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
            'is_featured' => (bool) $p->is_featured,
            'image_url' => $imageUrl,
            'brand' => $p->brand ? [
                'id' => $p->brand->id,
                'name' => $p->brand->name,
            ] : null,
            'category' => $p->category ? [
                'id' => $p->category->id,
                'name' => $p->category->name,
                'slug' => $p->category->slug,
            ] : null,
            'company' => $p->company ? [
                'id' => $p->company->id,
                'name' => $p->company->name,
                'slug' => $p->company->slug,
                'phone' => $p->company->phone,
                'whatsapp' => $p->company->whatsapp,
                'logo_url' => self::formatImageUrl($p->company->logo),
            ] : null,
            // Campos de compatibilidad directa con el modelo Producto de Android
            'nombre' => $p->name,
            'empresa' => $p->company ? $p->company->name : '',
            'redireccion' => $p->company ? $p->company->slug : '',
            'precio' => (float) $p->price,
            'descuento' => $p->original_price ? (float) $p->original_price : 0.0,
            'imagen' => $imageUrl ?: '',
            'marca' => $p->brand ? $p->brand->name : '',
            'categoria' => $p->category_id,
            'categoriapri' => $p->category ? $p->category->slug : '',
            'telefono' => $p->company ? ($p->company->whatsapp ?: $p->company->phone) : '',
        ];
    }

    private function formatCompanySummary(Company $c): array
    {
        $logoUrl = self::formatImageUrl($c->logo);
        return [
            'id' => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
            'logo_url' => $logoUrl,
            'short_description' => $c->short_description,
            'city' => $c->city,
            'category_name' => $c->category ? $c->category->name : null,
            // Compatibilidad Android
            'nombre' => $c->name,
            'icono' => $logoUrl ?: '',
            'redireccion' => $c->slug,
        ];
    }

    private function formatEvent(Event $e): array
    {
        $bannerUrl = self::formatImageUrl($e->banner_image);
        return [
            'id' => $e->id,
            'title' => $e->title,
            'slug' => $e->slug,
            'short_description' => $e->short_description,
            'description' => $e->description,
            'banner_image_url' => $bannerUrl,
            'start_date' => $e->start_date ? $e->start_date->toISOString() : null,
            'end_date' => $e->end_date ? $e->end_date->toISOString() : null,
            'company_name' => $e->company ? $e->company->name : null,
            // Compatibilidad Android ItemEventos
            'titulo' => $e->title,
            'nombre' => $e->title,
            'descripcion' => $e->short_description ?: $e->description ?: '',
            'fecha' => $e->start_date ? $e->start_date->format('Y-m-d') : '',
            'imagen' => $bannerUrl ?: '',
            'imagenURL' => $bannerUrl ?: '',
            'video' => $e->link ?: '',
            'lugar' => $e->location_name ?: $e->city ?: '',
            'redireccion' => $e->company ? $e->company->slug : '',
        ];
    }
}

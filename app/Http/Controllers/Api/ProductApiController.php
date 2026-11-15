<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use App\Services\SmartSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductApiController extends BaseApiController
{
    /**
     * Búsqueda y catálogo de productos para la app móvil.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['company', 'category', 'brand'])
            ->where('status', 'published')
            ->whereHas('company', function ($q) {
                $q->where('is_active', true);
            });

        // 1. Búsqueda inteligente con SmartSearchService (etiquetas, marcas, sinónimos)
        if ($request->filled('search')) {
            $term = trim($request->search);
            SmartSearchService::applyProductSearch($query, $term);
        }

        // 2. Filtro por categoría
        if ($request->filled('category')) {
            $catParam = $request->category;
            $query->where(function ($q) use ($catParam) {
                if (is_numeric($catParam)) {
                    $q->where('category_id', $catParam);
                } else {
                    $q->whereHas('category', function ($catQ) use ($catParam) {
                        $catQ->where('slug', $catParam)->orWhere('name', 'like', "%{$catParam}%");
                    });
                }
            });
        }

        // 3. Filtro por empresa
        if ($request->filled('company')) {
            $compParam = $request->company;
            $query->where(function ($q) use ($compParam) {
                if (is_numeric($compParam)) {
                    $q->where('company_id', $compParam);
                } else {
                    $q->whereHas('company', function ($cQ) use ($compParam) {
                        $cQ->where('slug', $compParam);
                    });
                }
            });
        }

        // 4. Filtro por ofertas / promociones
        if ($request->boolean('offers')) {
            $query->whereNotNull('original_price')->whereColumn('original_price', '>', 'price');
        }

        // 5. Filtro por destacados
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = min((int) $request->input('per_page', 24), 50);
        $paginator = $query->latest()->paginate($perPage);

        $items = collect($paginator->items())->map(function ($p) {
            return $this->formatProduct($p);
        });

        return $this->successResponse([
            'items' => $items,
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'has_more' => $paginator->hasMorePages(),
        ], 'Productos obtenidos exitosamente');
    }

    /**
     * Detalle de un producto individual.
     */
    public function show($idOrSlug): JsonResponse
    {
        $query = Product::with(['company', 'category', 'brand']);

        $product = is_numeric($idOrSlug)
            ? $query->where('id', $idOrSlug)->first()
            : $query->where('slug', $idOrSlug)->first();

        if (!$product || $product->status !== 'published') {
            return $this->errorResponse('Producto no encontrado', 404);
        }

        $formatted = $this->formatProduct($product);

        // Galería de imágenes adicionales
        $gallery = [];
        if (!empty($product->images) && is_array($product->images)) {
            foreach ($product->images as $img) {
                $gallery[] = self::formatImageUrl($img);
            }
        }
        $formatted['gallery'] = $gallery;

        // Productos relacionados
        $formatted['related'] = Product::with(['company', 'category', 'brand'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->take(6)
            ->get()
            ->map(function ($rel) {
                return $this->formatProduct($rel);
            });

        return $this->successResponse($formatted, 'Detalle del producto');
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
            'tags' => $p->tags,
            'price' => (float) $p->price,
            'original_price' => $p->original_price ? (float) $p->original_price : null,
            'wholesale_price' => $p->wholesale_price ? (float) $p->wholesale_price : null,
            'currency' => $p->currency ?: 'BOB',
            'unit' => $p->unit ?: 'unidad',
            'in_stock' => (bool) $p->in_stock,
            'stock_quantity' => $p->stock_quantity,
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
                'city' => $p->company->city,
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
        ];
    }
}

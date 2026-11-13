<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use App\Services\SmartSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchSuggestionController extends Controller
{
    /**
     * Retorna sugerencias predictivas de búsqueda en tiempo real
     * con detección de intenciones semánticas (económico, ofertas, mayorista)
     * para productos, empresas verificadas y categorías comerciales.
     */
    public function suggestions(Request $request): JsonResponse
    {
        $term = trim((string) $request->input('q', ''));

        if (mb_strlen($term) < 2) {
            return response()->json([
                'query' => $term,
                'products' => [],
                'companies' => [],
                'categories' => [],
                'intent_label' => null,
                'total' => 0,
            ]);
        }

        // 1. Productos usando SmartSearchService (inteligencia semántica + tags + intención)
        $productQuery = Product::with(['company', 'category', 'brand'])->where('status', 'published');
        $searchMeta = SmartSearchService::applyProductSearch($productQuery, $term);
        
        $products = $productQuery->take(6)->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'price' => number_format((float) $p->price, 2, '.', ','),
                'currency' => $p->currency ?: 'Bs.',
                'image' => $p->main_image ?: null,
                'company_name' => $p->company ? $p->company->name : null,
                'category_name' => $p->category ? $p->category->name : null,
                'brand_name' => $p->brand ? $p->brand->name : null,
                'url' => route('products.show', $p->id),
            ];
        });

        // 2. Empresas verificadas y activas (buscando por término limpio o original)
        $cleanTerm = $searchMeta['clean_term'] ?: $term;
        $companies = Company::with('category')
            ->where('is_active', true)
            ->where('is_verified', true)
            ->where(function ($query) use ($term, $cleanTerm) {
                $query->where('name', 'like', "%{$term}%")
                      ->orWhere('name', 'like', "%{$cleanTerm}%")
                      ->orWhere('legal_name', 'like', "%{$term}%")
                      ->orWhere('city', 'like', "%{$term}%");
            })
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'logo' => $c->logo ?: null,
                    'city' => $c->city ?: null,
                    'category_name' => $c->category ? $c->category->name : null,
                    'is_verified' => (bool) $c->is_verified,
                    'url' => route('companies.show', $c->id),
                ];
            });

        // 3. Categorías / Rubros comerciales coincidentes
        $categories = Category::where('is_active', true)
            ->where(function ($query) use ($term, $cleanTerm) {
                $query->where('name', 'like', "%{$term}%")
                      ->orWhere('name', 'like', "%{$cleanTerm}%");
            })
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }])
            ->take(3)
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'icon' => $cat->icon ?: '🏷️',
                    'products_count' => $cat->products_count,
                    'url' => route('companies.index', ['category' => $cat->id]),
                ];
            });

        // 4. Marcas comerciales coincidentes
        $brands = Brand::where('is_active', true)
            ->where(function ($query) use ($term, $cleanTerm) {
                $query->where('name', 'like', "%{$term}%")
                      ->orWhere('name', 'like', "%{$cleanTerm}%");
            })
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }])
            ->take(3)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'name' => $b->name,
                    'logo' => $b->logo ?: null,
                    'products_count' => $b->products_count,
                    'url' => route('companies.index', ['search' => $b->name]),
                ];
            });

        $totalCount = $products->count() + $companies->count() + $categories->count() + $brands->count();

        return response()->json([
            'query' => $term,
            'clean_term' => $cleanTerm,
            'intent_label' => $searchMeta['detected_intent_label'] ?? null,
            'products' => $products,
            'companies' => $companies,
            'categories' => $categories,
            'brands' => $brands,
            'total' => $totalCount,
        ]);
    }
}

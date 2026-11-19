<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Genera el mapa del sitio XML dinámico para Google y otros motores de búsqueda.
     */
    public function index(): Response
    {
        $baseUrl = config('app.url', url('/'));

        // Páginas estáticas / fijas principales
        $staticUrls = [
            ['loc' => $baseUrl, 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/empresas'), 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/productos'), 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/categorias'), 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/ofertas'), 'priority' => '0.8', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/eventos'), 'priority' => '0.7', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
        ];

        // Empresas activas y verificadas
        $companies = Company::where('is_active', true)
            ->where('is_verified', true)
            ->select('id', 'slug', 'updated_at')
            ->latest('updated_at')
            ->get()
            ->map(function ($comp) {
                return [
                    'loc' => route('companies.show', $comp->slug ?: $comp->id),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => $comp->updated_at ? $comp->updated_at->toAtomString() : now()->toAtomString(),
                ];
            });

        // Productos publicados
        $products = Product::where('status', 'published')
            ->select('id', 'slug', 'updated_at')
            ->latest('updated_at')
            ->take(1000)
            ->get()
            ->map(function ($prod) {
                return [
                    'loc' => route('products.show', $prod->slug ?: $prod->id),
                    'priority' => '0.7',
                    'changefreq' => 'weekly',
                    'lastmod' => $prod->updated_at ? $prod->updated_at->toAtomString() : now()->toAtomString(),
                ];
            });

        // Categorías activas
        $categories = Category::where('is_active', true)
            ->select('id', 'slug', 'updated_at')
            ->get()
            ->map(function ($cat) {
                return [
                    'loc' => url('/empresas?category=' . $cat->id),
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                    'lastmod' => $cat->updated_at ? $cat->updated_at->toAtomString() : now()->toAtomString(),
                ];
            });

        $urls = collect($staticUrls)
            ->merge($companies)
            ->merge($products)
            ->merge($categories);

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8')
            ->header('X-Robots-Tag', 'noindex'); // Evita que el sitemap en sí sea indexado como página html
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryApiController extends BaseApiController
{
    /**
     * Listado de todas las categorías disponibles.
     */
    public function index(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->withCount([
                'products' => function ($q) {
                    $q->where('status', 'published');
                },
                'companies' => function ($q) {
                    $q->where('is_active', true)->where('is_verified', true);
                }
            ])
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

        return $this->successResponse($categories, 'Categorías obtenidas');
    }
}

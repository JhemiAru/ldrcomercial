<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\ImageOptimizer;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return Inertia::render('Products/Index', [
                'hasCompany' => false,
                'products' => [],
            ]);
        }

        $query = $company->products()->with('category')->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(10)->withQueryString();

        return Inertia::render('Products/Index', [
            'hasCompany' => true,
            'company' => $company,
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Request $request)
    {
        $company = $request->user()->company;
        
        if (!$company) {
            return redirect()->route('company.edit')->with('warning', 'Primero debes registrar los datos de tu empresa.');
        }

        return Inertia::render('Products/Create', [
            'categories' => Category::all(),
            'company' => $company,
        ]);
    }

    public function store(Request $request)
    {
        $company = $request->user()->company;

        if (!$company) {
            return redirect()->route('company.edit')->with('warning', 'Primero debes registrar los datos de tu empresa.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'nullable|string|max:100',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'wholesale_price' => 'nullable|numeric|min:0',
            'min_wholesale_qty' => 'nullable|integer|min:1',
            'currency' => 'nullable|string|max:10',
            'price_type' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'in_stock' => 'boolean',
            'status' => 'nullable|in:published,draft,archived',
            'is_featured' => 'boolean',
            'main_image' => 'nullable',
        ], [
            'name.required' => 'El nombre del producto es obligatorio.',
            'category_id.required' => 'Debes seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'price.required' => 'El precio del producto es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
        ]);

        $validated['status'] = $validated['status'] ?? 'published';
        $validated['currency'] = $validated['currency'] ?? 'BOB';
        $validated['unit'] = $validated['unit'] ?? 'unidad';
        $validated['price_type'] = $validated['price_type'] ?? 'fixed';
        $validated['min_wholesale_qty'] = $validated['min_wholesale_qty'] ?? 1;

        if ($request->hasFile('main_image')) {
            $request->validate([
                'main_image' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:8192'],
            ], [
                'main_image.image' => 'La imagen del producto debe ser un archivo válido (JPG, PNG, WEBP).',
                'main_image.max' => 'La imagen del producto no debe superar los 8MB.',
            ]);

            $validated['main_image'] = ImageOptimizer::storeAsWebp($request->file('main_image'), 'products', 1000, 1000, 82);
        } elseif ($request->filled('main_image') && is_string($request->main_image)) {
            $validated['main_image'] = $request->main_image;
        } else {
            unset($validated['main_image']);
        }

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        
        $company->products()->create($validated);

        return redirect()->route('products.index')->with('success', '¡Producto publicado exitosamente en tu catálogo!');
    }

    public function edit(Request $request, Product $product)
    {
        $company = $request->user()->company;
        
        if (!$company || $product->company_id !== $company->id) {
            abort(403);
        }

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $company = $request->user()->company;

        if (!$company || $product->company_id !== $company->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'nullable|string|max:100',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'wholesale_price' => 'nullable|numeric|min:0',
            'min_wholesale_qty' => 'nullable|integer|min:1',
            'currency' => 'nullable|string|max:10',
            'price_type' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'in_stock' => 'boolean',
            'status' => 'nullable|in:published,draft,archived',
            'is_featured' => 'boolean',
            'main_image' => 'nullable',
        ], [
            'name.required' => 'El nombre del producto es obligatorio.',
            'category_id.required' => 'Debes seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'price.required' => 'El precio del producto es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
        ]);

        $validated['status'] = $validated['status'] ?? ($product->status ?: 'published');
        $validated['currency'] = $validated['currency'] ?? ($product->currency ?: 'BOB');
        $validated['unit'] = $validated['unit'] ?? ($product->unit ?: 'unidad');
        $validated['price_type'] = $validated['price_type'] ?? ($product->price_type ?: 'fixed');
        $validated['min_wholesale_qty'] = $validated['min_wholesale_qty'] ?? ($product->min_wholesale_qty ?: 1);

        if ($request->hasFile('main_image')) {
            $request->validate([
                'main_image' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:8192'],
            ], [
                'main_image.image' => 'La imagen del producto debe ser un archivo válido (JPG, PNG, WEBP).',
                'main_image.max' => 'La imagen del producto no debe superar los 8MB.',
            ]);

            $validated['main_image'] = ImageOptimizer::storeAsWebp($request->file('main_image'), 'products', 1000, 1000, 82);
        } elseif ($request->filled('main_image') && is_string($request->main_image)) {
            $validated['main_image'] = $request->main_image;
        } elseif ($request->boolean('remove_main_image')) {
            $validated['main_image'] = null;
        } else {
            unset($validated['main_image']);
        }

        if (!$product->slug) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('success', '¡Producto actualizado exitosamente!');
    }

    public function destroy(Request $request, Product $product)
    {
        $company = $request->user()->company;

        if (!$company || $product->company_id !== $company->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }
}


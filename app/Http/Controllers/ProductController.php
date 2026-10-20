<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

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
            return redirect()->route('company.edit')->with('error', 'Debes configurar tu empresa antes de publicar productos.');
        }

        return Inertia::render('Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $company = $request->user()->company;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|max:10',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'in_stock' => 'boolean',
            'status' => 'required|in:published,draft,archived',
            'is_featured' => 'boolean',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('products', 'public');
            $validated['main_image'] = '/storage/' . $path;
        }

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        
        $company->products()->create($validated);

        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente.');
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
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|max:10',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'in_stock' => 'boolean',
            'status' => 'required|in:published,draft,archived',
            'is_featured' => 'boolean',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('products', 'public');
            $validated['main_image'] = '/storage/' . $path;
        }

        if (!$product->slug) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
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


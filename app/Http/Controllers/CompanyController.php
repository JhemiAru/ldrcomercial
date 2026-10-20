<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    public function edit(Request $request)
    {
        $company = $request->user()->company;
        $categories = Category::all();

        return Inertia::render('Company/Edit', [
            'company' => $company,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request)
    {
        $company = $request->user()->company;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:100',
            'short_description' => 'nullable|string|max:250',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('companies', 'public');
            $validated['logo'] = '/storage/' . $path;
        }

        if (!$company) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $request->user()->id;
            $company = $request->user()->company()->create($validated);
        } else {
            // Optional: update the slug if name changes, but usually we don't.
            $company->update($validated);
        }

        return redirect()->back()->with('success', 'Perfil de empresa actualizado exitosamente.');
    }
}


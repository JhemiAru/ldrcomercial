<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Services\ImageOptimizer;

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
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'google_maps_link' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'logo' => 'nullable',
            'banner' => 'nullable',
            'banner_2' => 'nullable',
            'banner_3' => 'nullable',
            'qr_payment' => 'nullable',
            'bank_account_info' => 'nullable|string|max:1000',
        ]);

        // Procesar foto de perfil / logo
        if ($request->hasFile('logo')) {
            $request->validate([
                'logo' => ['image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:8192'],
            ], [
                'logo.image' => 'El logo debe ser un archivo de imagen válido (JPG, PNG, WEBP, SVG).',
                'logo.max' => 'La imagen de perfil no debe superar los 8MB.',
            ]);

            $validated['logo'] = ImageOptimizer::storeAsWebp($request->file('logo'), 'companies', 500, 500, 85);
        } elseif ($request->filled('logo') && is_string($request->logo)) {
            $validated['logo'] = $request->logo;
        } elseif ($request->boolean('remove_logo')) {
            $validated['logo'] = null;
        } else {
            unset($validated['logo']);
        }

        // Procesar imágenes del carrusel publicitario (Banner 1, Banner 2, Banner 3)
        foreach (['banner', 'banner_2', 'banner_3'] as $bannerField) {
            if ($request->hasFile($bannerField)) {
                $request->validate([
                    $bannerField => ['image', 'mimes:jpeg,png,jpg,webp', 'max:8192'],
                ], [
                    "{$bannerField}.image" => 'La imagen del banner debe ser un archivo válido.',
                    "{$bannerField}.max" => 'Cada imagen del carrusel no debe superar los 8MB.',
                ]);

                $validated[$bannerField] = ImageOptimizer::storeAsWebp($request->file($bannerField), 'companies/banners', 1600, 900, 82);
            } elseif ($request->filled($bannerField) && is_string($request->$bannerField)) {
                $validated[$bannerField] = $request->$bannerField;
            } elseif ($request->boolean("remove_{$bannerField}")) {
                $validated[$bannerField] = null;
            } else {
                unset($validated[$bannerField]);
            }
        }

        // Procesar Código QR de Cobro / Pago Simple para Cotizaciones
        if ($request->hasFile('qr_payment')) {
            $request->validate([
                'qr_payment' => ['image', 'mimes:jpeg,png,jpg,webp,svg', 'max:8192'],
            ], [
                'qr_payment.image' => 'El código QR debe ser un archivo de imagen válido (JPG, PNG, WEBP, SVG).',
                'qr_payment.max' => 'La imagen del QR no debe superar los 8MB.',
            ]);

            $validated['qr_payment'] = ImageOptimizer::storeAsWebp($request->file('qr_payment'), 'companies/qr', 800, 800, 90);
        } elseif ($request->filled('qr_payment') && is_string($request->qr_payment)) {
            $validated['qr_payment'] = $request->qr_payment;
        } elseif ($request->boolean('remove_qr_payment')) {
            $validated['qr_payment'] = null;
        } else {
            unset($validated['qr_payment']);
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


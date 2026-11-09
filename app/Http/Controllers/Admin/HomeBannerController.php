<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeBanner;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeBannerController extends Controller
{
    /**
     * Guarda un nuevo banner para el carrusel de la página de inicio.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:8192',
            'image_url' => 'nullable|string|max:1000',
        ]);

        $imagePath = null;

        // 1. Si subió archivo de imagen, optimizar a WebP
        if ($request->hasFile('image_file')) {
            $imagePath = ImageOptimizer::storeAsWebp(
                $request->file('image_file'),
                'banners',
                1920,
                800,
                85
            );
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->input('image_url');
        } else {
            return back()->withErrors(['image_file' => 'Debes subir una imagen o ingresar una URL válida para el banner.']);
        }

        // Determinar orden consecutivo si no se especificó
        $order = $request->filled('order') 
            ? (int) $request->input('order') 
            : (HomeBanner::max('order') + 1);

        HomeBanner::create([
            'title' => $request->input('title'),
            'subtitle' => $request->input('subtitle'),
            'image' => $imagePath,
            'link' => $request->input('link'),
            'order' => $order,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Banner agregado exitosamente al carrusel principal.');
    }

    /**
     * Actualiza un banner existente del carrusel.
     */
    public function update(Request $request, HomeBanner $banner)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:8192',
            'image_url' => 'nullable|string|max:1000',
        ]);

        $data = [
            'title' => $request->input('title'),
            'subtitle' => $request->input('subtitle'),
            'link' => $request->input('link'),
            'order' => $request->has('order') ? (int) $request->input('order') : $banner->order,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $banner->is_active,
        ];

        // Si se subió un nuevo archivo de imagen
        if ($request->hasFile('image_file')) {
            $data['image'] = ImageOptimizer::storeAsWebp(
                $request->file('image_file'),
                'banners',
                1920,
                800,
                85
            );
        } elseif ($request->filled('image_url') && $request->input('image_url') !== $banner->image) {
            $data['image'] = $request->input('image_url');
        }

        $banner->update($data);

        return back()->with('success', 'Banner actualizado correctamente.');
    }

    /**
     * Alterna el estado activo / pausado de un banner.
     */
    public function toggleActive(HomeBanner $banner)
    {
        $banner->update([
            'is_active' => !$banner->is_active,
        ]);

        $estado = $banner->is_active ? 'activado' : 'pausado';
        return back()->with('success', "Banner {$banner->title} {$estado} en el carrusel.");
    }

    /**
     * Elimina un banner del carrusel.
     */
    public function destroy(HomeBanner $banner)
    {
        $title = $banner->title;

        // Si la imagen es un archivo local subido, intentar eliminarlo del disco
        if ($banner->image && str_starts_with($banner->image, '/storage/')) {
            $relativePath = str_replace('/storage/', '', $banner->image);
            Storage::disk('public')->delete($relativePath);
        }

        $banner->delete();

        return back()->with('success', "Banner \"{$title}\" eliminado del carrusel.");
    }
}


<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\CompanyOgCardService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CompanyOgImageController extends Controller
{
    /**
     * Genera o entrega desde caché la imagen de vista previa para WhatsApp y Redes Sociales.
     */
    public function show($id, Request $request, CompanyOgCardService $cardService): BinaryFileResponse
    {
        $company = Company::with(['category'])->findOrFail($id);
        $bannerKey = $request->query('banner', $request->query('flyer'));

        $imagePath = $cardService->getOrGenerateCard($company, $bannerKey);

        return response()->file($imagePath, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=86400', // 24 horas en caché de navegador y bots
        ]);
    }
}


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class BaseApiController extends Controller
{
    /**
     * Respuesta exitosa estandarizada.
     */
    protected function successResponse($data, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Respuesta de error estandarizada.
     */
    protected function errorResponse(string $message, int $status = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Convierte cualquier ruta de imagen a URL pública absoluta
     * compatible con clientes móviles (Glide, Picasso, etc.).
     */
    public static function formatImageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        // Si ya es una URL completa
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            // Asegurar HTTPS para evitar problemas de Cleartext Traffic en Android
            if (str_starts_with($path, 'http://ldrcomercial.com')) {
                return str_replace('http://', 'https://', $path);
            }
            return $path;
        }

        $cleanPath = ltrim($path, '/');
        if (str_starts_with($cleanPath, 'storage/')) {
            $cleanPath = substr($cleanPath, 8);
        }

        // Usar dominio canónico HTTPS de producción
        $baseUrl = rtrim(config('app.url', 'https://ldrcomercial.com'), '/');
        if (str_contains($baseUrl, 'localhost') || empty($baseUrl)) {
            $baseUrl = 'https://ldrcomercial.com';
        }
        if (str_starts_with($baseUrl, 'http://')) {
            $baseUrl = str_replace('http://', 'https://', $baseUrl);
        }

        return $baseUrl . '/storage/' . $cleanPath;
    }
}

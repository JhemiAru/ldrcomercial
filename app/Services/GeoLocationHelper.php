<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoLocationHelper
{
    /**
     * Intenta extraer latitud y longitud a partir de texto, coordenadas directas o URLs de Google Maps.
     *
     * @param string|null $input
     * @return array{latitude: float, longitude: float}|null
     */
    public static function extractCoordinates(?string $input): ?array
    {
        if (empty($input)) {
            return null;
        }

        $input = trim($input);

        // 1. Formato de coordenadas directas: "-16.50025, -68.15082"
        if (preg_match('/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/', $input, $m)) {
            $lat = (float) $m[1];
            $lng = (float) $m[2];
            if ($lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180) {
                return ['latitude' => $lat, 'longitude' => $lng];
            }
        }

        // 2. Patrón estándar de Google Maps con @lat,lng (ej. /@ -16.50025,-68.15082,17z)
        if (preg_match('/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/', $input, $m)) {
            return [
                'latitude' => (float) $m[1],
                'longitude' => (float) $m[2],
            ];
        }

        // 3. Parámetro query de Google Maps (?q=lat,lng o &ll=lat,lng)
        if (preg_match('/[?&](?:q|query|ll|center|sll)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/', $input, $m)) {
            return [
                'latitude' => (float) $m[1],
                'longitude' => (float) $m[2],
            ];
        }

        // 4. Si es un enlace acortado (maps.app.goo.gl o goo.gl), resolver redirección
        if (str_contains($input, 'maps.app.goo.gl') || str_contains($input, 'goo.gl/maps')) {
            try {
                $response = Http::timeout(4)->withoutRedirecting()->head($input);
                $location = $response->header('Location');

                if ($location) {
                    return self::extractCoordinates($location);
                }

                $responseGet = Http::timeout(4)->get($input);
                $effectiveUri = (string) $responseGet->effectiveUri();
                if ($effectiveUri && $effectiveUri !== $input) {
                    return self::extractCoordinates($effectiveUri);
                }

                $body = $responseGet->body();
                if (preg_match('/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/', $body, $m)) {
                    return [
                        'latitude' => (float) $m[1],
                        'longitude' => (float) $m[2],
                    ];
                }
            } catch (\Throwable $e) {
                Log::warning('No se pudo resolver el enlace corto de Google Maps: ' . $e->getMessage());
            }
        }

        return null;
    }
}

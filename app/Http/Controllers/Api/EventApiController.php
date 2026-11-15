<?php

namespace App\Http\Controllers\Api;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventApiController extends BaseApiController
{
    /**
     * Listado de eventos y convenios activos para la app móvil.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::with('company')->where('status', 'active');

        if ($request->filled('company')) {
            $compParam = $request->company;
            $query->whereHas('company', function ($cQ) use ($compParam) {
                if (is_numeric($compParam)) {
                    $cQ->where('id', $compParam);
                } else {
                    $cQ->where('slug', $compParam);
                }
            });
        }

        $events = $query->orderBy('start_date', 'asc')->get()->map(function ($e) {
            $bannerUrl = self::formatImageUrl($e->banner_image);
            return [
                'id' => $e->id,
                'title' => $e->title,
                'slug' => $e->slug,
                'short_description' => $e->short_description,
                'description' => $e->description,
                'event_type' => $e->event_type,
                'banner_image_url' => $bannerUrl,
                'start_date' => $e->start_date ? $e->start_date->toISOString() : null,
                'end_date' => $e->end_date ? $e->end_date->toISOString() : null,
                'modality' => $e->modality,
                'location_name' => $e->location_name,
                'address' => $e->address,
                'city' => $e->city,
                'link' => $e->link,
                'admission_type' => $e->admission_type,
                'admission_price' => $e->admission_price ? (float) $e->admission_price : null,
                'company' => $e->company ? [
                    'id' => $e->company->id,
                    'name' => $e->company->name,
                    'slug' => $e->company->slug,
                    'logo_url' => self::formatImageUrl($e->company->logo),
                ] : null,
                // Compatibilidad directa con el modelo ItemEventos de Android
                'titulo' => $e->title,
                'nombre' => $e->title,
                'descripcion' => $e->short_description ?: $e->description ?: '',
                'fecha' => $e->start_date ? $e->start_date->format('Y-m-d') : '',
                'imagen' => $bannerUrl ?: '',
                'imagenURL' => $bannerUrl ?: '',
                'video' => $e->link ?: '',
                'lugar' => $e->location_name ?: $e->city ?: '',
                'redireccion' => $e->company ? $e->company->slug : '',
            ];
        });

        return $this->successResponse($events, 'Eventos obtenidos');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return Inertia::render('Events/Index', [
                'hasCompany' => false,
                'company' => null,
                'events' => ['data' => [], 'links' => []],
                'stats' => ['total' => 0, 'active' => 0],
            ]);
        }

        $events = $company->events()->latest('start_date')->paginate(10);

        return Inertia::render('Events/Index', [
            'hasCompany' => true,
            'company' => $company,
            'events' => $events,
            'stats' => [
                'total' => $company->events()->count(),
                'active' => $company->events()->where('status', 'active')->count(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $company = $request->user()->company;
        if (!$company) {
            return redirect()->route('company.edit')->with('error', 'Debes configurar tu empresa primero.');
        }

        return Inertia::render('Events/Create', [
            'company' => $company,
        ]);
    }

    public function store(Request $request)
    {
        $company = $request->user()->company;
        if (!$company) {
            return redirect()->route('company.edit')->with('error', 'Debes configurar tu empresa primero.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string', 'max:50'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'is_free' => ['boolean'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:active,draft,cancelled,finished'],
        ]);

        $slug = Str::slug($validated['title']);
        if (Event::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(5);
        }

        $validated['slug'] = $slug;
        $validated['status'] = $validated['status'] ?? 'active';
        $company->events()->create($validated);

        return redirect()->route('events.index')->with('success', 'Evento o alquiler publicado exitosamente.');
    }

    public function edit(Request $request, Event $event)
    {
        $company = $request->user()->company;
        if (!$company || $event->company_id !== $company->id) {
            abort(403, 'No tienes permiso para editar este evento.');
        }

        return Inertia::render('Events/Edit', [
            'company' => $company,
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $company = $request->user()->company;
        if (!$company || $event->company_id !== $company->id) {
            abort(403, 'No tienes permiso para editar este evento.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string', 'max:50'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'is_free' => ['boolean'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:active,draft,cancelled,finished'],
        ]);

        if ($event->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            if (Event::where('slug', $slug)->where('id', '!=', $event->id)->exists()) {
                $slug .= '-' . Str::random(5);
            }
            $validated['slug'] = $slug;
        }

        $event->update($validated);

        return redirect()->route('events.index')->with('success', 'Evento actualizado con éxito.');
    }

    public function destroy(Request $request, Event $event)
    {
        $company = $request->user()->company;
        if (!$company || $event->company_id !== $company->id) {
            abort(403, 'No tienes permiso para eliminar este evento.');
        }

        $event->delete();

        return redirect()->route('events.index')->with('success', 'Evento eliminado.');
    }
}


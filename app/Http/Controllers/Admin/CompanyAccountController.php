<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Services\ImageOptimizer;

class CompanyAccountController extends Controller
{
    /**
     * Muro de control para el administrador: listado de todas las compañías y sus cuentas de acceso.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        // Verificar privilegios de administrador
        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        $query = Company::with(['user', 'category'])->withCount(['products', 'events']);

        // Búsqueda en tiempo real
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('legal_name', 'like', "%{$search}%")
                  ->orWhere('tax_id', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('whatsapp', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('email', 'like', "%{$search}%")
                         ->orWhere('name', 'like', "%{$search}%");
                  });
            });
        }

        $companies = $query->latest()->get();

        // Obtener también usuarios con rol 'company' que aún no hayan terminado de registrar su ficha de empresa
        $usersWithoutCompany = User::whereDoesntHave('company')
            ->where('role', 'company')
            ->get();

        $stats = [
            'totalCompanies' => Company::count(),
            'verifiedCompanies' => Company::where('is_verified', true)->count(),
            'totalUsers' => User::count(),
            'companyUsers' => User::where('role', 'company')->count(),
        ];

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'usersWithoutCompany' => $usersWithoutCompany,
            'categories' => \App\Models\Category::where('is_active', true)->get(),
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Restablece la contraseña de la cuenta de usuario de una compañía.
     */
    public function resetPassword(Request $request, User $user)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $request->validate([
            'password' => ['required', 'string', 'min:6'],
        ], [
            'password.required' => 'Debes ingresar la nueva contraseña.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        $companyName = $user->company ? $user->company->name : $user->name;

        return back()->with('success', "¡Contraseña restablecida exitosamente para {$companyName} ({$user->email})!");
    }

    /**
     * Alterna la insignia de verificación de la empresa.
     */
    public function toggleVerification(Request $request, Company $company)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $company->is_verified = !$company->is_verified;
        $company->save();

        $statusText = $company->is_verified ? 'Verificada con Insignia ✓' : 'No verificada';

        return back()->with('success', "La empresa {$company->name} ahora está como: {$statusText}.");
    }

    /**
     * Registra manualmente una nueva empresa y su usuario de acceso tras
     * la verificación presencial y de documentos realizada por el equipo comercial.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company_name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'tax_id' => ['nullable', 'string', 'max:50'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
        ], [
            'email.unique' => 'Ya existe un usuario con este correo electrónico.',
            'company_name.required' => 'El nombre de la empresa es obligatorio.',
            'category_id.required' => 'Debes seleccionar una categoría.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'company',
            'phone' => $validated['phone'] ?? null,
        ]);

        $company = Company::create([
            'user_id' => $user->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['company_name'],
            'slug' => \Illuminate\Support\Str::slug($validated['company_name']) . '-' . uniqid(),
            'tax_id' => $validated['tax_id'] ?? null,
            'city' => $validated['city'] ?? 'Bolivia',
            'address' => $validated['address'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'whatsapp' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'is_verified' => true,
            'is_active' => true,
        ]);

        return back()->with('success', "¡Empresa '{$company->name}' registrada exitosamente como VERIFICADA con acceso para {$user->email}!");
    }

    /**
     * Actualiza la información de una empresa desde el panel administrativo.
     */
    public function update(Request $request, Company $company)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:50'],
            'category_id' => ['required', 'exists:categories,id'],
            'city' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'tiktok' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'is_verified' => ['boolean'],
            'is_active' => ['boolean'],
            'logo' => ['nullable'],
            'banner' => ['nullable'],
            'banner_2' => ['nullable'],
            'banner_3' => ['nullable'],
        ], [
            'name.required' => 'El nombre comercial de la empresa es obligatorio.',
            'category_id.required' => 'Debes asignar un rubro / categoría.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
        ]);

        // Procesar foto de perfil / logotipo de la empresa
        if ($request->hasFile('logo')) {
            $request->validate([
                'logo' => ['image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:8192'],
            ], [
                'logo.image' => 'El archivo seleccionado debe ser una imagen válida (JPG, PNG, WEBP, SVG).',
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
                    "{$bannerField}.image" => 'Cada imagen del carrusel debe ser un archivo de imagen válido.',
                    "{$bannerField}.max" => 'Las imágenes del carrusel no deben superar los 8MB.',
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

        $company->update($validated);

        return back()->with('success', "¡Empresa '{$company->name}', fotos y carrusel actualizados exitosamente!");
    }

    /**
     * Elimina permanentemente una empresa y sus catálogos asociados.
     */
    public function destroy(Request $request, Company $company)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $companyName = $company->name;
        $company->delete();

        return back()->with('success', "La empresa '{$companyName}' ha sido eliminada exitosamente del sistema.");
    }
}


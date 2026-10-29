<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

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

        $query = Company::with(['user', 'category']);

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
}


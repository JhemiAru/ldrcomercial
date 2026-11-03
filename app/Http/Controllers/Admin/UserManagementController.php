<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Muro de gestión de usuarios exclusivo para Administradores de LDR Comercial.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        // Verificar privilegios de administrador
        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        $query = User::with(['company', 'companies.category']);

        // Filtro de búsqueda en tiempo real
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por Rol
        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->get();

        $stats = [
            'totalUsers' => User::count(),
            'buyerUsers' => User::where('role', 'buyer')->count(),
            'companyUsers' => User::where('role', 'company')->count(),
            'adminUsers' => User::where('role', 'admin')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Registra un nuevo usuario directamente desde el panel administrativo.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'in:admin,company,buyer'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
        ], [
            'name.required' => 'El nombre completo es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado en el sistema.',
            'role.required' => 'Debes seleccionar un rol para el usuario.',
            'role.in' => 'El rol seleccionado no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        $roleLabel = match ($user->role) {
            'admin' => 'Administrador',
            'company' => 'Empresa / Proveedor B2B',
            'buyer' => 'Comprador / Cliente',
            default => $user->role,
        };

        return back()->with('success', "¡Usuario {$user->name} ({$user->email}) creado exitosamente como {$roleLabel}!");
    }

    /**
     * Actualiza los datos de un usuario existente.
     */
    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'in:admin,company,buyer'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', 'min:6'],
        ], [
            'name.required' => 'El nombre completo es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado por otro usuario.',
            'role.required' => 'El rol es obligatorio.',
            'role.in' => 'El rol seleccionado no es válido.',
            'password.min' => 'La nueva contraseña debe tener al menos 6 caracteres.',
        ]);

        // Evitar que el administrador se quite sus propios privilegios
        if ($currentUser->id === $user->id && $validated['role'] !== 'admin') {
            return back()->with('error', 'Por seguridad, no puedes despojarte a ti mismo del rol de Administrador.');
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->phone = $validated['phone'] ?? null;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', "¡Datos del usuario {$user->name} actualizados correctamente!");
    }

    /**
     * Elimina permanentemente a un usuario del sistema previa verificación de seguridad.
     */
    public function destroy(Request $request, User $user)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        // Impedir que un administrador se elimine a sí mismo
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'Operación denegada: No puedes eliminar tu propia cuenta de Administrador con la sesión activa.');
        }

        $userName = $user->name;
        $userEmail = $user->email;
        $role = $user->role;

        $user->delete();

        return back()->with('success', "El usuario {$userName} ({$userEmail}) con rol " . strtoupper($role) . " ha sido eliminado exitosamente del sistema.");
    }
}


<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthApiController extends BaseApiController
{
    /**
     * Inicio de sesión desde la aplicación móvil.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Las credenciales proporcionadas son incorrectas.', 401);
        }

        $deviceName = $request->input('device_name', 'Android App');
        $token = $user->createToken($deviceName)->plainTextToken;

        $user->load('company.category');

        return $this->successResponse([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'company' => $user->company ? [
                    'id' => $user->company->id,
                    'name' => $user->company->name,
                    'slug' => $user->company->slug,
                    'logo_url' => self::formatImageUrl($user->company->logo),
                ] : null,
            ],
        ], 'Inicio de sesión exitoso');
    }

    /**
     * Registro de nuevo usuario desde la aplicación móvil.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'device_name' => 'nullable|string',
        ]);

        $name = !empty($validated['name']) ? $validated['name'] : explode('@', $validated['email'])[0];

        $user = User::create([
            'name' => $name,
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'role' => 'buyer',
            'phone' => $validated['phone'] ?? null,
        ]);

        $deviceName = $request->input('device_name', 'Android App');
        $token = $user->createToken($deviceName)->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'company' => null,
            ],
        ], 'Usuario registrado exitosamente', 201);
    }

    /**
     * Obtener el perfil del usuario autenticado.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('company.category');

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'company' => $user->company ? [
                    'id' => $user->company->id,
                    'name' => $user->company->name,
                    'slug' => $user->company->slug,
                    'logo_url' => self::formatImageUrl($user->company->logo),
                ] : null,
            ],
        ], 'Perfil de usuario obtenido');
    }

    /**
     * Cierre de sesión y revocación del token activo.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Sesión cerrada exitosamente');
    }
}

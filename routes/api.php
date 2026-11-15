<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\CompanyApiController;
use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\HomeApiController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\SearchSuggestionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| LDR Comercial - Mobile & Public REST API (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // 1. Pantalla de Inicio (Banners, ofertas, destacados, secciones)
    Route::get('/home', [HomeApiController::class, 'index'])->name('api.v1.home');

    // 2. Directorio de Empresas y Negocios (Mapa y perfiles)
    Route::get('/companies', [CompanyApiController::class, 'index'])->name('api.v1.companies.index');
    Route::get('/companies/{idOrSlug}', [CompanyApiController::class, 'show'])->name('api.v1.companies.show');

    // 3. Catálogo de Productos y Búsqueda Inteligente
    Route::get('/products', [ProductApiController::class, 'index'])->name('api.v1.products.index');
    Route::get('/products/{idOrSlug}', [ProductApiController::class, 'show'])->name('api.v1.products.show');
    Route::get('/search/suggestions', [SearchSuggestionController::class, 'suggestions'])->name('api.v1.search.suggestions');

    // 4. Categorías
    Route::get('/categories', [CategoryApiController::class, 'index'])->name('api.v1.categories.index');

    // 5. Eventos y Convenios
    Route::get('/events', [EventApiController::class, 'index'])->name('api.v1.events.index');

    // 6. Autenticación Móvil
    Route::post('/auth/login', [AuthApiController::class, 'login'])->name('api.v1.auth.login');
    Route::post('/auth/register', [AuthApiController::class, 'register'])->name('api.v1.auth.register');

    // Rutas protegidas por Sanctum Token
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthApiController::class, 'me'])->name('api.v1.auth.me');
        Route::post('/auth/logout', [AuthApiController::class, 'logout'])->name('api.v1.auth.logout');
    });
});

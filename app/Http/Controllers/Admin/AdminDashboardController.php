<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Muestra el panel de control ejecutivo exclusivo para administradores de LDR Comercial.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        // Verificar privilegios de administrador
        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Acceso denegado. Se requieren privilegios de Administrador.');
        }

        // Métricas de Empresas
        $totalCompanies = Company::count();
        $verifiedCompanies = Company::where('is_verified', true)->count();
        $pendingCompanies = Company::where('is_verified', false)->count();

        // Métricas de Productos
        $totalProducts = Product::count();
        $publishedProducts = Product::where('status', 'published')->count();
        $featuredProducts = Product::where('is_featured', true)->count();

        // Métricas de Usuarios
        $totalUsers = User::count();
        $buyerUsers = User::where('role', 'buyer')->count();
        $companyUsers = User::where('role', 'company')->count();
        $adminUsers = User::where('role', 'admin')->count();

        // Métricas de Categorías y Eventos
        $totalCategories = Category::count();
        $activeEvents = Event::where('status', 'active')->count();

        // Empresas pendientes de verificación presencial (Prioridad Alta)
        $pendingVerificationList = Company::with(['user', 'category'])
            ->where('is_verified', false)
            ->latest()
            ->get();

        // Empresas registradas recientes
        $recentCompanies = Company::with(['user', 'category'])
            ->latest()
            ->take(6)
            ->get();

        // Productos recientes
        $recentProducts = Product::with(['company', 'category'])
            ->latest()
            ->take(6)
            ->get();

        // Distribución de empresas por ciudad
        $citiesDistribution = Company::select('city', DB::raw('count(*) as count'))
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        // Categorías con conteo de productos
        $categoriesStats = Category::withCount(['products', 'companies'])
            ->where('is_active', true)
            ->get();

        // Lista completa de usuarios para la vista de gestión
        $users = User::with(['company', 'companies.category'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'totalCompanies' => $totalCompanies,
                'verifiedCompanies' => $verifiedCompanies,
                'pendingCompanies' => $pendingCompanies,
                'totalProducts' => $totalProducts,
                'publishedProducts' => $publishedProducts,
                'featuredProducts' => $featuredProducts,
                'totalUsers' => $totalUsers,
                'buyerUsers' => $buyerUsers,
                'companyUsers' => $companyUsers,
                'adminUsers' => $adminUsers,
                'totalCategories' => $totalCategories,
                'activeEvents' => $activeEvents,
            ],
            'pendingVerificationList' => $pendingVerificationList,
            'recentCompanies' => $recentCompanies,
            'recentProducts' => $recentProducts,
            'citiesDistribution' => $citiesDistribution,
            'categories' => $categoriesStats,
            'users' => $users,
        ]);
    }
}


<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\HomeBanner;
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

        // Banners del carrusel de la página de inicio (con sembrado inicial si está vacío)
        if (HomeBanner::count() === 0) {
            $this->seedInitialBanners();
        }

        $banners = HomeBanner::orderBy('order')->orderBy('id')->get();

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
            'banners' => $banners,
        ]);
    }

    /**
     * Siembra los banners iniciales por defecto en la base de datos si no existen aún.
     */
    private function seedInitialBanners(): void
    {
        $defaults = [
            [
                'title' => 'Ferretería & Herramientas Industriales',
                'subtitle' => 'Equipamiento de alta resistencia y suministro para talleres y fábricas.',
                'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&auto=format&fit=crop&q=85',
                'link' => '/empresas?search=Ferretería',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'TechSolutions Bolivia - Servidores & Redes',
                'subtitle' => 'Infraestructura de datos y conectividad empresarial certificada.',
                'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&auto=format&fit=crop&q=85',
                'link' => '/empresas?search=TechSolutions',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Directorio de Categorías & Soluciones B2B',
                'subtitle' => 'Explora más de 20 líneas de suministros especializados.',
                'image' => 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1920&auto=format&fit=crop&q=85',
                'link' => '/categorias',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'ConstruSur Materiales - Distribución Nacional',
                'subtitle' => 'Acero, áridos y cemento con despacho directo a obra.',
                'image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&fit=crop&q=85',
                'link' => '/empresas?search=ConstruSur',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($defaults as $banner) {
            HomeBanner::create($banner);
        }
    }
}


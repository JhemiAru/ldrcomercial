<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Portal Público
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'categories' => Category::where('is_active', true)->withCount('products')->get(),
        'promotionalProducts' => Product::with(['company', 'category'])->whereNotNull('original_price')->whereColumn('original_price', '>', 'price')->where('status', 'published')->take(6)->get(),
        'featuredProducts' => Product::with(['company', 'category'])->where('is_featured', true)->where('status', 'published')->take(12)->get(),
        'latestEvents' => Event::with('company')->where('status', 'active')->latest()->take(4)->get(),
        'companies' => Company::with('category')->where('is_active', true)->take(8)->get(),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/empresas', function (Request $request) {
    $query = Company::with('category')->where('is_active', true);
    
    if ($request->filled('category')) {
        $query->where('category_id', $request->category);
    }
    
    if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    return Inertia::render('Companies/Index', [
        'companies' => $query->paginate(12)->withQueryString(),
        'categories' => Category::where('is_active', true)->get(),
        'filters' => $request->only(['search', 'category']),
    ]);
})->name('companies.index');
Route::get('/empresas/{id}', function ($id) {
    $company = Company::with(['category', 'products' => function($q) {
        $q->where('status', 'published')->take(6);
    }, 'events' => function($q) {
        $q->where('status', 'active')->take(3);
    }])->findOrFail($id);

    if (!$company->is_active) abort(404);

    return Inertia::render('Companies/Show', [
        'company' => $company,
        'categories' => Category::where('is_active', true)->get(),
    ]);
})->name('companies.show');

Route::get('/categorias', function () {
    return Inertia::render('Categories/Index', [
        'categories' => Category::where('is_active', true)->withCount('products')->get(),
    ]);
})->name('categories.index');

Route::get('/ofertas', function () {
    return Inertia::render('Offers/Index', [
        'offers' => Product::with(['company', 'category'])
            ->whereNotNull('original_price')
            ->whereColumn('original_price', '>', 'price')
            ->where('status', 'published')
            ->paginate(16),
        'categories' => Category::where('is_active', true)->get(),
    ]);
})->name('offers.index');

Route::get('/eventos', function () {
    return Inertia::render('Events/PublicIndex', [
        'events' => Event::with('company')->where('status', 'active')->latest()->paginate(12),
        'categories' => Category::where('is_active', true)->get(),
    ]);
})->name('events.public');

// Panel Administrativo / Comercial
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        $company = $user->company()->with('category')->first();

        $stats = [
            'productsCount' => $company ? $company->products()->count() : 0,
            'promotionsCount' => $company ? $company->products()->whereNotNull('original_price')->whereColumn('original_price', '>', 'price')->count() : 0,
            'eventsCount' => $company ? $company->events()->count() : 0,
            'hasCompany' => (bool)$company,
            'isVerified' => $company ? (bool)$company->is_verified : false,
        ];

        $recentProducts = $company ? $company->products()->with('category')->latest()->take(6)->get() : [];
        $recentEvents = $company ? $company->events()->latest()->take(3)->get() : [];

        return Inertia::render('Dashboard', [
            'company' => $company,
            'stats' => $stats,
            'recentProducts' => $recentProducts,
            'recentEvents' => $recentEvents,
        ]);
    })->name('dashboard');

    // Gestión de Perfil de Empresa
    Route::get('/company/edit', [CompanyController::class, 'edit'])->name('company.edit');
    Route::post('/company', [CompanyController::class, 'update'])->name('company.update');

    // Gestión de Productos y Precios
    Route::resource('products', ProductController::class);

    // Gestión de Eventos y Promociones
    Route::resource('events', EventController::class);

    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

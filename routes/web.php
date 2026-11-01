<?php

use App\Http\Controllers\Admin\CompanyAccountController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesController;
use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Portal Público (Vista nativa de Laravel / Blade)
Route::get('/', function () {
    $categoriesWithProducts = Category::where('is_active', true)
        ->with(['products' => function ($q) {
            $q->where('status', 'published')->with('company')->latest()->take(20);
        }])
        ->withCount(['products' => function ($q) {
            $q->where('status', 'published');
        }])
        ->get()
        ->filter(function ($cat) {
            return $cat->products->count() > 0;
        });

    return view('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'categories' => Category::where('is_active', true)->withCount('products')->get(),
        'categoriesWithProducts' => $categoriesWithProducts,
        'promotionalProducts' => Product::with(['company', 'category'])->whereNotNull('original_price')->whereColumn('original_price', '>', 'price')->where('status', 'published')->take(6)->get(),
        'featuredProducts' => Product::with(['company', 'category'])->where('is_featured', true)->where('status', 'published')->take(12)->get(),
        'latestEvents' => Event::with('company')->where('status', 'active')->latest()->take(4)->get(),
        'companies' => Company::with('category')->where('is_active', true)->where('is_verified', true)->take(8)->get(),
    ]);
})->name('home');

Route::get('/empresas', function (Request $request) {
    $query = Company::with('category')->where('is_active', true)->where('is_verified', true);
    
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

    if (!$company->is_active || !$company->is_verified) abort(404);

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

// Detalle Público de Producto (Laravel / Blade nativo)
Route::get('/productos/{id}', function ($id) {
    $product = Product::with(['company.category', 'category'])
        ->where('status', 'published')
        ->where(function($q) use ($id) {
            $q->where('id', $id)->orWhere('slug', $id);
        })
        ->firstOrFail();

    // Productos relacionados de la misma categoría
    $relatedProducts = Product::with(['company', 'category'])
        ->where('category_id', $product->category_id)
        ->where('id', '!=', $product->id)
        ->where('status', 'published')
        ->latest()
        ->take(4)
        ->get();

    // Más productos del mismo proveedor
    $companyProducts = Product::with(['company', 'category'])
        ->where('company_id', $product->company_id)
        ->where('id', '!=', $product->id)
        ->where('status', 'published')
        ->latest()
        ->take(4)
        ->get();

    return view('products.show', compact('product', 'relatedProducts', 'companyProducts'));
})->name('products.show');

// Redirección amigable si se ingresa por /products/{id}
Route::get('/products/{id}', function ($id) {
    return redirect()->route('products.show', $id);
});

// Proceso de Afiliación y Verificación Presencial de Empresas (Antifraude)
Route::get('/afiliacion', function () {
    return view('auth.afiliacion');
})->name('afiliacion');

// Panel Administrativo / Comercial
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        $company = $user->company()->with('category')->first();
        $companies = $user->companies()->with('category')->get();

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
            'companies' => $companies,
            'stats' => $stats,
            'recentProducts' => $recentProducts,
            'recentEvents' => $recentEvents,
        ]);
    })->name('dashboard');

    // Gestión de Perfil de Empresa
    Route::get('/company/edit', [CompanyController::class, 'edit'])->name('company.edit');
    Route::post('/company', [CompanyController::class, 'update'])->name('company.update');

    // Gestión de Productos y Precios
    Route::resource('products', ProductController::class)->except(['show']);

    // Gestión de Eventos y Promociones
    Route::resource('events', EventController::class);

    // Gestión de Ventas y Cotizaciones
    Route::get('/ventas-cotizaciones', [SalesController::class, 'index'])->name('sales.index');

    // Panel Administrador: Gestión de Cuentas de Compañías & Restablecimiento de Contraseñas
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/companies', [CompanyAccountController::class, 'index'])->name('companies.index');
        Route::post('/companies', [CompanyAccountController::class, 'store'])->name('companies.store');
        Route::post('/users/{user}/reset-password', [CompanyAccountController::class, 'resetPassword'])->name('users.reset-password');
        Route::post('/companies/{company}/toggle-verification', [CompanyAccountController::class, 'toggleVerification'])->name('companies.toggle-verification');
    });

    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

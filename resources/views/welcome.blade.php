<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="LDR Comercial - Tu proveedor técnico y comercial para toda la industria en Bolivia. Ferretería, automatización, partes de precisión y suministros B2B.">

    <title>LDR Comercial - One Technical Supplier for the Whole Line</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Styles -->
    @vite(['resources/css/app.css'])

    <style>
        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        .hero-pattern {
            background-color: #08162b;
            background-image: 
                radial-gradient(circle at 80% 30%, rgba(27, 100, 218, 0.25) 0%, transparent 50%),
                radial-gradient(circle at 20% 70%, rgba(13, 110, 253, 0.15) 0%, transparent 40%),
                linear-gradient(to right, rgba(8, 22, 43, 0.95) 40%, rgba(8, 22, 43, 0.70) 100%),
                url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1800&auto=format&fit=crop&q=85');
            background-size: cover;
            background-position: center;
        }
    </style>
    <!-- Theme Detection (Evita parpadeo de modo oscuro) -->
    <script>
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    </script>
</head>
<body class="bg-slate-50 dark:bg-[#080e1e] text-slate-800 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors">

    <!-- ========================================================================= -->
    <!-- 1. TOP NAVBAR MODULARIZADO (resources/views/partials/navbar.blade.php) -->
    <!-- ========================================================================= -->
    @include('partials.navbar')


    <!-- ========================================================================= -->
    <!-- 2. HERO BANNER CAROUSEL (Solo Banners / Imágenes Clickeables sin Texto) -->
    <!-- ========================================================================= -->
    <section 
        id="hero-carousel-section"
        class="relative w-full overflow-hidden bg-slate-900 select-none group"
        aria-label="Banners Principales"
    >
        <!-- Contenedor con altura proporcional para banners limpios -->
        <div class="relative w-full h-[240px] sm:h-[360px] md:h-[460px] lg:h-[540px] xl:h-[600px] overflow-hidden">
            
            <!-- SLIDE 1 (Banner 1 -> Categoría Ferretería) -->
            <a 
                href="{{ route('companies.index', ['search' => 'Ferretería']) }}"
                class="hero-slide absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out opacity-100 z-10 cursor-pointer"
                data-index="0"
                title="Ver Categoría Ferretería y Herramientas"
            >
                <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&auto=format&fit=crop&q=85" 
                    alt="Banner Ferretería y Herramientas"
                    class="w-full h-full object-cover object-center"
                    loading="eager"
                >
            </a>

            <!-- SLIDE 2 (Banner 2 -> Empresa TechSolutions) -->
            <a 
                href="{{ route('companies.index', ['search' => 'TechSolutions']) }}"
                class="hero-slide absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out opacity-0 z-0 pointer-events-none cursor-pointer"
                data-index="1"
                title="Ver Empresa TechSolutions Bolivia"
            >
                <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&auto=format&fit=crop&q=85" 
                    alt="Banner TechSolutions Bolivia"
                    class="w-full h-full object-cover object-center"
                    loading="lazy"
                >
            </a>

            <!-- SLIDE 3 (Banner 3 -> Directorio de Categorías) -->
            <a 
                href="{{ route('categories.index') }}"
                class="hero-slide absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out opacity-0 z-0 pointer-events-none cursor-pointer"
                data-index="2"
                title="Ver Todas las Categorías"
            >
                <img 
                    src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1920&auto=format&fit=crop&q=85" 
                    alt="Banner Automatización y Robótica"
                    class="w-full h-full object-cover object-center"
                    loading="lazy"
                >
            </a>

            <!-- SLIDE 4 (Banner 4 -> Empresa ConstruSur) -->
            <a 
                href="{{ route('companies.index', ['search' => 'ConstruSur']) }}"
                class="hero-slide absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out opacity-0 z-0 pointer-events-none cursor-pointer"
                data-index="3"
                title="Ver Empresa ConstruSur Materiales"
            >
                <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&fit=crop&q=85" 
                    alt="Banner ConstruSur Materiales"
                    class="w-full h-full object-cover object-center"
                    loading="lazy"
                >
            </a>

        </div>

        <!-- Flechas de Navegación Flotantes (Izquierda y Derecha) -->
        <button
            type="button"
            id="hero-prev-btn"
            class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 opacity-80 group-hover:opacity-100 focus:outline-none"
            aria-label="Banner anterior"
            title="Banner anterior"
        >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <button
            type="button"
            id="hero-next-btn"
            class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 opacity-80 group-hover:opacity-100 focus:outline-none"
            aria-label="Banner siguiente"
            title="Banner siguiente"
        >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <!-- Barra Inferior: Indicadores de Puntos -->
        <div class="absolute bottom-3 sm:bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2" id="hero-dots-container">
            <button type="button" class="hero-dot transition-all duration-300 rounded-full focus:outline-none w-8 sm:w-10 h-2 sm:h-2.5 bg-blue-500 shadow-sm shadow-blue-400" data-index="0" aria-label="Banner 1"></button>
            <button type="button" class="hero-dot transition-all duration-300 rounded-full focus:outline-none w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white shadow-xs" data-index="1" aria-label="Banner 2"></button>
            <button type="button" class="hero-dot transition-all duration-300 rounded-full focus:outline-none w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white shadow-xs" data-index="2" aria-label="Banner 3"></button>
            <button type="button" class="hero-dot transition-all duration-300 rounded-full focus:outline-none w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white shadow-xs" data-index="3" aria-label="Banner 4"></button>
        </div>

        <!-- Barra de Estadísticas y Confianza -->
        <div class="relative z-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-3 sm:py-4">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300 text-center sm:text-left">
                <div class="flex items-center gap-3 justify-center sm:justify-start">
                    <span class="text-xl sm:text-2xl">🏢</span>
                    <div>
                        <div class="text-sm sm:text-base font-black text-white leading-tight">500+</div>
                        <div class="text-[11px] text-slate-400">Empresas Verificadas</div>
                    </div>
                </div>
                <div class="flex items-center gap-3 justify-center sm:justify-start">
                    <span class="text-xl sm:text-2xl">💎</span>
                    <div>
                        <div class="text-sm sm:text-base font-black text-white leading-tight">100%</div>
                        <div class="text-[11px] text-slate-400">Precios Transparentes</div>
                    </div>
                </div>
                <div class="flex items-center gap-3 justify-center sm:justify-start">
                    <span class="text-xl sm:text-2xl">⚡</span>
                    <div>
                        <div class="text-sm sm:text-base font-black text-white leading-tight">24-48h</div>
                        <div class="text-[11px] text-slate-400">Cotizaciones B2B</div>
                    </div>
                </div>
                <div class="flex items-center gap-3 justify-center sm:justify-start">
                    <span class="text-xl sm:text-2xl">🇧🇴</span>
                    <div>
                        <div class="text-sm sm:text-base font-black text-white leading-tight">Nacional</div>
                        <div class="text-[11px] text-slate-400">Envíos a toda Bolivia</div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <!-- ========================================================================= -->
    <!-- 3. CATÁLOGO TÉCNICO B2B: LÍNEAS DE PRODUCTOS POR CATEGORÍAS (Horizontal) -->
    <!-- ========================================================================= -->
    <section id="productos" class="py-12 sm:py-16 bg-slate-50 dark:bg-[#080e1e] border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- ENCABEZADO DE LA SECCIÓN PRINCIPAL -->
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
                <div>
                    <span class="text-xs font-black tracking-widest uppercase text-blue-600 dark:text-blue-400 block mb-1">
                        CATÁLOGO TÉCNICO B2B
                    </span>
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Nuestras Líneas de Productos
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                        Explora suministros industriales, equipos y repuestos organizados por rubros técnicos con precios proforma y stock para entrega en Bolivia.
                    </p>
                </div>
                <a 
                    href="{{ route('categories.index') }}" 
                    class="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition inline-flex items-center gap-1.5 shrink-0 group"
                >
                    <span>Ver Todas las Categorías</span>
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>

            <!-- LISTADO DE CATEGORÍAS CON PRODUCTOS EN CARRUSEL / SCROLL HORIZONTAL -->
            @if(isset($categoriesWithProducts) && count($categoriesWithProducts) > 0)
                <div class="space-y-12 sm:space-y-16">
                    @foreach($categoriesWithProducts as $category)
                        <div class="category-showcase-row" data-category-id="{{ $category->id }}">
                            
                            <!-- BARRA SUPERIOR DE LA CATEGORÍA -->
                            <div class="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-200/90 dark:border-white/10">
                                <div class="flex items-center gap-3">
                                    <span class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0 shadow-xs">
                                        {{ $category->icon ?? '📦' }}
                                    </span>
                                    <div>
                                        <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                            {{ $category->name }}
                                        </h3>
                                        <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            {{ $category->products_count ?? $category->products->count() }} productos disponibles
                                        </span>
                                    </div>
                                </div>

                                <!-- Botones de Desplazamiento Horizontal (Desktop) y Enlace Ver Más -->
                                <div class="flex items-center gap-2">
                                    <a 
                                        href="{{ route('companies.index', ['category' => $category->id]) }}" 
                                        class="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition"
                                    >
                                        <span>Ver más en {{ $category->name }}</span>
                                        <span>→</span>
                                    </a>

                                    <div class="flex items-center gap-1">
                                        <button 
                                            type="button" 
                                            class="cat-scroll-left w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center transition shadow-xs focus:outline-none"
                                            aria-label="Desplazar a la izquierda"
                                            title="Anterior"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button 
                                            type="button" 
                                            class="cat-scroll-right w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center transition shadow-xs focus:outline-none"
                                            aria-label="Desplazar a la derecha"
                                            title="Siguiente"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- CONTENEDOR HORIZONTAL SCROLLABLE DE PRODUCTOS (HASTA 20) -->
                            <div class="cat-products-container flex gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 -mx-1" style="scrollbar-width: thin;">
                                @foreach($category->products->take(20) as $product)
                                    <a 
                                        href="{{ route('products.show', $product->id) }}" 
                                        class="w-60 sm:w-64 shrink-0 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/90 dark:border-white/10 p-3.5 shadow-xs hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                                        title="Ver detalle de {{ $product->name }}"
                                    >
                                        <div>
                                            <!-- Imagen del Producto -->
                                            <div class="w-full h-40 bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 border border-slate-100 dark:border-white/10 group-hover:bg-blue-50/20 dark:group-hover:bg-white/10 transition relative">
                                                @if($product->main_image)
                                                    <img 
                                                        src="{{ $product->main_image }}" 
                                                        alt="{{ $product->name }}" 
                                                        class="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    >
                                                @else
                                                    <span class="text-3xl text-slate-300 dark:text-slate-600">📦</span>
                                                @endif

                                                @if($product->in_stock)
                                                    <span class="absolute top-2 right-2 bg-emerald-500/90 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                                                        Stock
                                                    </span>
                                                @endif
                                            </div>

                                            <!-- Empresa Proveedora -->
                                            @if($product->company)
                                                <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 truncate">
                                                    <span class="text-blue-600 dark:text-blue-400">🏢</span>
                                                    <span class="truncate">{{ $product->company->name }}</span>
                                                </div>
                                            @endif

                                            <!-- Nombre del Producto -->
                                            <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" title="{{ $product->name }}">
                                                {{ $product->name }}
                                            </h4>

                                            <!-- Descripción corta o SKU -->
                                            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                                {{ $product->short_description ?? 'Suministro técnico con disponibilidad para entrega y cotización proforma.' }}
                                            </p>
                                        </div>

                                        <!-- Pie de la Tarjeta con Precio y Enlace a Detalle (Sin Botón Cotizar) -->
                                        <div class="pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                                            <div class="min-w-0">
                                                <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase">
                                                    Precio Ref.
                                                </span>
                                                <span class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                                                    {{ $product->currency ?? 'Bs.' }} {{ number_format($product->price, 2) }}
                                                </span>
                                            </div>

                                            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                <span>Ver detalle</span>
                                                <span>→</span>
                                            </span>
                                        </div>
                                    </a>
                                @endforeach

                                <!-- TARJETA FINAL "VER MÁS PRODUCTOS" DE ESTA CATEGORÍA -->
                                <a 
                                    href="{{ route('companies.index', ['category' => $category->id]) }}" 
                                    class="w-56 sm:w-60 shrink-0 bg-white dark:bg-white/[0.03] rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-500/30 hover:border-blue-500 dark:hover:border-blue-400 p-6 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] shadow-xs group"
                                    title="Ver todos los productos de {{ $category->name }}"
                                >
                                    <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs mb-3">
                                        +
                                    </div>
                                    <span class="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                        Explorar Línea
                                    </span>
                                    <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                                        Ver más productos de {{ $category->name }}
                                    </h4>
                                    <span class="inline-flex items-center gap-1 mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                        <span>Ir al Catálogo</span>
                                        <span>→</span>
                                    </span>
                                </a>
                            </div>

                        </div>
                    @endforeach
                </div>
            @endif

        </div>
    </section>


    <!-- ========================================================================= -->
    <!-- 4. PRODUCTOS DESTACADOS EN TIEMPO REAL (Conexión con Base de Datos) -->
    <!-- ========================================================================= -->
    @if(isset($featuredProducts) && $featuredProducts->count() > 0)
    <section class="py-16 sm:py-20 bg-slate-50 dark:bg-[#080e1e] border-b border-slate-200/70 dark:border-white/10 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <span class="text-xs font-black tracking-widest uppercase text-blue-600 dark:text-blue-400 block mb-1">STOCK DISPONIBLE</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Productos Destacados
                    </h2>
                </div>
                <a href="{{ route('companies.index') }}" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">
                    Ver Catálogo Completo →
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach($featuredProducts->take(8) as $product)
                    <a 
                        href="{{ route('products.show', $product->id) }}" 
                        class="bg-white dark:bg-white/[0.03] rounded-xl border border-slate-200/90 dark:border-white/10 p-4 shadow-xs hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                        title="Ver detalle de {{ $product->name }}"
                    >
                        <div>
                            <div class="w-full h-44 bg-slate-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center mb-3 border border-slate-100 dark:border-white/10 group-hover:bg-blue-50/20 transition">
                                @if($product->main_image)
                                    <img src="{{ $product->main_image }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                @else
                                    <span class="text-3xl text-slate-300 dark:text-slate-600">📦</span>
                                @endif
                            </div>
                            
                            <div class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                {{ $product->category->name ?? 'Industrial' }}
                            </div>

                            <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" title="{{ $product->name }}">
                                {{ $product->name }}
                            </h4>

                            <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                {{ $product->short_description ?? 'Suministro técnico con disponibilidad para entrega inmediata.' }}
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Precio Referencial</span>
                                <span class="text-base font-black text-slate-900 dark:text-white">
                                    Bs. {{ number_format($product->price, 2) }}
                                </span>
                            </div>
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                <span>Ver ficha</span>
                                <span>→</span>
                            </span>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>
    @endif


    <!-- ========================================================================= -->
    <!-- 5. EMPRESAS Y MARCAS VERIFICADAS (Directorio B2B) -->
    <!-- ========================================================================= -->
    @if(isset($companies) && $companies->count() > 0)
    <section class="py-16 sm:py-20 bg-white dark:bg-[#0b1329] border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <span class="text-xs font-black tracking-widest uppercase text-blue-600 dark:text-blue-400 block mb-1">ECOSISTEMA EMPRESARIAL</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Empresas y Proveedores Verificados
                    </h2>
                </div>
                <a href="{{ route('companies.index') }}" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">
                    Ver Directorio B2B →
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach($companies->take(4) as $company)
                    <a 
                        href="{{ route('companies.show', $company->id) }}" 
                        class="p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 hover:border-blue-500/40 bg-white dark:bg-white/[0.03] hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                        <div>
                            <div class="flex items-center gap-3.5 mb-4">
                                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 overflow-hidden shrink-0">
                                    @if($company->logo)
                                        <img src="{{ $company->logo }}" alt="{{ $company->name }}" class="w-full h-full object-cover">
                                    @else
                                        <span>{{ substr($company->name, 0, 1) }}</span>
                                    @endif
                                </div>
                                <div class="min-w-0">
                                    <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                        {{ $company->name }}
                                    </h4>
                                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                        {{ $company->category->name ?? 'Sector Industrial' }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                {{ $company->short_description ?? 'Proveedor especializado en comercio técnico y suministros industriales en Bolivia.' }}
                            </p>
                        </div>

                        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span class="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                                <span>✓</span>
                                <span>Verificada</span>
                            </span>
                            <span>{{ $company->city ?? 'Bolivia' }}</span>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>
    @endif



    <!-- ========================================================================= -->
    <!-- 7. FOOTER CORPORATIVO (Fiel al estilo B2B limpio) -->
    <!-- ========================================================================= -->
    <footer class="bg-white dark:bg-[#060a16] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                
                <!-- Columna 1: Brand Info -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="flex items-baseline tracking-tight">
                        <span class="text-2xl font-black text-[#0f2d59] dark:text-white">LDR</span>
                        <span class="text-2xl font-black text-blue-600">.</span>
                        <span class="ml-1 text-xs font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase">COMERCIAL</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                        Plataforma comercial B2B y B2C líder en Bolivia para suministros industriales, ferretería pesada, automatización y partes técnicas de precisión.
                    </p>
                    <div class="text-xs text-slate-400 dark:text-slate-500">
                        © {{ date('Y') }} LDR Comercial Bolivia. Todos los derechos reservados.
                    </div>
                </div>

                <!-- Columna 2: Productos -->
                <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Líneas Técnicas</h5>
                    <ul class="space-y-2 text-xs">
                        <li><a href="#productos" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Partes de Precisión</a></li>
                        <li><a href="#productos" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Adhesivos Industriales</a></li>
                        <li><a href="#productos" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Sensores & Automatización</a></li>
                        <li><a href="#productos" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Ferretería & Fijaciones</a></li>
                    </ul>
                </div>

                <!-- Columna 3: Servicios & B2B -->
                <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Soluciones B2B</h5>
                    <ul class="space-y-2 text-xs">
                        <li><a href="{{ route('companies.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Directorio Empresarial</a></li>
                        <li><a href="{{ route('sales.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Cotizaciones Proforma</a></li>
                        <li><a href="{{ route('offers.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Ofertas al por Mayor</a></li>
                        <li><a href="{{ route('events.public') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Agenda de Ferias</a></li>
                    </ul>
                </div>

                <!-- Columna 4: Cuenta & Contacto -->
                <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Acceso al Sistema</h5>
                    <ul class="space-y-2 text-xs">
                        <li><a href="{{ route('login') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Iniciar Sesión</a></li>
                        <li><a href="{{ route('register') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Crear Cuenta Gratis</a></li>
                        <li><a href="{{ route('afiliacion') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Afiliación de Empresas</a></li>
                        <li><a href="{{ route('dashboard') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Panel de Control</a></li>
                        <li class="pt-2 text-slate-400 dark:text-slate-500">La Paz · Santa Cruz · Cochabamba</li>
                    </ul>
                </div>

            </div>
        </div>
    </footer>

    <!-- Script interactivo para carruseles, desplazamiento y menú móvil -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // ─── 1. Control del Menú Móvil ───
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            if (btn && menu) {
                btn.addEventListener('click', function () {
                    menu.classList.toggle('hidden');
                });
            }

            // ─── 2. Control del Carrusel del Hero (4 Slides) ───
            const carousel = document.getElementById('hero-carousel-section');
            if (carousel) {
                const slides = carousel.querySelectorAll('.hero-slide');
                const dots = carousel.querySelectorAll('.hero-dot');
                const prevBtn = document.getElementById('hero-prev-btn');
                const nextBtn = document.getElementById('hero-next-btn');
                const currentNum = document.getElementById('hero-current-num');
                const pauseIndicator = document.getElementById('hero-pause-indicator');

                let currentIndex = 0;
                let isPaused = false;
                let timer = null;
                const total = slides.length;

                function showSlide(index) {
                    currentIndex = (index + total) % total;

                    slides.forEach((slide, i) => {
                        if (i === currentIndex) {
                            slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
                            slide.classList.add('opacity-100', 'z-10');
                        } else {
                            slide.classList.remove('opacity-100', 'z-10');
                            slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
                        }
                    });

                    dots.forEach((dot, i) => {
                        if (i === currentIndex) {
                            dot.className = "hero-dot transition-all duration-300 rounded-full focus:outline-none w-8 sm:w-10 h-2 sm:h-2.5 bg-blue-500 shadow-sm shadow-blue-400";
                        } else {
                            dot.className = "hero-dot transition-all duration-300 rounded-full focus:outline-none w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white shadow-xs";
                        }
                    });

                    if (currentNum) {
                        currentNum.textContent = '0' + (currentIndex + 1);
                    }
                }

                function startTimer() {
                    clearInterval(timer);
                    timer = setInterval(() => {
                        if (!isPaused) {
                            showSlide(currentIndex + 1);
                        }
                    }, 5500);
                }

                if (prevBtn) {
                    prevBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        showSlide(currentIndex - 1);
                        startTimer();
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        showSlide(currentIndex + 1);
                        startTimer();
                    });
                }

                dots.forEach((dot) => {
                    dot.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const idx = parseInt(this.getAttribute('data-index'), 10);
                        showSlide(idx);
                        startTimer();
                    });
                });

                carousel.addEventListener('mouseenter', function () {
                    isPaused = true;
                    if (pauseIndicator) pauseIndicator.textContent = '⏸ Pausado';
                });

                carousel.addEventListener('mouseleave', function () {
                    isPaused = false;
                    if (pauseIndicator) pauseIndicator.textContent = '▶ Auto';
                });

                startTimer();
            }

            // ─── 3. Control de Desplazamiento Horizontal por Categoría (Líneas de Productos) ───
            document.querySelectorAll('.category-showcase-row').forEach(function (row) {
                const container = row.querySelector('.cat-products-container');
                const leftBtn = row.querySelector('.cat-scroll-left');
                const rightBtn = row.querySelector('.cat-scroll-right');

                if (container && leftBtn && rightBtn) {
                    leftBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        container.scrollBy({ left: -360, behavior: 'smooth' });
                    });

                    rightBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        container.scrollBy({ left: 360, behavior: 'smooth' });
                    });
                }
            });
        });
    </script>
</body>
</html>


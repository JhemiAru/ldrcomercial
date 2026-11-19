<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="LDR Comercial - Tu proveedor técnico y comercial para toda la industria en Bolivia. Ferretería, automatización, partes de precisión y suministros B2B.">
    <meta name="keywords" content="proveedores industriales bolivia, ferreteria industrial, automatizacion b2b, empresas bolivia, catalogos mayoristas, suministros b2b santa cruz la paz cochabamba">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="{{ url('/') }}">

    <!-- Local SEO (Bolivia) -->
    <meta name="geo.region" content="BO">
    <meta name="geo.placename" content="Bolivia">

    <!-- Open Graph / Redes Sociales -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:site_name" content="LDR Comercial">
    <meta property="og:locale" content="es_BO">
    <meta property="og:title" content="LDR Comercial - Plataforma B2B de Proveedores Industriales y Comerciales en Bolivia">
    <meta property="og:description" content="Encuentra empresas, mayoristas, fabricantes y productos en toda Bolivia con precios y cotizaciones directas.">
    <meta property="og:image" content="{{ asset('favicon.png') }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="LDR Comercial - Plataforma B2B en Bolivia">
    <meta name="twitter:description" content="Encuentra empresas, mayoristas y productos en toda Bolivia con precios y cotizaciones directas.">
    <meta name="twitter:image" content="{{ asset('favicon.png') }}">

    <title>LDR Comercial - One Technical Supplier for the Whole Line | Bolivia</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    @php
        $siteJsonLd = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    '@id' => url('/') . '/#organization',
                    'name' => 'LDR Comercial',
                    'url' => url('/'),
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => asset('favicon.png')
                    ],
                    'description' => 'Tu proveedor técnico y comercial para toda la industria en Bolivia. Ferretería, automatización, partes de precisión y suministros B2B.',
                    'address' => [
                        '@type' => 'PostalAddress',
                        'addressCountry' => 'BO'
                    ]
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => url('/') . '/#website',
                    'url' => url('/'),
                    'name' => 'LDR Comercial Bolivia',
                    'description' => 'Plataforma B2B de Proveedores Industriales y Comerciales en Bolivia',
                    'publisher' => [
                        '@id' => url('/') . '/#organization'
                    ],
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => [
                            '@type' => 'EntryPoint',
                            'urlTemplate' => url('/empresas') . '?search={search_term_string}'
                        ],
                        'query-input' => 'required name=search_term_string'
                    ]
                ]
            ]
        ];
    @endphp
    <!-- Datos Estructurados JSON-LD (Google Rich Snippets) -->
    <script type="application/ld+json">
    {!! json_encode($siteJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
    </script>

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

    <!-- Encabezado Semántico H1 Principal para Google SEO (Accesible para bots y lectores) -->
    <h1 class="sr-only">LDR Comercial - Plataforma B2B de Proveedores Industriales, Ferretería y Comercio en Bolivia</h1>

    <!-- ========================================================================= -->
    <!-- 1. TOP NAVBAR MODULARIZADO (resources/views/partials/navbar.blade.php) -->
    <!-- ========================================================================= -->
    @include('partials.navbar')


    <!-- ========================================================================= -->
    <!-- 2. HERO PRINCIPAL: BANNER INTERACTIVO (IZQ) + 3 PRODUCTOS DESTACADOS (DER) -->
    <!-- ========================================================================= -->
    @php
        $sideProducts = collect();
        if (isset($featuredProducts) && $featuredProducts->count() > 0) {
            $sideProducts = $sideProducts->merge($featuredProducts->take(3));
        }
        if ($sideProducts->count() < 3 && isset($promotionalProducts)) {
            $needed = 3 - $sideProducts->count();
            $sideProducts = $sideProducts->merge($promotionalProducts->take($needed));
        }
        if ($sideProducts->count() < 3 && isset($categoriesWithProducts)) {
            foreach ($categoriesWithProducts as $cat) {
                foreach ($cat->products as $p) {
                    if (!$sideProducts->contains('id', $p->id)) {
                        $sideProducts->push($p);
                        if ($sideProducts->count() >= 3) break 2;
                    }
                }
            }
        }
    @endphp

    <section class="py-4 sm:py-6 bg-slate-100/90 dark:bg-[#070d1a] border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- CONTENEDOR FLEX: BANNER (IZQUIERDA ~74%) + 3 PRODUCTOS (DERECHA ~26%) -->
            <div class="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch">
                
                <!-- COLUMNA IZQUIERDA: BANNER PRINCIPAL (SLIDER) -->
                <div class="w-full lg:w-[73%] xl:w-[75%] flex flex-col">
                    <div 
                        id="hero-carousel-section"
                        class="relative w-full h-[240px] sm:h-[340px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden bg-slate-900 select-none group shadow-md border border-slate-200/80 dark:border-white/10"
                        aria-label="Banners Principales"
                    >
                        <!-- Slides de Banners -->
                        <div class="relative w-full h-full overflow-hidden">
                            @if(isset($banners) && count($banners) > 0)
                                @foreach($banners as $index => $banner)
                                    <a 
                                        href="{{ $banner->link ?: '#' }}"
                                        class="hero-slide absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out {{ $index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none' }} cursor-pointer"
                                        data-index="{{ $index }}"
                                        title="{{ $banner->title }}"
                                    >
                                        <img 
                                            src="{{ str_starts_with($banner->image, 'http') ? $banner->image : asset($banner->image) }}" 
                                            alt="{{ $banner->title }}"
                                            class="w-full h-full object-cover object-center"
                                            loading="{{ $index === 0 ? 'eager' : 'lazy' }}"
                                        >
                                    </a>
                                @endforeach
                            @else
                                <div class="hero-slide absolute inset-0 block w-full h-full bg-slate-900 opacity-100 z-10 flex items-center justify-center text-white">
                                    <p class="text-sm font-bold">LDR Comercial Bolivia - Proveedor Industrial</p>
                                </div>
                            @endif
                        </div>

                        @if(isset($banners) && count($banners) > 1)
                        <!-- Flechas de Navegación Flotantes -->
                        <button
                            type="button"
                            id="hero-prev-btn"
                            class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 opacity-80 group-hover:opacity-100 focus:outline-none cursor-pointer"
                            aria-label="Banner anterior"
                            title="Banner anterior"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            id="hero-next-btn"
                            class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 opacity-80 group-hover:opacity-100 focus:outline-none cursor-pointer"
                            aria-label="Banner siguiente"
                            title="Banner siguiente"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <!-- Puntos de Navegación -->
                        <div class="absolute bottom-3 sm:bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2" id="hero-dots-container">
                            @foreach($banners as $index => $banner)
                                <button type="button" class="hero-dot transition-all duration-300 rounded-full focus:outline-none {{ $index === 0 ? 'w-7 sm:w-9 h-2 bg-blue-500 shadow-sm shadow-blue-400' : 'w-2 h-2 bg-white/60 hover:bg-white shadow-xs' }} cursor-pointer" data-index="{{ $index }}" aria-label="Banner {{ $index + 1 }}"></button>
                            @endforeach
                        </div>
                        @endif
                    </div>
                </div>

                <!-- COLUMNA DERECHA / SECCIÓN MÓVIL: 3 PRODUCTOS DESTACADOS -->
                <div class="w-full lg:w-[27%] xl:w-[25%] flex flex-col justify-between">
                    <!-- Cabecera visible únicamente en móviles para dar contexto e invitar a deslizar -->
                    <div class="flex items-center justify-between sm:hidden mb-2 px-1">
                        <div class="flex items-center gap-2">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                                Productos Destacados
                            </span>
                        </div>
                        <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            Desliza <span>→</span>
                        </span>
                    </div>

                    <!-- Contenedor: En móvil carrusel swipe horizontal fluido; en tablet grid 3 columnas; en desktop columna vertical -->
                    <div class="flex flex-row overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:flex lg:flex-col gap-3 justify-between flex-1 pb-1 sm:pb-0">
                        @forelse($sideProducts as $product)
                            <a 
                                href="{{ route('products.show', $product->id) }}"
                                class="group relative w-[76vw] max-w-[280px] sm:w-auto shrink-0 snap-start flex-1 min-h-[125px] sm:min-h-[135px] lg:min-h-0 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-slate-900 shadow-sm hover:shadow-xl hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-end cursor-pointer"
                                title="Ver {{ $product->name }}"
                            >
                                <!-- Imagen de Fondo del Producto -->
                                <div class="absolute inset-0 bg-slate-950">
                                    @if($product->main_image)
                                        <img 
                                            src="{{ str_starts_with($product->main_image, 'http') ? $product->main_image : asset($product->main_image) }}" 
                                            alt="{{ $product->name }}" 
                                            class="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            loading="lazy"
                                        >
                                    @else
                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-3xl">
                                            📦
                                        </div>
                                    @endif
                                    <!-- Gradiente oscuro para máxima legibilidad -->
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>
                                </div>

                                <!-- Badge Flotante Superior -->
                                <div class="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                                    @if($product->original_price && $product->original_price > $product->price)
                                        @php
                                            $descPct = round((($product->original_price - $product->price) / $product->original_price) * 100);
                                        @endphp
                                        <span class="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
                                            -{{ $descPct }}%
                                        </span>
                                    @else
                                        <span class="px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                                            Destacado
                                        </span>
                                    @endif
                                </div>

                                <!-- Información Inferior del Producto -->
                                <div class="relative z-10 p-3 sm:p-3.5 flex flex-col">
                                    <span class="text-[10px] font-semibold text-blue-300 dark:text-blue-400 uppercase tracking-wider truncate mb-0.5">
                                        {{ $product->company->name ?? 'LDR Comercial' }}
                                    </span>
                                    <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 leading-snug">
                                        {{ $product->name }}
                                    </h3>
                                    <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10">
                                        <div class="flex items-baseline gap-1.5">
                                            <span class="text-xs sm:text-sm font-extrabold text-amber-400">
                                                Bs. {{ number_format($product->price, 2) }}
                                            </span>
                                            @if($product->original_price && $product->original_price > $product->price)
                                                <span class="text-[10px] text-slate-400 line-through">
                                                    Bs. {{ number_format($product->original_price, 2) }}
                                                </span>
                                            @endif
                                        </div>
                                        <span class="text-[11px] font-bold text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all flex items-center gap-0.5">
                                            Ver <span class="text-xs">→</span>
                                        </span>
                                    </div>
                                </div>
                            </a>
                        @empty
                            <!-- Fallback si no hay productos aún -->
                            @for($i = 1; $i <= 3; $i++)
                                <div class="relative w-[76vw] max-w-[280px] sm:w-auto shrink-0 snap-start flex-1 min-h-[120px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 flex flex-col justify-end text-white">
                                    <span class="text-[10px] font-bold uppercase text-blue-400">Catálogo LDR</span>
                                    <p class="text-xs font-bold text-slate-200">Suministros y Productos B2B</p>
                                </div>
                            @endfor
                        @endforelse
                    </div>
                </div>

            </div>

            <!-- Barra de Estadísticas y Confianza -->
            <div class="mt-4 sm:mt-5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md py-3.5 px-4 sm:px-6 shadow-xs">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700 dark:text-slate-300 text-center sm:text-left">
                    <div class="flex items-center gap-3 justify-center sm:justify-start">
                        <span class="text-xl sm:text-2xl">🏢</span>
                        <div>
                            <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">500+</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">Empresas Verificadas</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 justify-center sm:justify-start">
                        <span class="text-xl sm:text-2xl">💎</span>
                        <div>
                            <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">100%</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">Precios Transparentes</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 justify-center sm:justify-start">
                        <span class="text-xl sm:text-2xl">⚡</span>
                        <div>
                            <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">24-48h</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">Cotizaciones B2B</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 justify-center sm:justify-start">
                        <span class="text-xl sm:text-2xl">🇧🇴</span>
                        <div>
                            <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">Nacional</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">Envíos a toda Bolivia</div>
                        </div>
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
                        href="{{ route('companies.show', $company->slug ?: $company->id) }}" 
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
    <!-- 6. COMUNIDAD OFICIAL EN WHATSAPP (Catálogos, Promociones y Networking B2B) -->
    <!-- ========================================================================= -->
    <section id="comunidad-whatsapp" class="py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-50 dark:from-[#080e1e] dark:via-[#091b19]/40 dark:to-[#080e1e] border-b border-slate-200/80 dark:border-white/10 transition-colors relative overflow-hidden">
        
        <!-- Elementos decorativos sutiles de fondo -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <!-- ENCABEZADO DE LA SECCIÓN -->
            <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black tracking-wide uppercase mb-3">
                    <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                    <span>Comunidad Oficial WhatsApp · Bolivia</span>
                </div>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Únete a Nuestra Red Comercial en WhatsApp
                </h2>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    Un espacio creado para que los negocios que publican sus catálogos en <strong class="text-slate-900 dark:text-white">LDR Comercial</strong> puedan conectar directamente, difundir sus promociones, ofrecer stock y generar alianzas comerciales con compradores y distribuidores en todo el país.
                </p>
            </div>

            <!-- TARJETAS DE LOS DOS GRUPOS DE WHATSAPP -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                
                <!-- GRUPO 1: CATÁLOGOS, COMERCIOS & PROVEEDORES -->
                <div class="bg-white dark:bg-[#0b132b] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div>
                        <!-- Badge superior -->
                        <div class="flex items-center justify-between mb-5">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-xs">
                                🏬
                            </div>
                            <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10">
                                Grupo de Proveedores
                            </span>
                        </div>

                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Comunidad de Catálogos & Comercios
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Diseñado exclusivamente para dueños de empresas, comerciantes, importadores y negocios registrados en la plataforma.
                        </p>

                        <!-- Puntos clave -->
                        <ul class="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Difunde nuevos catálogos y líneas de productos técnicos.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Alianzas estratégicas B2B y compras al por mayor directo de fábrica.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Soporte e impulso comercial para tu catálogo online.</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Botón de Unión -->
                    <div class="mt-8 pt-5 border-t border-slate-100 dark:border-white/10">
                        <a 
                            href="https://chat.whatsapp.com/IY9ezdhEFt28oNanTUz0dT" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            <span>Unirme al Grupo de Comercios</span>
                        </a>
                    </div>
                </div>

                <!-- GRUPO 2: PROMOCIONES, OFERTAS & OPORTUNIDADES -->
                <div class="bg-white dark:bg-[#0b132b] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div>
                        <!-- Badge superior -->
                        <div class="flex items-center justify-between mb-5">
                            <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-xs">
                                🔥
                            </div>
                            <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10">
                                Ofertas y Liquidaciones
                            </span>
                        </div>

                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Red de Promociones & Oportunidades
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            El canal ideal para enviar y recibir promociones de temporada, ofertas flash y pedidos especiales de clientes.
                        </p>

                        <!-- Puntos clave -->
                        <ul class="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Comparte tus ofertas, promociones con descuento y liquidación de stock.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Clientes y empresas buscando productos con entrega inmediata.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>Trato directo y transparente sin comisiones intermedias.</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Botón de Unión -->
                    <div class="mt-8 pt-5 border-t border-slate-100 dark:border-white/10">
                        <a 
                            href="https://chat.whatsapp.com/DZ9VxMPvhYE5fmbtCL8R4J?s=cl&p=a&mlu=4&ilr=4" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            <span>Unirme al Grupo de Promociones</span>
                        </a>
                    </div>
                </div>

            </div>

            <!-- BANNER DE REGLAS Y BUENA CONVIVENCIA -->
            <div class="mt-8 max-w-5xl mx-auto bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3 text-left">
                    <span class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0">
                        🛡️
                    </span>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        <strong class="text-slate-800 dark:text-slate-200">Comunidad Comercial Regulada:</strong> Espacios destinados a empresas y clientes serios en Bolivia. Moderación activa contra spam para garantizar oportunidades de negocio de valor.
                    </p>
                </div>
                <a 
                    href="{{ route('afiliacion') }}" 
                    class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline shrink-0"
                >
                    Publicar mi catálogo en la web →
                </a>
            </div>

        </div>
    </section>



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
                        <li><a href="#comunidad-whatsapp" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition">💬 Comunidad WhatsApp</a></li>
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


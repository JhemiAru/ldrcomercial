<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ Str::limit(strip_tags($product->short_description ?? $product->description ?? $product->name), 155) }}">

    <title>{{ $product->name }} | {{ $product->company->name ?? 'LDR Comercial' }}</title>
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
    </style>

    <!-- Theme Detection -->
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
    <!-- 1. TOP NAVBAR COMPARTIDO -->
    <!-- ========================================================================= -->
    @include('partials.navbar')

    <!-- ========================================================================= -->
    <!-- 2. BREADCRUMBS -->
    <!-- ========================================================================= -->
    <nav class="border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b132b]/50 backdrop-blur-sm transition-colors" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol class="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li class="flex items-center gap-1.5">
                    <a href="{{ route('home') }}" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition">
                        <span>🏠</span>
                        <span>Inicio</span>
                    </a>
                </li>
                <li><span>/</span></li>
                <li class="flex items-center gap-1.5">
                    <a href="{{ route('categories.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">
                        Categorías
                    </a>
                </li>
                @if($product->category)
                    <li><span>/</span></li>
                    <li>
                        <a href="{{ route('companies.index', ['category' => $product->category->id]) }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">
                            {{ $product->category->name }}
                        </a>
                    </li>
                @endif
                <li><span>/</span></li>
                <li class="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-md" aria-current="page">
                    {{ $product->name }}
                </li>
            </ol>
        </div>
    </nav>

    <!-- ========================================================================= -->
    <!-- 3. DETALLE PRINCIPAL DEL PRODUCTO -->
    <!-- ========================================================================= -->
    <main class="py-8 sm:py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                <!-- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (5 Columnas) -->
                <div class="lg:col-span-5 space-y-4">
                    <div class="relative bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200/90 dark:border-white/10 p-4 sm:p-6 shadow-sm overflow-hidden group">
                        
                        <!-- Badges Superiores -->
                        <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                            
                            @if($product->in_stock)
                                <span class="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    <span>En Stock</span>
                                </span>
                            @else
                                <span class="bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
                                    Bajo Pedido
                                </span>
                            @endif
                        </div>

                        <!-- Badge SKU -->
                        <div class="absolute top-4 right-4 z-10">
                            <span class="bg-slate-900/80 dark:bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg font-mono">
                                SKU: {{ $product->sku ?? ('LDR-' . str_pad($product->id, 4, '0', STR_PAD_LEFT)) }}
                            </span>
                        </div>

                        <!-- Imagen Principal -->
                        <div class="w-full h-80 sm:h-96 md:h-[420px] rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                            @if($product->main_image)
                                <img 
                                    id="main-product-image"
                                    src="{{ $product->main_image }}" 
                                    alt="{{ $product->name }}" 
                                    class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                >
                            @else
                                <span class="text-7xl text-slate-300 dark:text-slate-600">📦</span>
                            @endif
                        </div>
                    </div>

                    <!-- Miniaturas adicionales (si tiene imágenes secundarias) -->
                    @if(is_array($product->images) && count($product->images) > 0)
                        <div class="flex items-center gap-3 overflow-x-auto pb-2">
                            @if($product->main_image)
                                <button 
                                    type="button" 
                                    class="product-thumb-btn w-16 h-16 rounded-xl border-2 border-blue-600 bg-white dark:bg-white/5 p-1 shrink-0 transition shadow-xs overflow-hidden"
                                    data-src="{{ $product->main_image }}"
                                >
                                    <img src="{{ $product->main_image }}" alt="Vista Principal" class="w-full h-full object-contain">
                                </button>
                            @endif

                            @foreach($product->images as $idx => $extraImg)
                                <button 
                                    type="button" 
                                    class="product-thumb-btn w-16 h-16 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 bg-white dark:bg-white/5 p-1 shrink-0 transition shadow-xs overflow-hidden"
                                    data-src="{{ $extraImg }}"
                                >
                                    <img src="{{ $extraImg }}" alt="Vista {{ $idx + 2 }}" class="w-full h-full object-contain">
                                </button>
                            @endforeach
                        </div>
                    @endif

                    <!-- Tarjetas de Garantía / Entrega Técnica -->
                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                            <span class="text-2xl">🚚</span>
                            <div>
                                <h5 class="text-xs font-bold text-slate-900 dark:text-white leading-tight">Envíos a Bolivia</h5>
                                <p class="text-[10px] text-slate-500 dark:text-slate-400">La Paz, SCZ, CBBA y más</p>
                            </div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                            <span class="text-2xl">📄</span>
                            <div>
                                <h5 class="text-xs font-bold text-slate-900 dark:text-white leading-tight">Factura Oficial</h5>
                                <p class="text-[10px] text-slate-500 dark:text-slate-400">Con Crédito Fiscal B2B</p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- COLUMNA DERECHA: INFORMACIÓN, PRECIOS Y CONTACTO PROVEEDOR (7 Columnas) -->
                <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
                    
                    <div class="space-y-5">
                        <!-- Ficha de la Empresa Proveedora -->
                        @if($product->company)
                            <div class="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4 shadow-xs">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 overflow-hidden shrink-0 text-base">
                                        @if($product->company->logo)
                                            <img src="{{ $product->company->logo }}" alt="{{ $product->company->name }}" class="w-full h-full object-cover">
                                        @else
                                            <span>{{ substr($product->company->name, 0, 1) }}</span>
                                        @endif
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                {{ $product->company->name }}
                                            </h4>
                                            @if($product->company->is_verified)
                                                <span class="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                    <span>✓</span>
                                                    <span>Verificada</span>
                                                </span>
                                            @endif
                                        </div>
                                        <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                            <span>📍 {{ $product->company->city ?? 'Bolivia' }}</span>
                                            <span>•</span>
                                            <span>{{ $product->company->category->name ?? 'Sector Industrial' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <a 
                                    href="{{ route('companies.show', $product->company->id) }}" 
                                    class="shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    Ver Perfil →
                                </a>
                            </div>
                        @endif

                        <!-- Título del Producto -->
                        <div>
                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                                {{ $product->name }}
                            </h1>
                            @if($product->short_description)
                                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                    {{ $product->short_description }}
                                </p>
                            @endif
                        </div>

                        <!-- Tarjeta de Precio & Condiciones Comerciales -->
                        <div class="p-5 sm:p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20">
                            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                                <div>
                                    <span class="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1">
                                        Precio Referencial B2B
                                    </span>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {{ $product->currency ?? 'Bs.' }} {{ number_format($product->price, 2) }}
                                        </span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                                            / {{ $product->unit ?? 'Unidad' }}
                                        </span>
                                    </div>

                                    @if($product->original_price && $product->original_price > $product->price)
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="text-xs text-slate-400 line-through">
                                                {{ $product->currency ?? 'Bs.' }} {{ number_format($product->original_price, 2) }}
                                            </span>
                                            <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                                -{{ round((($product->original_price - $product->price) / $product->original_price) * 100) }}% AHORRO
                                            </span>
                                        </div>
                                    @endif
                                </div>

                                @if($product->wholesale_price)
                                    <div class="bg-white dark:bg-white/5 p-3 rounded-2xl border border-blue-200/80 dark:border-white/10 sm:text-right">
                                        <span class="text-[10px] font-bold text-slate-400 uppercase block">Precio por Mayor</span>
                                        <span class="text-lg font-black text-blue-600 dark:text-blue-400">
                                            {{ $product->currency ?? 'Bs.' }} {{ number_format($product->wholesale_price, 2) }}
                                        </span>
                                        <span class="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                                            Desde {{ $product->min_wholesale_qty ?? 10 }} {{ $product->unit ?? 'uds.' }}
                                        </span>
                                    </div>
                                @endif
                            </div>
                        </div>

                        <!-- Botones de Contacto Directo con el Proveedor -->
                        <div class="space-y-3 pt-2">
                            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                                Contactar directamente al proveedor para cotización y despacho:
                            </span>

                            <div class="flex flex-col sm:flex-row items-center gap-3">
                                @php
                                    $rawPhone = $product->company->whatsapp ?? $product->company->phone ?? '59170000000';
                                    $cleanPhone = preg_replace('/[^0-9]/', '', $rawPhone);
                                    if(strlen($cleanPhone) === 8) {
                                        $cleanPhone = '591' . $cleanPhone;
                                    }
                                    $whatsappMsg = "Hola " . ($product->company->name ?? '') . ", requiero cotización y detalles del producto: " . $product->name . " (SKU: " . ($product->sku ?? $product->id) . ") visto en LDR Comercial.";
                                    $whatsappUrl = "https://wa.me/" . $cleanPhone . "?text=" . urlencode($whatsappMsg);
                                @endphp

                                <!-- Botón WhatsApp Principal -->
                                <a 
                                    href="{{ $whatsappUrl }}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                                >
                                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.48 1.332 5.003L2 22l5.161-1.354a9.948 9.948 0 004.87 1.258h.004c5.507 0 9.985-4.478 9.985-9.985 0-2.668-1.04-5.176-2.928-7.064A9.92 9.92 0 0012.031 2zm0 18.23c-1.499 0-2.969-.404-4.254-1.168l-.305-.181-3.16.828.843-3.08-.198-.315a8.21 8.21 0 01-1.258-4.329c0-4.542 3.696-8.238 8.24-8.238 2.2 0 4.269.858 5.824 2.414a8.19 8.19 0 012.41 5.824c0 4.543-3.696 8.243-8.246 8.243zm4.518-6.173c-.248-.124-1.464-.723-1.691-.805-.227-.083-.393-.124-.558.124-.165.248-.641.805-.786.971-.144.165-.289.186-.537.062-.248-.124-1.047-.386-1.995-1.232-.738-.658-1.237-1.472-1.382-1.72-.144-.248-.015-.382.109-.505.111-.111.248-.289.372-.434.124-.144.165-.248.248-.413.083-.165.041-.31-.021-.434-.062-.124-.558-1.344-.765-1.84-.2-.485-.404-.419-.558-.427l-.475-.008c-.165 0-.434.062-.661.31-.227.248-.868.848-.868 2.068 0 1.22.888 2.399 1.012 2.564.124.165 1.748 2.668 4.234 3.743.592.256 1.054.409 1.414.523.594.19 1.135.163 1.562.099.477-.071 1.464-.599 1.671-1.177.207-.579.207-1.075.144-1.177-.062-.103-.227-.165-.475-.289z"/>
                                    </svg>
                                    <span>Consultar por WhatsApp</span>
                                </a>

                                <!-- Botón Teléfono o Cotización en Plataforma -->
                                @if($product->company->phone)
                                    <a 
                                        href="tel:{{ $product->company->phone }}" 
                                        class="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 bg-white dark:bg-white/5 font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition hover:bg-slate-50 dark:hover:bg-white/10"
                                        title="Llamar a {{ $product->company->phone }}"
                                    >
                                        <span>📞</span>
                                        <span>{{ $product->company->phone }}</span>
                                    </a>
                                @endif

                                <a 
                                    href="{{ route('sales.index') }}" 
                                    class="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                                >
                                    <span>📋</span>
                                    <span>Generar Proforma</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    <!-- Ficha Rápida de Atributos -->
                    <div class="pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                            <span class="text-slate-400 block text-[10px] font-bold uppercase">Categoría</span>
                            <span class="font-bold text-slate-900 dark:text-white truncate block">
                                {{ $product->category->name ?? 'General' }}
                            </span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                            <span class="text-slate-400 block text-[10px] font-bold uppercase">Unidad</span>
                            <span class="font-bold text-slate-900 dark:text-white truncate block">
                                {{ ucfirst($product->unit ?? 'Unidad') }}
                            </span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5 col-span-2 sm:col-span-1">
                            <span class="text-slate-400 block text-[10px] font-bold uppercase">Disponibilidad</span>
                            <span class="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                                {{ $product->in_stock ? 'Entrega Inmediata' : 'Bajo Demanda' }}
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            <!-- ========================================================================= -->
            <!-- 4. PESTAÑAS: ESPECIFICACIONES TÉCNICAS Y DESCRIPCIÓN DETALLADA -->
            <!-- ========================================================================= -->
            <div class="mt-12 sm:mt-16 bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-10 shadow-xs">
                
                <div class="max-w-4xl space-y-8">
                    <div>
                        <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>📋</span>
                            <span>Especificaciones y Descripción Técnica</span>
                        </h2>
                        <div class="h-1 w-12 bg-blue-600 rounded-full mt-2"></div>
                    </div>

                    <!-- Descripción Ampliada -->
                    <div class="prose dark:prose-invert max-w-none text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                        @if($product->description)
                            {!! nl2br(e($product->description)) !!}
                        @else
                            <p>
                                Este producto corresponde a la línea técnica y comercial distribuida por 
                                <strong>{{ $product->company->name ?? 'LDR Comercial' }}</strong>. 
                                Diseñado para aplicaciones de alta resistencia, compatibilidad industrial y disponibilidad 
                                de repuestos y servicio en Bolivia.
                            </p>
                            <p>
                                Para solicitar fichas técnicas en formato PDF, certificados de calidad o acuerdos de distribución 
                                al por mayor, utiliza las opciones de contacto directo con el representante asignado.
                            </p>
                        @endif
                    </div>

                    <!-- Tabla de Datos Técnicos B2B -->
                    <div class="pt-6 border-t border-slate-100 dark:border-white/10">
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                            Ficha Resumida de Suministro
                        </h3>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs sm:text-sm">
                                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                                    <tr>
                                        <th class="py-3 pr-4 font-bold text-slate-500 dark:text-slate-400 w-1/3">Código / SKU</th>
                                        <td class="py-3 font-mono font-bold text-slate-900 dark:text-white">
                                            {{ $product->sku ?? ('LDR-' . str_pad($product->id, 5, '0', STR_PAD_LEFT)) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="py-3 pr-4 font-bold text-slate-500 dark:text-slate-400">Rubro / Categoría</th>
                                        <td class="py-3 text-slate-900 dark:text-white">
                                            {{ $product->category->name ?? 'Industrial' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="py-3 pr-4 font-bold text-slate-500 dark:text-slate-400">Proveedor Asignado</th>
                                        <td class="py-3 text-slate-900 dark:text-white font-semibold">
                                            {{ $product->company->name ?? 'LDR Comercial' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="py-3 pr-4 font-bold text-slate-500 dark:text-slate-400">Ciudad de Despacho</th>
                                        <td class="py-3 text-slate-900 dark:text-white">
                                            {{ $product->company->city ?? 'Nacional' }} · Bolivia
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="py-3 pr-4 font-bold text-slate-500 dark:text-slate-400">Unidad de Presentación</th>
                                        <td class="py-3 text-slate-900 dark:text-white">
                                            {{ ucfirst($product->unit ?? 'Unidad') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>


            <!-- ========================================================================= -->
            <!-- 5. PRODUCTOS RELACIONADOS DE LA MISMA CATEGORÍA -->
            <!-- ========================================================================= -->
            @if(isset($relatedProducts) && $relatedProducts->count() > 0)
                <div class="mt-12 sm:mt-16">
                    <div class="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <span class="text-xs font-black tracking-widest uppercase text-blue-600 dark:text-blue-400 block mb-0.5">
                                EXPLORAR MÁS PRODUCTOS
                            </span>
                            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Relacionados en {{ $product->category->name ?? 'esta Categoría' }}
                            </h3>
                        </div>
                        @if($product->category)
                            <a 
                                href="{{ route('companies.index', ['category' => $product->category->id]) }}" 
                                class="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Ver todos →
                            </a>
                        @endif
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        @foreach($relatedProducts as $related)
                            <a 
                                href="{{ route('products.show', $related->id) }}" 
                                class="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200/90 dark:border-white/10 p-4 shadow-xs hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                            >
                                <div>
                                    <div class="w-full h-44 bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden flex items-center justify-center mb-3 border border-slate-100 dark:border-white/5 group-hover:bg-blue-50/20 transition">
                                        @if($related->main_image)
                                            <img src="{{ $related->main_image }}" alt="{{ $related->name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                        @else
                                            <span class="text-3xl text-slate-300 dark:text-slate-600">📦</span>
                                        @endif
                                    </div>

                                    @if($related->company)
                                        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 truncate">
                                            🏢 {{ $related->company->name }}
                                        </div>
                                    @endif

                                    <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" title="{{ $related->name }}">
                                        {{ $related->name }}
                                    </h4>

                                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                        {{ $related->short_description ?? 'Suministro industrial con disponibilidad de cotización inmediata.' }}
                                    </p>
                                </div>

                                <div class="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                                    <div>
                                        <span class="text-[9px] text-slate-400 block uppercase font-semibold">Precio Ref.</span>
                                        <span class="text-sm font-black text-slate-900 dark:text-white">
                                            {{ $related->currency ?? 'Bs.' }} {{ number_format($related->price, 2) }}
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
            @endif

        </div>
    </main>

    <!-- ========================================================================= -->
    <!-- 6. FOOTER -->
    <!-- ========================================================================= -->
    <footer class="bg-white dark:bg-[#060a16] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm transition-colors mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <span class="font-black text-lg text-slate-900 dark:text-white">LDR<span class="text-blue-600">.</span></span>
                <span class="text-xs text-slate-400">© {{ date('Y') }} LDR Comercial Bolivia.</span>
            </div>
            <div class="flex items-center gap-6 text-xs font-semibold">
                <a href="{{ route('home') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Inicio</a>
                <a href="{{ route('companies.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Empresas</a>
                <a href="{{ route('categories.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Categorías</a>
                <a href="{{ route('sales.index') }}" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Cotizaciones</a>
            </div>
        </div>
    </footer>

    <!-- Script para cambiar imágenes secundarias al hacer clic -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const mainImg = document.getElementById('main-product-image');
            const thumbBtns = document.querySelectorAll('.product-thumb-btn');

            if(mainImg && thumbBtns.length > 0) {
                thumbBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const newSrc = this.getAttribute('data-src');
                        if(newSrc) {
                            mainImg.src = newSrc;
                            thumbBtns.forEach(b => {
                                b.classList.remove('border-blue-600', 'border-2');
                                b.classList.add('border-slate-200', 'dark:border-white/10');
                            });
                            this.classList.remove('border-slate-200', 'dark:border-white/10');
                            this.classList.add('border-blue-600', 'border-2');
                        }
                    });
                });
            }
        });
    </script>
</body>
</html>


{{-- 
    NAVBAR MINIMALISTA Y UNIFICADO (Blade Partial)
    Izquierda: Menubar de tres puntitos + Logo
    Centro: Buscador general
    Derecha: Icono de usuario (Login o Dropdown de usuario registrado)
    Drawer Izquierdo: Menú lateral con conmutador de tema Oscuro / Claro
--}}
<header class="bg-white/95 dark:bg-[#0b132b]/95 border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-40 shadow-xs backdrop-blur-md transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        <!-- COSTADO IZQUIERDO: TRES PUNTITOS (MENUBAR) + LOGO -->
        <div class="flex items-center gap-3 shrink-0">
            <!-- Botón de tres puntitos para abrir menú lateral -->
            <button 
                type="button" 
                id="blade-menu-btn" 
                class="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition focus:outline-none flex items-center justify-center"
                title="Opciones del Menú"
                aria-label="Abrir menú de opciones"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </button>

            <!-- Logo Minimalista -->
            <a href="{{ route('home') }}" class="flex items-center gap-1.5 group">
                <span class="font-black text-xl sm:text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center">
                    LDR<span class="text-blue-600">.</span>
                </span>
                <span class="hidden sm:inline-block text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    COMERCIAL
                </span>
            </a>
        </div>

        <!-- PARTE CENTRAL: BUSCADOR GENERAL CON SUGERENCIAS EN VIVO (PREDICTIVE AUTOCOMPLETE) -->
        <div class="flex-1 max-w-xl mx-auto relative" id="blade-search-container">
            <form action="{{ route('companies.index') }}" method="GET" class="relative w-full" id="blade-search-form" autocomplete="off">
                <input 
                    type="text" 
                    id="blade-search-input"
                    name="search" 
                    value="{{ request('search') }}"
                    placeholder="Buscar productos, empresas, marcas..." 
                    autocomplete="off"
                    class="w-full bg-slate-100/90 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition shadow-inner"
                >
                <button type="submit" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition" aria-label="Buscar">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                <!-- Spinner indicador de búsqueda -->
                <div id="blade-search-spinner" class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </form>

            <!-- Menú Flotante de Sugerencias en Vivo -->
            <div 
                id="blade-search-dropdown" 
                class="hidden absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-[#0b132b]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden z-50 transition-all max-h-[75vh] sm:max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5"
            >
                <!-- El contenido se inyecta dinámicamente mediante JavaScript -->
            </div>
        </div>

        <!-- PARTE DERECHA: ICONO DE USUARIO (CON MENÚ O REDIRECCIÓN) -->
        <div class="flex items-center gap-3 shrink-0 relative">
            <a 
                href="{{ route('sales.index') }}" 
                class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
            >
                <span>Cotizar</span>
            </a>

            @auth
                <!-- Usuario Logueado: Toggle de Dropdown -->
                <div class="relative" id="blade-user-dropdown-container">
                    <button 
                        type="button" 
                        id="blade-user-btn" 
                        class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition border shadow-xs {{ Auth::user()->role === 'admin' ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 hover:bg-amber-500/20' : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100' }}"
                        title="Usuario: {{ Auth::user()->name }}"
                    >
                        <span class="font-black text-sm uppercase">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </span>
                    </button>

                    <!-- Menú desplegable para usuario registrado -->
                    <div id="blade-user-menu" class="hidden absolute right-0 top-12 w-64 bg-white dark:bg-[#0b132b] rounded-2xl shadow-xl border border-slate-200/90 dark:border-white/10 py-2 z-50">
                        <div class="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                            <div class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sesión Activa</div>
                            <div class="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">{{ Auth::user()->name }}</div>
                            <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ Auth::user()->email }}</div>
                            <div class="mt-2">
                                <span class="inline-block text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider {{ Auth::user()->role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30' }}">
                                    {{ Auth::user()->role === 'admin' ? '🛡️ Super Administrador' : '🏢 Empresa / Socio B2B' }}
                                </span>
                            </div>
                        </div>

                        <div class="py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                            @if(Auth::user()->role === 'admin')
                                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-black transition">
                                    <span class="text-sm">👑</span>
                                    <span>Panel Maestro (Admin)</span>
                                </a>
                            @else
                                <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition">
                                    <span class="text-sm">📊</span>
                                    <span>Panel de Control</span>
                                </a>
                            @endif
                            <a href="{{ route('profile.edit') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition">
                                <span class="text-sm">👤</span>
                                <span>Mi Perfil de Usuario</span>
                            </a>
                            @if(Auth::user()->company)
                                <a href="{{ route('company.edit') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition">
                                    <span class="text-sm">🏢</span>
                                    <span>Editar Datos de Empresa</span>
                                </a>
                            @endif
                            @if(Auth::user()->role === 'admin')
                                <a href="{{ route('admin.companies.index') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 transition">
                                    <span class="text-sm">🏢</span>
                                    <span>Administrar Empresas</span>
                                </a>
                            @endif
                            <a href="{{ route('sales.index') }}" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition">
                                <span class="text-sm">📋</span>
                                <span>Ventas y Cotizaciones</span>
                            </a>
                        </div>

                        <div class="pt-1 border-t border-slate-100 dark:border-white/5">
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                    <span class="text-sm">🚪</span>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @else
                <!-- Usuario No Logueado: Icono que lleva a Login -->
                <a 
                    href="{{ route('login') }}" 
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-white/10 shadow-xs"
                    title="Iniciar Sesión"
                    aria-label="Iniciar Sesión"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </a>
            @endauth

        </div>

    </div>
</header>

<!-- DRAWER LATERAL IZQUIERDO (Activado con los 3 puntitos) -->
<div id="blade-drawer" class="hidden fixed inset-0 z-50 flex">
    <div id="blade-drawer-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>
    
    <div class="relative w-full max-w-xs bg-white dark:bg-[#0b132b] shadow-2xl flex flex-col h-full border-r border-slate-200 dark:border-white/10">
        <!-- Header del Drawer -->
        <div class="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
            <div class="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
                <span>LDR<span className="text-blue-600">.</span></span>
                <span class="text-xs font-bold text-slate-400 dark:text-slate-500 border-l border-slate-300 dark:border-white/20 pl-2 uppercase tracking-wider">
                    Navegación
                </span>
            </div>
            <div class="flex items-center gap-1.5">
                <!-- Botón rápido conmutar tema -->
                <button 
                    type="button" 
                    id="blade-theme-toggle-header"
                    class="p-1.5 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition"
                    title="Cambiar apariencia"
                    aria-label="Cambiar tema visual"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
                <button id="blade-drawer-close" class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition" aria-label="Cerrar menú">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Contenido con scroll -->
        <div class="p-4 overflow-y-auto flex-1 space-y-6">

            <!-- SECCIÓN DE APARIENCIA / MODO OSCURO Y CLARO -->
            <div class="bg-slate-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
                <div class="flex items-center justify-between mb-2 px-1">
                    <div class="flex items-center gap-2">
                        <span id="blade-theme-icon" class="text-sm">☀️</span>
                        <span class="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                            Apariencia
                        </span>
                    </div>
                    <span id="blade-theme-status" class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        Modo Claro
                    </span>
                </div>

                <!-- Control segmentado Claro / Oscuro -->
                <div class="grid grid-cols-2 gap-1.5 bg-slate-200/70 dark:bg-white/10 p-1 rounded-xl">
                    <button
                        type="button"
                        id="blade-theme-light-btn"
                        class="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs"
                    >
                        <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Claro</span>
                    </button>

                    <button
                        type="button"
                        id="blade-theme-dark-btn"
                        class="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <svg class="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Oscuro</span>
                    </button>
                </div>
            </div>

            <!-- Navegación Principal -->
            <div>
                <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                    SECCIONES PRINCIPALES
                </div>
                <ul class="space-y-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <li><a href="{{ route('home') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>🏠</span> Inicio</a></li>
                    <li><a href="{{ route('companies.index') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>🏢</span> Directorio B2B</a></li>
                    <li><a href="{{ route('categories.index') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>🏷️</span> Categorías & Rubros</a></li>
                    <li><a href="{{ route('offers.index') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>🔥</span> Ofertas con Descuento</a></li>
                    <li><a href="{{ route('events.public') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>⚽</span> Eventos & Ferias</a></li>
                    <li><a href="{{ route('sales.index') }}" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"><span>📋</span> Ventas & Cotizaciones</a></li>
                </ul>
            </div>

            @if(isset($categories) && count($categories) > 0)
                <div>
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                        RUBROS DESTACADOS
                    </div>
                    <ul class="space-y-1">
                        @foreach(collect($categories)->take(8) as $cat)
                            <li>
                                <a href="{{ route('companies.index', ['category' => $cat->id]) }}" class="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white rounded-lg transition">
                                    <span class="text-base opacity-75">{{ $cat->icon ?? '📌' }}</span>
                                    <span class="truncate">{{ $cat->name }}</span>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>

        <!-- Footer del Drawer -->
        <div class="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
            @auth
                <a href="{{ route('dashboard') }}" class="block w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm">
                    Ir a mi Panel ({{ Auth::user()->name }})
                </a>
            @else
                <div class="space-y-2">
                    <a href="{{ route('login') }}" class="block w-full py-2 text-center text-xs font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition">
                        Iniciar Sesión
                    </a>
                    <a href="{{ route('register') }}" class="block w-full py-2 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm">
                        Crear Cuenta Gratis
                    </a>
                    <a href="{{ route('afiliacion') }}" class="block w-full py-1.5 text-center text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        🛡️ Afiliar mi Empresa (Verificada)
                    </a>
                </div>
            @endauth
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // ─── 1. Control del Drawer Lateral (3 puntitos) ───
        const menuBtn = document.getElementById('blade-menu-btn');
        const drawer = document.getElementById('blade-drawer');
        const drawerClose = document.getElementById('blade-drawer-close');
        const drawerOverlay = document.getElementById('blade-drawer-overlay');

        function toggleDrawer() {
            if (drawer) drawer.classList.toggle('hidden');
        }

        if (menuBtn) menuBtn.addEventListener('click', toggleDrawer);
        if (drawerClose) drawerClose.addEventListener('click', toggleDrawer);
        if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);

        // ─── 2. Control del Menú Usuario ───
        const userBtn = document.getElementById('blade-user-btn');
        const userMenu = document.getElementById('blade-user-menu');
        const userContainer = document.getElementById('blade-user-dropdown-container');

        if (userBtn && userMenu) {
            userBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                userMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', function (e) {
                if (userContainer && !userContainer.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }

        // ─── 3. Control de Apariencia / Modo Oscuro & Claro ───
        const lightBtn = document.getElementById('blade-theme-light-btn');
        const darkBtn = document.getElementById('blade-theme-dark-btn');
        const headerToggle = document.getElementById('blade-theme-toggle-header');
        const themeStatus = document.getElementById('blade-theme-status');
        const themeIcon = document.getElementById('blade-theme-icon');

        function getCurrentTheme() {
            var saved = localStorage.getItem('theme');
            if (saved) return saved;
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }

        function applyTheme(theme) {
            var isDark = theme === 'dark';
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            try {
                localStorage.setItem('theme', theme);
            } catch(e) {}
            updateUI(isDark);
        }

        function updateUI(isDark) {
            if (themeStatus) themeStatus.textContent = isDark ? 'Modo Oscuro' : 'Modo Claro';
            if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '☀️';

            if (lightBtn && darkBtn) {
                if (isDark) {
                    darkBtn.className = "flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all bg-blue-600 text-white shadow-xs shadow-blue-500/30";
                    lightBtn.className = "flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
                } else {
                    lightBtn.className = "flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs";
                    darkBtn.className = "flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
                }
            }

            if (headerToggle) {
                headerToggle.title = isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro';
                headerToggle.innerHTML = isDark
                    ? '<svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
                    : '<svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
            }
        }

        if (lightBtn) lightBtn.addEventListener('click', function() { applyTheme('light'); });
        if (darkBtn) darkBtn.addEventListener('click', function() { applyTheme('dark'); });
        if (headerToggle) {
            headerToggle.addEventListener('click', function() {
                var current = getCurrentTheme();
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }

        // Sincronizar estado visual inicial
        updateUI(getCurrentTheme() === 'dark');

        // ─── 4. Buscador con Sugerencias en Vivo (Predictive Autocomplete) ───
        const searchInput = document.getElementById('blade-search-input');
        const searchDropdown = document.getElementById('blade-search-dropdown');
        const searchContainer = document.getElementById('blade-search-container');
        const searchSpinner = document.getElementById('blade-search-spinner');
        let searchDebounceTimer = null;
        let selectedIndex = -1;

        if (searchInput && searchDropdown) {
            function escapeHtml(text) {
                if (!text) return '';
                const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
                return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
            }

            function closeSuggestions() {
                searchDropdown.classList.add('hidden');
                selectedIndex = -1;
            }

            function renderSuggestions(data, term) {
                const total = (data.products?.length || 0) + (data.companies?.length || 0) + (data.categories?.length || 0);

                if (total === 0) {
                    searchDropdown.innerHTML = `
                        <div class="p-6 text-center text-slate-500 dark:text-slate-400">
                            <div class="text-2xl mb-1">🔍</div>
                            <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Sin sugerencias directas para "${escapeHtml(term)}"</p>
                            <p class="text-[11px] mt-0.5">Prueba con otra palabra clave o busca en todo el catálogo comercial.</p>
                            <a href="/empresas?search=${encodeURIComponent(term)}" class="mt-3 inline-flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline">
                                Buscar en todo el directorio &rarr;
                            </a>
                        </div>
                    `;
                    searchDropdown.classList.remove('hidden');
                    return;
                }

                let html = '';

                // Banner de intención inteligente detectada
                if (data.intent_label) {
                    html += `
                        <div class="px-3.5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                            <span>✨</span>
                            <span>${escapeHtml(data.intent_label)}</span>
                        </div>
                    `;
                }

                // Rubros / Categorías coincidentes
                if (data.categories && data.categories.length > 0) {
                    html += `
                        <div class="p-2 bg-slate-50/50 dark:bg-white/[0.02]">
                            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                                Categorías & Rubros
                            </span>
                            <div class="space-y-0.5">
                    `;
                    data.categories.forEach(cat => {
                        html += `
                            <a href="${cat.url}" class="suggestion-item flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                                <span class="flex items-center gap-2">
                                    <span>${escapeHtml(cat.icon)}</span>
                                    <span>${escapeHtml(cat.name)}</span>
                                </span>
                                <span class="text-[10px] text-slate-400 font-normal">${cat.products_count} productos</span>
                            </a>
                        `;
                    });
                    html += `</div></div>`;
                }

                // Productos coincidentes
                if (data.products && data.products.length > 0) {
                    html += `
                        <div class="p-2">
                            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                                Productos Coincidentes
                            </span>
                            <div class="space-y-1">
                    `;
                    data.products.forEach(p => {
                        const img = p.image || 'https://placehold.co/100x100/f8fafc/94a3b8?text=LDR';
                        html += `
                            <a href="${p.url}" class="suggestion-item flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 dark:hover:bg-white/10 transition group">
                                <img src="${img}" alt="${escapeHtml(p.name)}" class="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/70 dark:border-white/10">
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                                        ${escapeHtml(p.name)}
                                    </h4>
                                    <div class="flex items-center gap-2 text-[10px] text-slate-400">
                                        ${p.company_name ? `<span class="truncate">${escapeHtml(p.company_name)}</span>` : ''}
                                        ${p.category_name ? `<span>• ${escapeHtml(p.category_name)}</span>` : ''}
                                    </div>
                                </div>
                                <div class="text-right shrink-0">
                                    <span class="text-xs font-black text-slate-900 dark:text-white font-mono">
                                        ${escapeHtml(p.currency)} ${escapeHtml(p.price)}
                                    </span>
                                </div>
                            </a>
                        `;
                    });
                    html += `</div></div>`;
                }

                // Empresas verificadas coincidentes
                if (data.companies && data.companies.length > 0) {
                    html += `
                        <div class="p-2">
                            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                                Empresas Verificadas
                            </span>
                            <div class="space-y-1">
                    `;
                    data.companies.forEach(c => {
                        const logo = c.logo || 'https://placehold.co/100x100/0b132b/ffffff?text=' + encodeURIComponent(c.name.substring(0, 2).toUpperCase());
                        html += `
                            <a href="${c.url}" class="suggestion-item flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 dark:hover:bg-white/10 transition group">
                                <img src="${logo}" alt="${escapeHtml(c.name)}" class="w-9 h-9 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/70 dark:border-white/10">
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-1.5">
                                        <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                                            ${escapeHtml(c.name)}
                                        </h4>
                                        <span class="text-blue-500 text-xs shrink-0" title="Empresa Verificada">✓</span>
                                    </div>
                                    <div class="text-[10px] text-slate-400 truncate">
                                        ${c.city ? `<span>📍 ${escapeHtml(c.city)}</span>` : ''}
                                        ${c.category_name ? `<span> • ${escapeHtml(c.category_name)}</span>` : ''}
                                    </div>
                                </div>
                                <span class="text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                            </a>
                        `;
                    });
                    html += `</div></div>`;
                }

                // Enlace inferior para ver todos los resultados
                html += `
                    <a href="/empresas?search=${encodeURIComponent(term)}" class="block p-2.5 text-center bg-slate-50 dark:bg-white/[0.03] hover:bg-blue-50 dark:hover:bg-white/10 text-xs font-black text-blue-600 dark:text-blue-400 transition">
                        Ver todos los resultados para "${escapeHtml(term)}" &rarr;
                    </a>
                `;

                searchDropdown.innerHTML = html;
                searchDropdown.classList.remove('hidden');
                selectedIndex = -1;
            }

            searchInput.addEventListener('input', function () {
                const query = searchInput.value.trim();

                clearTimeout(searchDebounceTimer);

                if (query.length < 2) {
                    closeSuggestions();
                    if (searchSpinner) searchSpinner.classList.add('hidden');
                    return;
                }

                if (searchSpinner) searchSpinner.classList.remove('hidden');

                searchDebounceTimer = setTimeout(function () {
                    fetch('/api/search/suggestions?q=' + encodeURIComponent(query))
                        .then(function (res) { return res.json(); })
                        .then(function (data) {
                            if (searchSpinner) searchSpinner.classList.add('hidden');
                            if (searchInput.value.trim() === query) {
                                renderSuggestions(data, query);
                            }
                        })
                        .catch(function () {
                            if (searchSpinner) searchSpinner.classList.add('hidden');
                        });
                }, 250);
            });

            // Navegación con teclado (Flechas y Enter)
            searchInput.addEventListener('keydown', function (e) {
                if (searchDropdown.classList.contains('hidden')) return;

                const items = searchDropdown.querySelectorAll('.suggestion-item');
                if (!items.length) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIndex = (selectedIndex + 1) % items.length;
                    highlightItem(items, selectedIndex);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    highlightItem(items, selectedIndex);
                } else if (e.key === 'Enter') {
                    if (selectedIndex >= 0 && items[selectedIndex]) {
                        e.preventDefault();
                        items[selectedIndex].click();
                    }
                } else if (e.key === 'Escape') {
                    closeSuggestions();
                }
            });

            function highlightItem(items, index) {
                items.forEach(function (el, i) {
                    if (i === index) {
                        el.classList.add('bg-blue-100', 'dark:bg-blue-600/30');
                        el.scrollIntoView({ block: 'nearest' });
                    } else {
                        el.classList.remove('bg-blue-100', 'dark:bg-blue-600/30');
                    }
                });
            }

            // Cerrar al hacer clic fuera
            document.addEventListener('click', function (e) {
                if (searchContainer && !searchContainer.contains(e.target)) {
                    closeSuggestions();
                }
            });

            // Reabrir si tiene contenido al hacer focus
            searchInput.addEventListener('focus', function () {
                if (searchInput.value.trim().length >= 2 && searchDropdown.innerHTML.trim() !== '') {
                    searchDropdown.classList.remove('hidden');
                }
            });
        }
    });
</script>

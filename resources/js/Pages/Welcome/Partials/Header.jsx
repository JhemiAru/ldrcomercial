import { Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Header({
    categories = [],
    companyScope = null,
    onCompanySearch = null,
    companySearchTerm = '',
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    // Alcance de búsqueda: Si hay companyScope, inicia en 'company', sino 'global'
    const [searchScope, setSearchScope] = useState(companyScope ? 'company' : 'global');
    const [searchQuery, setSearchQuery] = useState(companySearchTerm || '');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Sincronizar texto cuando cambie desde la vista de la empresa
    useEffect(() => {
        if (companyScope && searchScope === 'company') {
            setSearchQuery(companySearchTerm || '');
        }
    }, [companySearchTerm]);

    // Tema Oscuro / Claro persistente
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const userMenuRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchScope === 'company' && companyScope) {
            // Notificar a la vista de la empresa Show.jsx
            if (onCompanySearch) {
                onCompanySearch(searchQuery);
            }
            // Desplazar suavemente hasta el catálogo de productos
            const catalogo = document.getElementById('catalogo');
            if (catalogo) {
                catalogo.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Búsqueda global en el directorio
            if (searchQuery.trim()) {
                router.get(route('companies.index'), { search: searchQuery });
            }
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (searchScope === 'company' && onCompanySearch) {
            onCompanySearch(val);
        }
    };

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════════
                NAVBAR PRINCIPAL MINIMALISTA Y UNIFICADO
            ═══════════════════════════════════════════════════════════════════ */}
            <header className="bg-white/95 dark:bg-[#0b132b]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-40 shadow-xs transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
                    
                    {/* COSTADO IZQUIERDO: TRES PUNTITOS (MENUBAR) + LOGO */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Botón de tres puntitos para abrir el menú lateral */}
                        <button 
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition focus:outline-none flex items-center justify-center"
                            title="Opciones del Menú"
                            aria-label="Abrir menú de opciones"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </button>

                        {/* Logo Minimalista */}
                        <Link href={route('home')} className="flex items-center gap-1.5 group">
                            <span className="font-black text-xl sm:text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center">
                                LDR<span className="text-blue-600">.</span>
                            </span>
                            <span className="hidden sm:inline-block text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                COMERCIAL
                            </span>
                        </Link>
                    </div>

                    {/* PARTE CENTRAL: BUSCADOR GENERAL / ADAPTATIVO A LA EMPRESA */}
                    <div className="flex-1 max-w-xl mx-auto">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <div className="relative flex items-center w-full bg-slate-100/90 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 focus-within:bg-white dark:focus-within:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 rounded-full py-1 pl-1.5 pr-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 transition shadow-inner">
                                
                                {/* Si estamos en contexto de empresa, selector de alcance (Scope) */}
                                {companyScope ? (
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setSearchScope(searchScope === 'company' ? 'global' : 'company')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition cursor-pointer ${
                                                searchScope === 'company'
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                                            }`}
                                            title={searchScope === 'company' ? `Buscando en ${companyScope.name}. Clic para buscar en todo el portal.` : `Buscando en todo el portal. Clic para buscar en ${companyScope.name}.`}
                                        >
                                            <span>{searchScope === 'company' ? '🏢' : '🌐'}</span>
                                            <span className="hidden sm:inline truncate max-w-[110px]">
                                                {searchScope === 'company' ? companyScope.name : 'Todo el portal'}
                                            </span>
                                            <span className="text-[9px] opacity-75">⇄</span>
                                        </button>
                                    </div>
                                ) : (
                                    <span className="pl-3 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                )}

                                <input
                                    type="text"
                                    placeholder={
                                        searchScope === 'company' && companyScope
                                            ? `Buscar productos en ${companyScope.name}...`
                                            : "Buscar productos, empresas, marcas en todo Bolivia..."
                                    }
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 py-1.5 px-2.5"
                                />

                                {/* Botón Limpiar */}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            if (searchScope === 'company' && onCompanySearch) {
                                                onCompanySearch('');
                                            }
                                        }}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-1 shrink-0"
                                        title="Limpiar búsqueda"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Botón Submit / Lupa */}
                                <button
                                    type="submit"
                                    className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/10 transition shrink-0"
                                    aria-label="Buscar"
                                    title={searchScope === 'company' ? `Filtrar catálogo de ${companyScope?.name}` : 'Buscar en todo LDR Comercial'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sugerencia flotante cuando busca dentro de la empresa */}
                            {companyScope && searchScope === 'company' && searchQuery.trim() && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0b132b] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 z-50 flex items-center justify-between text-xs animate-fadeIn">
                                    <span className="text-slate-500 dark:text-slate-400 truncate pl-2">
                                        Filtrando en: <strong className="text-slate-700 dark:text-slate-200">{companyScope.name}</strong>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.get(route('companies.index'), { search: searchQuery });
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-bold px-2 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0 flex items-center gap-1"
                                    >
                                        <span>Buscar en todo el portal →</span>
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* PARTE DERECHA: ICONO DE USUARIO (CON MENÚ O REDIRECCIÓN) */}
                    <div className="flex items-center gap-3 shrink-0 relative" ref={userMenuRef}>
                        
                        {/* Enlace rápido a cotizaciones si no es móvil */}
                        <Link 
                            href={route('sales.index')}
                            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                        >
                            <span>Cotizar</span>
                        </Link>

                        {/* Botón de Icono de Usuario */}
                        <button
                            type="button"
                            onClick={() => {
                                if (!user) {
                                    router.visit(route('login'));
                                } else {
                                    setIsUserMenuOpen(!isUserMenuOpen);
                                }
                            }}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition border shadow-xs ${
                                user
                                    ? isAdmin
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 hover:bg-amber-500/20'
                                        : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
                                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200/80 dark:hover:bg-white/10'
                            }`}
                            title={user ? `Usuario: ${user.name}` : 'Iniciar Sesión'}
                            aria-label="Menú de cuenta de usuario"
                        >
                            {user ? (
                                <span className="font-black text-sm uppercase">
                                    {user.name?.charAt(0) || 'U'}
                                </span>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </button>

                        {/* DROPDOWN DE USUARIO REGISTRADO */}
                        {user && isUserMenuOpen && (
                            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#0b132b] rounded-2xl shadow-xl border border-slate-200/90 dark:border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                
                                {/* Info de Usuario */}
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        Sesión Activa
                                    </div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user.email}
                                    </div>
                                    <div className="mt-2">
                                        <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                            isAdmin
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                                        }`}>
                                            {isAdmin ? '🛡️ Super Administrador' : '🏢 Empresa / Socio B2B'}
                                        </span>
                                    </div>
                                </div>

                                {/* Opciones de Usuario */}
                                <div className="py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                                    <Link
                                        href={route('dashboard')}
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition"
                                    >
                                        <span className="text-sm">📊</span>
                                        <span>Panel de Control</span>
                                    </Link>

                                    <Link
                                        href={route('profile.edit')}
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition"
                                    >
                                        <span className="text-sm">👤</span>
                                        <span>Mi Perfil de Usuario</span>
                                    </Link>

                                    {user.company && (
                                        <Link
                                            href={route('company.edit')}
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition"
                                        >
                                            <span className="text-sm">🏢</span>
                                            <span>Editar Datos de Empresa</span>
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link
                                            href={route('admin.companies.index')}
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 transition"
                                        >
                                            <span className="text-sm">🔑</span>
                                            <span>Gestión de Cuentas B2B</span>
                                        </Link>
                                    )}

                                    <Link
                                        href={route('sales.index')}
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 transition"
                                    >
                                        <span className="text-sm">📋</span>
                                        <span>Ventas y Cotizaciones</span>
                                    </Link>
                                </div>

                                {/* Cerrar Sesión */}
                                <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                    >
                                        <span className="text-sm">🚪</span>
                                        <span>Cerrar Sesión</span>
                                    </Link>
                                </div>

                            </div>
                        )}

                    </div>

                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════════════
                DRAWER LATERAL IZQUIERDO (Activado con los 3 puntitos)
            ═══════════════════════════════════════════════════════════════════ */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    
                    {/* Drawer Panel */}
                    <div className="relative w-full max-w-xs bg-white dark:bg-[#0b132b] shadow-2xl flex flex-col h-full transform transition-transform border-r border-slate-200 dark:border-white/10">
                        
                        {/* Header del Drawer */}
                        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                            <div className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
                                <span>LDR<span className="text-blue-600">.</span></span>
                                <span className="text-xs font-bold text-slate-400 border-l border-slate-300 dark:border-white/20 pl-2 uppercase tracking-wider">
                                    Navegación
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition"
                                    title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                                    aria-label="Cambiar tema visual"
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </button>
                                <button 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                    aria-label="Cerrar menú"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="p-4 overflow-y-auto flex-1 space-y-6">

                            {/* SECCIÓN DE APARIENCIA / MODO OSCURO Y CLARO */}
                            <div className="bg-slate-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Apariencia
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                                        {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                                    </span>
                                </div>

                                {/* Control segmentado Claro / Oscuro */}
                                <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 dark:bg-white/10 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setTheme('light')}
                                        className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                            theme === 'light'
                                                ? 'bg-white text-slate-900 shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span>Claro</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTheme('dark')}
                                        className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                            theme === 'dark'
                                                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                        <span>Oscuro</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Navegación Principal */}
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                                    SECCIONES PRINCIPALES
                                </div>
                                <ul className="space-y-1">
                                    <li>
                                        <Link 
                                            href={route('home')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">🏠</span>
                                            <span>Inicio</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('companies.index')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">🏢</span>
                                            <span>Directorio B2B</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('categories.index')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">🏷️</span>
                                            <span>Categorías & Rubros</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('offers.index')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">🔥</span>
                                            <span>Ofertas con Descuento</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('events.public')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">⚽</span>
                                            <span>Eventos & Ferias</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('sales.index')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-xl transition"
                                        >
                                            <span className="text-base">📋</span>
                                            <span>Ventas & Cotizaciones</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Rubros / Categorías Rápidas */}
                            {categories && categories.length > 0 && (
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                                        RUBROS DESTACADOS
                                    </div>
                                    <ul className="space-y-1">
                                        {categories.slice(0, 8).map(category => (
                                            <li key={category.id}>
                                                <Link 
                                                    href={route('companies.index', { category: category.id })}
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white rounded-lg transition"
                                                    onClick={() => setIsSidebarOpen(false)}
                                                >
                                                    <span className="text-base opacity-75">{category.icon || '📌'}</span>
                                                    <span className="truncate">{category.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        {/* Footer del Drawer */}
                        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="block w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm"
                                >
                                    Ir a mi Panel ({user.name})
                                </Link>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href={route('login')}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="block w-full py-2 text-center text-xs font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('afiliacion')}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="block w-full py-2 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm"
                                    >
                                        Afiliar mi Empresa (Verificación)
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

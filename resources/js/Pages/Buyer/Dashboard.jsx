import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function BuyerDashboard({
    featuredCompanies = [],
    featuredProducts = [],
    discountProducts = [],
    categories = [],
    stats = {},
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Detectar tab desde la URL si viene ?tab=following o ?tab=likes
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam === 'following' || tabParam === 'likes' || tabParam === 'discover') {
                return tabParam;
            }
        }
        return 'discover';
    });

    // Simulación reactiva persistida en localStorage para empresas seguidas y productos con like
    const [followedCompanies, setFollowedCompanies] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(`ldr_followed_companies_${user.id}`);
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [likedProducts, setLikedProducts] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(`ldr_liked_products_${user.id}`);
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem(`ldr_followed_companies_${user.id}`, JSON.stringify(followedCompanies));
        } catch (e) {}
    }, [followedCompanies, user.id]);

    useEffect(() => {
        try {
            localStorage.setItem(`ldr_liked_products_${user.id}`, JSON.stringify(likedProducts));
        } catch (e) {}
    }, [likedProducts, user.id]);

    const handleToggleFollow = (comp) => {
        const isFollowed = followedCompanies.some((c) => c.id === comp.id);
        if (isFollowed) {
            setFollowedCompanies((prev) => prev.filter((c) => c.id !== comp.id));
        } else {
            setFollowedCompanies((prev) => [...prev, comp]);
        }
    };

    const handleToggleLike = (prod) => {
        const isLiked = likedProducts.some((p) => p.id === prod.id);
        if (isLiked) {
            setLikedProducts((prev) => prev.filter((p) => p.id !== prod.id));
        } else {
            setLikedProducts((prev) => [...prev, prod]);
        }
    };

    const fallbackImage = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Sin+Imagen';

    return (
        <AuthenticatedLayout>
            <Head title="Mi Panel de Comprador | LDR Comercial" />

            <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* ═══════════════════════════════════════════════
                    HERO DE BIENVENIDA PARA EL COMPRADOR
                   ═══════════════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0b132b] text-white p-6 sm:p-10 border border-white/10 shadow-2xl">
                    {/* Efectos de Resplandor Decorativos */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-black tracking-wide uppercase">
                                <span>🛍️</span>
                                <span>Panel de Comprador / Cliente</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                                ¡Bienvenido, {user.name}! 👋
                            </h1>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                Este es tu portal personal para explorar fábricas, mayoristas e importadoras en Bolivia. 
                                Guarda tus empresas favoritas, haz seguimiento a productos de tu interés y cotiza de forma directa sin intermediarios.
                            </p>
                        </div>

                        {/* Botones de Exploración Rápida */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
                            <Link
                                href={route('companies.index')}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 text-center"
                            >
                                🏢 Explorar Empresas
                            </Link>
                            <Link
                                href={route('offers.index')}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold transition text-center"
                            >
                                🏷️ Ver Ofertas
                            </Link>
                            <Link
                                href={route('events.public')}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-bold transition text-center"
                            >
                                ⚽ Canchas & Eventos
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    MÉTRICAS / ACCESOS DIRECTOS DEL COMPRADOR
                   ═══════════════════════════════════════════════ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Tarjeta 1: Empresas Seguidas */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('following')}
                        className={`p-4 sm:p-5 rounded-2xl border text-left transition duration-200 group cursor-pointer ${
                            activeTab === 'following'
                                ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                                : 'bg-white dark:bg-[#0b132b] border-slate-200 dark:border-white/10 hover:border-blue-400'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                                🏪
                            </span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                {followedCompanies.length}
                            </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            Empresas que Sigo
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Comercios y marcas guardadas
                        </p>
                    </button>

                    {/* Tarjeta 2: Productos con Like */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('likes')}
                        className={`p-4 sm:p-5 rounded-2xl border text-left transition duration-200 group cursor-pointer ${
                            activeTab === 'likes'
                                ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                                : 'bg-white dark:bg-[#0b132b] border-slate-200 dark:border-white/10 hover:border-rose-400'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
                                ❤️
                            </span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                {likedProducts.length}
                            </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            Productos con Me Gusta
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Tu lista de deseos personal
                        </p>
                    </button>

                    {/* Tarjeta 3: Ofertas del Día */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('discover')}
                        className={`p-4 sm:p-5 rounded-2xl border text-left transition duration-200 group cursor-pointer ${
                            activeTab === 'discover'
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                : 'bg-white dark:bg-[#0b132b] border-slate-200 dark:border-white/10 hover:border-emerald-400'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
                                🔥
                            </span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                {discountProducts.length}+
                            </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            Ofertas Disponibles
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Precios rebajados hoy
                        </p>
                    </button>

                    {/* Tarjeta 4: Rubros Comerciales */}
                    <Link
                        href={route('categories.index')}
                        className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-[#0b132b] border-slate-200 dark:border-white/10 hover:border-purple-400 text-left transition duration-200 group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
                                🗂️
                            </span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                {categories.length}
                            </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            Rubros en Bolivia
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Explorar por categoría &rarr;
                        </p>
                    </Link>
                </div>

                {/* ═══════════════════════════════════════════════
                    BARRA DE PESTAÑAS (TABS)
                   ═══════════════════════════════════════════════ */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('following')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                            activeTab === 'following'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <span>🏪</span>
                        <span>Empresas que Sigo</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            activeTab === 'following' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                        }`}>
                            {followedCompanies.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('likes')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                            activeTab === 'likes'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <span>❤️</span>
                        <span>Productos con Me Gusta</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            activeTab === 'likes' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                        }`}>
                            {likedProducts.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('discover')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                            activeTab === 'discover'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <span>🔥</span>
                        <span>Ofertas & Sugerencias</span>
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════
                    PESTAÑA 1: EMPRESAS QUE SIGO
                   ═══════════════════════════════════════════════ */}
                {activeTab === 'following' && (
                    <div className="space-y-6">
                        {followedCompanies.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {followedCompanies.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 shrink-0 flex items-center justify-center">
                                                    {comp.logo ? (
                                                        <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-xl font-bold">{comp.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                            {comp.name}
                                                        </h4>
                                                        {comp.is_verified && (
                                                            <span className="text-blue-500 text-xs shrink-0" title="Verificada">✓</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {comp.city || 'Bolivia'} {comp.category?.name && `• ${comp.category.name}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {comp.short_description || comp.description || 'Proveedor verificado con catálogo disponible.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-white/10">
                                            <Link
                                                href={route('companies.show', comp.id)}
                                                className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                                            >
                                                Ver Catálogo &rarr;
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleFollow(comp)}
                                                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-600 dark:text-slate-400 hover:text-red-600 text-xs font-bold transition"
                                                title="Dejar de seguir"
                                            >
                                                Dejar de seguir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-8 sm:p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center text-3xl">
                                    🏪
                                </div>
                                <div className="max-w-md mx-auto space-y-1">
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        Aún no sigues a ningún comercio
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Cuando entres al perfil de una empresa, presiona el botón <strong>"Seguir"</strong> para guardarla en esta lista y acceder rápidamente a sus productos y cotizaciones.
                                    </p>
                                </div>
                                <Link
                                    href={route('companies.index')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
                                >
                                    <span>🔍</span>
                                    <span>Explorar Empresas Verificadas</span>
                                </Link>
                            </div>
                        )}

                        {/* Sugerencias de Empresas Destacadas */}
                        {featuredCompanies.length > 0 && (
                            <div className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Empresas Verificadas Recomendadas en Bolivia
                                    </h3>
                                    <Link href={route('companies.index')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver todas &rarr;
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featuredCompanies.slice(0, 3).map((comp) => {
                                        const isFollowed = followedCompanies.some((c) => c.id === comp.id);
                                        return (
                                            <div
                                                key={comp.id}
                                                className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center justify-between gap-3 shadow-xs hover:border-blue-400 transition"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 shrink-0 flex items-center justify-center">
                                                        {comp.logo ? (
                                                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="font-bold text-sm">{comp.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                            {comp.name}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 truncate">
                                                            📍 {comp.city || 'Bolivia'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleFollow(comp)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                                                            isFollowed
                                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                : 'bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {isFollowed ? '✓ Siguiendo' : '+ Seguir'}
                                                    </button>
                                                    <Link
                                                        href={route('companies.show', comp.id)}
                                                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold"
                                                        title="Ver catálogo"
                                                    >
                                                        ↗
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    PESTAÑA 2: PRODUCTOS CON ME GUSTA
                   ═══════════════════════════════════════════════ */}
                {activeTab === 'likes' && (
                    <div className="space-y-6">
                        {likedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {likedProducts.map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                                    >
                                        <div className="relative aspect-square bg-slate-100 dark:bg-white/5 overflow-hidden">
                                            <img
                                                src={prod.main_image || fallbackImage}
                                                alt={prod.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleToggleLike(prod)}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-rose-500 flex items-center justify-center text-sm shadow-md hover:scale-110 transition cursor-pointer"
                                                title="Quitar de favoritos"
                                            >
                                                ❤️
                                            </button>
                                        </div>

                                        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                                                    {prod.company?.name || 'Proveedor'}
                                                </p>
                                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                                    {prod.name}
                                                </h4>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
                                                <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                                                    {prod.currency || 'Bs.'} {Number(prod.price).toFixed(2)}
                                                </span>
                                                <Link
                                                    href={route('products.show', prod.id)}
                                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Ver &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-8 sm:p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center text-3xl">
                                    ❤️
                                </div>
                                <div className="max-w-md mx-auto space-y-1">
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        Tu lista de deseos está vacía
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Cuando navegues por el catálogo de empresas o productos y pulses el botón de <strong>Me Gusta</strong>, se guardarán aquí para que compares precios y los cotices cuando quieras.
                                    </p>
                                </div>
                                <Link
                                    href={route('offers.index')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-500/20"
                                >
                                    <span>🔥</span>
                                    <span>Explorar Catálogo de Ofertas</span>
                                </Link>
                            </div>
                        )}

                        {/* Productos Destacados para Empezar a Guardar */}
                        {featuredProducts.length > 0 && (
                            <div className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Productos Destacados para ti en Bolivia
                                    </h3>
                                    <Link href={route('offers.index')} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline">
                                        Ver catálogo completo &rarr;
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {featuredProducts.slice(0, 4).map((prod) => {
                                        const isLiked = likedProducts.some((p) => p.id === prod.id);
                                        return (
                                            <div
                                                key={prod.id}
                                                className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs hover:border-rose-400 transition flex flex-col justify-between group"
                                            >
                                                <div className="relative aspect-square bg-slate-100 dark:bg-white/5 overflow-hidden">
                                                    <img
                                                        src={prod.main_image || fallbackImage}
                                                        alt={prod.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleLike(prod)}
                                                        className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center text-sm shadow-md transition cursor-pointer ${
                                                            isLiked ? 'bg-rose-600 text-white' : 'bg-black/60 text-white hover:text-rose-400'
                                                        }`}
                                                        title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                                                    >
                                                        {isLiked ? '❤️' : '🤍'}
                                                    </button>
                                                </div>

                                                <div className="p-3 space-y-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                                                        {prod.company?.name || 'Proveedor'}
                                                    </p>
                                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                                        {prod.name}
                                                    </h4>
                                                    <div className="pt-2 flex items-baseline justify-between">
                                                        <span className="font-mono font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                                                            {prod.currency || 'Bs.'} {Number(prod.price).toFixed(2)}
                                                        </span>
                                                        <Link
                                                            href={route('products.show', prod.id)}
                                                            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            Ver &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    PESTAÑA 3: OFERTAS & SUGERENCIAS
                   ═══════════════════════════════════════════════ */}
                {activeTab === 'discover' && (
                    <div className="space-y-8">
                        {/* OFERTAS REBAJADAS */}
                        {discountProducts.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🔥</span>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                            Ofertas y Promociones con Descuento Directo
                                        </h3>
                                    </div>
                                    <Link href={route('offers.index')} className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline">
                                        Ver todas &rarr;
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                                    {discountProducts.map((prod) => (
                                        <Link
                                            key={prod.id}
                                            href={route('products.show', prod.id)}
                                            className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs hover:border-orange-500 hover:shadow-md transition flex flex-col justify-between group"
                                        >
                                            <div className="relative aspect-square bg-slate-100 dark:bg-white/5 overflow-hidden">
                                                <img
                                                    src={prod.main_image || fallbackImage}
                                                    alt={prod.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-black text-[9px]">
                                                    OFERTA
                                                </span>
                                            </div>

                                            <div className="p-2.5 space-y-1">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase truncate">
                                                    {prod.company?.name}
                                                </p>
                                                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {prod.name}
                                                </h4>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                                                        {prod.currency || 'Bs.'} {Number(prod.price).toFixed(2)}
                                                    </span>
                                                    {prod.original_price && (
                                                        <span className="font-mono text-[10px] text-slate-400 line-through">
                                                            {Number(prod.original_price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CATEGORÍAS POPULARES */}
                        {categories.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🗂️</span>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                            Explorar Rubros Populares
                                        </h3>
                                    </div>
                                    <Link href={route('categories.index')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver todas &rarr;
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={route('companies.index', { category: cat.id })}
                                            className="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-white/10 hover:border-blue-500 transition shadow-xs flex items-center justify-between group"
                                        >
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-xs text-slate-800 dark:text-white group-hover:text-blue-600 transition truncate">
                                                    {cat.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400">
                                                    {cat.products_count} productos
                                                </span>
                                            </div>
                                            <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform text-xs">
                                                &rarr;
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    CALL TO ACTION: AFILIACIÓN A PROVEEDOR
                   ═══════════════════════════════════════════════ */}
                <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-500/30">
                    <div className="space-y-2 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
                            <span>🏢</span>
                            <span>¿Tienes una fábrica, importadora o negocio en Bolivia?</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                            Pasa de Comprador a Proveedor Verificado
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                            Publica tu propio catálogo digital, recibe cotizaciones por WhatsApp y conecta con miles de compradores y mayoristas en todo el país.
                        </p>
                    </div>

                    <a
                        href={route('afiliacion')}
                        className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs sm:text-sm font-black transition shadow-lg shadow-orange-500/20 shrink-0 text-center"
                    >
                        Afiliar mi Empresa (Verificación) &rarr;
                    </a>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}


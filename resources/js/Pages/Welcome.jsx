import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Mapas de imágenes por rubro ─── */
const categoryImages = {
    'tecnologia-y-electronica':   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    'construccion-y-ferreteria':  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    'alimentos-y-bebidas':        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    'agroindustria-y-maquinaria': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    'salud-y-equipamiento-medico':'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    'logistica-y-transporte':     'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
};
const fallbackImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

/* ─── Insignia de Empresa Verificada ─── */
function VerifiedBadge({ size = 'sm', showText = false }) {
    const sizeMap = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };
    return (
        <span className="inline-flex items-center gap-1 shrink-0" title="Empresa Verificada por LDR Comercial">
            <svg className={`${sizeMap[size]} text-blue-600 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                />
            </svg>
            {showText && <span className="text-[10px] font-black text-blue-600 tracking-wide uppercase">Verificado</span>}
        </span>
    );
}

export default function Welcome({
    auth = {},
    categories = [],
    promotionalProducts = [],
    featuredProducts = [],
    latestEvents = [],
    companies = [],
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filtro para catálogo general
    const filteredProducts = featuredProducts.filter((product) => {
        const matchesCategory =
            selectedCategory === 'all' || product.category_id === Number(selectedCategory);
        const matchesSearch =
            searchTerm === '' ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Productos para la sección de promociones con descuento
    const promoList = promotionalProducts.length > 0
        ? promotionalProducts
        : featuredProducts.filter((p) => p.original_price && Number(p.original_price) > Number(p.price));

    const calculateDiscount = (product) => {
        if (!product.original_price || Number(product.original_price) <= Number(product.price)) {
            return null;
        }
        const diff = Number(product.original_price) - Number(product.price);
        const percent = Math.round((diff / Number(product.original_price)) * 100);
        return {
            percent,
            savings: diff,
        };
    };

    const getWhatsAppUrl = (company, product, customMessage = null) => {
        const phone = company?.whatsapp || company?.phone;
        if (!phone) return '#';
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const message = customMessage || encodeURIComponent(
            `Hola ${company.name}, vi el producto "${product.name}" con precio ${product.currency} ${Number(product.price).toFixed(2)} en LDR Comercial y deseo solicitar más información.`
        );
        return `https://wa.me/${cleanPhone}?text=${message}`;
    };

    const getPromoWhatsAppUrl = (company, product, discount) => {
        const phone = company?.whatsapp || company?.phone;
        if (!phone) return '#';
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const text = encodeURIComponent(
            `Hola ${company.name}, deseo aprovechar la promoción del producto "${product.name}" rebajado a ${product.currency} ${Number(product.price).toFixed(2)} por ${product.unit} (descuento del ${discount?.percent}% en LDR Comercial). ¿Tienen disponibilidad inmediata?`
        );
        return `https://wa.me/${cleanPhone}?text=${text}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            <Head title="LDR Comercial - Precios Transparentes y Empresas Verificadas de Bolivia" />

            {/* ═══════════════════════════════════════════════
                HEADER FIJO Y NAVEGACIÓN
            ═══════════════════════════════════════════════ */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Button */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:text-blue-600 transition focus:outline-none"
                        >
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <img
                            src="/images/logo.png"
                            alt="Logo LDR Comercial"
                            className="h-11 w-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div>
                            <span className="font-black text-2xl text-slate-900 tracking-tight">
                                LDR<span className="text-blue-600">Comercial</span>
                            </span>
                            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-medium border-l border-slate-200 pl-2">
                                Bolivia · Precios Transparentes
                            </span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                            >
                                <span>Mi Panel Comercial</span>
                                <span>→</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition"
                                >
                                    Publicar mi Empresa
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* --- SIDEBAR DRAWER --- */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                    
                    {/* Drawer */}
                    <div className="relative w-full max-w-xs bg-white shadow-2xl flex flex-col h-full transform transition-transform">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <span className="text-blue-600">Categorías</span>
                            </h2>
                            <button 
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm border border-slate-200 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 bg-white">
                            <ul className="space-y-1">
                                <li>
                                    <Link 
                                        href={route('home')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span className="text-lg">🏠</span> Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={route('categories.index')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span className="text-lg">📂</span> Todas las Categorías
                                    </Link>
                                </li>
                                <li className="pt-4 pb-2">
                                    <div className="px-4 text-xs font-black tracking-widest text-slate-400 uppercase">
                                        Explorar por Rubro
                                    </div>
                                </li>
                                {categories && categories.length > 0 ? (
                                    categories.map(category => (
                                        <li key={category.id}>
                                            <Link 
                                                href={route('companies.index', { category: category.id })}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition group"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <span className="w-6 text-center text-lg opacity-80 group-hover:opacity-100">{category.icon || '📌'}</span>
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-sm text-slate-500">No hay categorías disponibles.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                HERO: MISIÓN DE CONFIANZA Y BUSCADOR
            ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24">
                {/* Fondo Panorámico */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=80"
                        alt="Comercio y Empresas"
                        className="w-full h-full object-cover object-center opacity-25 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/80" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Columna Izquierda: Mensaje y Buscador */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300 mb-6 backdrop-blur">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Compra seguro en Bolivia · Empresas Verificadas y Precios Reales
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                Encuentra lo que buscas <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                                    sin riesgo de engaños
                                </span>
                            </h1>

                            <p className="mt-5 text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                                Olvídate de buscar en redes sociales con perfiles anónimos. En LDR Comercial conectas directamente con empresas y productores locales con precios públicos, verificación comprobada y contacto WhatsApp directo.
                            </p>

                            {/* Barra de Búsqueda */}
                            <div className="mt-8 bg-white p-2.5 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-2xl">
                                <div className="flex-1 flex items-center px-4 py-1">
                                    <span className="text-xl mr-3 text-slate-400">🔍</span>
                                    <input
                                        type="text"
                                        className="w-full border-none focus:ring-0 text-slate-900 placeholder-slate-400 text-sm font-medium"
                                        placeholder="¿Qué producto, material o equipo buscas hoy?..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="bg-slate-100 border-none rounded-xl text-slate-700 text-sm font-semibold focus:ring-0 px-4 py-3"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">Todos los rubros</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Badges de Garantía */}
                            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="text-emerald-400 font-bold">✓</span> Precios por Unidad Transparentes
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="text-emerald-400 font-bold">✓</span> Empresas Verificadas
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="text-emerald-400 font-bold">✓</span> Descuentos por Mayor (B2B)
                                </span>
                            </div>
                        </div>

                        {/* Columna Derecha: Mosaico Visual de Productos */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                            {featuredProducts.slice(0, 4).map((p, idx) => (
                                <div
                                    key={p.id}
                                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-xl flex flex-col justify-between ${
                                        idx === 0 ? 'translate-y-2' : idx === 3 ? '-translate-y-2' : ''
                                    }`}
                                >
                                    <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-800 relative">
                                        <img
                                            src={p.main_image || fallbackImage}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                        <span className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {p.currency} {Number(p.price).toFixed(0)} / {p.unit}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-[10px] text-blue-300 font-bold uppercase truncate flex items-center gap-1">
                                            <span>{p.company?.name}</span>
                                            {p.company?.is_verified && <VerifiedBadge size="xs" />}
                                        </div>
                                        <div className="text-xs font-bold text-white line-clamp-1">
                                            {p.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECCIÓN NUEVA: PROMOCIONES CON PRECIO POR UNIDAD Y % DESCUENTO
                (Reemplaza la sección informativa previa con ofertas reales)
            ═══════════════════════════════════════════════ */}
            <section className="bg-gradient-to-b from-red-50/70 via-orange-50/40 to-white py-16 sm:py-20 border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de la Sección de Promociones */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-sm shadow-red-500/20 uppercase tracking-wider">
                                <span className="animate-bounce">🔥</span>
                                Promociones & Ofertas por Unidad
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 leading-tight">
                                Precios Rebajados con Descuentos Reales
                            </h2>
                            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                                Negocios y productores locales publican promociones especiales con precio por unidad y porcentaje de ahorro verificado. Sin intermediarios ni costos ocultos.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                                <span>🏷️</span> Precio por Unidad
                            </span>
                            <span className="flex items-center gap-1.5 text-red-700 bg-red-100/70 px-3 py-1.5 rounded-xl">
                                <span>📉</span> Hasta 25% OFF
                            </span>
                        </div>
                    </div>

                    {/* Grid de Tarjetas de Promociones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {promoList.map((prod) => {
                            const discount = calculateDiscount(prod);
                            return (
                                <div
                                    key={`promo-${prod.id}`}
                                    className="group relative bg-white rounded-3xl border border-red-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Foto con Badge de Descuento Destacado */}
                                        <div className="relative h-60 bg-slate-100 overflow-hidden">
                                            <img
                                                src={prod.main_image || fallbackImage}
                                                alt={prod.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                            />

                                            {/* Badge de Porcentaje de Descuento */}
                                            {discount && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                                                    <span className="text-sm font-black tracking-tight">
                                                        -{discount.percent}%
                                                    </span>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-1 py-0.5 rounded">
                                                        DCTO
                                                    </span>
                                                </div>
                                            )}

                                            {/* Badge de Categoría */}
                                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur text-slate-700 text-xs font-bold rounded-full shadow-sm">
                                                {prod.category?.name || 'General'}
                                            </div>

                                            {/* Badge de Disponibilidad */}
                                            {prod.stock_quantity && (
                                                <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-slate-900/85 backdrop-blur text-white text-[11px] font-semibold rounded-md">
                                                    {prod.stock_quantity} disp. en stock
                                                </div>
                                            )}
                                        </div>

                                        {/* Información y Datos de Empresa */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-slate-800 truncate">
                                                    {prod.company?.name}
                                                </span>
                                                {prod.company?.is_verified && <VerifiedBadge size="xs" showText />}
                                            </div>

                                            <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                                                {prod.name}
                                            </h3>

                                            {prod.short_description && (
                                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                    {prod.short_description}
                                                </p>
                                            )}

                                            {/* CAJA DE PRECIOS PROMOCIONALES POR UNIDAD */}
                                            <div className="mt-5 bg-gradient-to-br from-red-50/60 to-orange-50/60 rounded-2xl p-4 border border-red-100/90 space-y-2">
                                                {/* Precio Original Tachado y Porcentaje */}
                                                {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-slate-400 line-through font-semibold">
                                                            Antes: {prod.currency} {Number(prod.original_price).toFixed(2)}
                                                        </span>
                                                        <span className="text-red-600 font-extrabold bg-red-100 px-2 py-0.5 rounded-full text-[11px]">
                                                            Ahorras {prod.currency} {Number(discount?.savings || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Precio de Oferta por Unidad */}
                                                <div className="flex items-baseline justify-between pt-1">
                                                    <span className="text-xs font-bold text-slate-700">
                                                        Precio Promoción:
                                                    </span>
                                                    <div className="text-right">
                                                        <span className="text-2xl font-black text-red-600 tracking-tight">
                                                            {prod.currency} {Number(prod.price).toFixed(2)}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-500 block -mt-1">
                                                            por {prod.unit}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Escala B2B Mayorista si existe */}
                                                {prod.wholesale_price && (
                                                    <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-[11px]">
                                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                                            <span>🏭</span> Escala Mayorista:
                                                        </span>
                                                        <span className="font-extrabold text-emerald-700">
                                                            {prod.currency} {Number(prod.wholesale_price).toFixed(2)} (desde {prod.min_wholesale_qty} {prod.unit}s)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón de Contacto y Compra Directa */}
                                    <div className="p-6 pt-0">
                                        <a
                                            href={getPromoWhatsAppUrl(prod.company, prod, discount)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black shadow-md shadow-emerald-600/20 transition duration-150"
                                        >
                                            <span className="text-lg">💬</span>
                                            <span>Pedir por WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Banner de Confianza al pie de las promociones */}
                    <div className="mt-12 bg-white rounded-2xl p-5 border border-orange-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">
                                🛡️
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">
                                    Precios reales respetados por cada empresa
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Todas las ofertas mostradas son vigentes y directas de comercios locales. Sin sorpresas al momento de contactar.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route('register')}
                            className="text-xs font-black text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl border border-orange-200 transition shrink-0"
                        >
                            ¿Tienes promociones? Publica tu negocio →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                RUBROS / CATEGORÍAS COMERCIALES
            ═══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                            Sectores Comerciales
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            Explora por Rubros y Actividades Económicas
                        </h2>
                    </div>
                    {selectedCategory !== 'all' && (
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                        >
                            Ver todos los rubros
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => {
                        const img = categoryImages[cat.slug] || fallbackImage;
                        const isSelected = selectedCategory === cat.id.toString();

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id.toString())}
                                className={`group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-end p-3.5 border-2 ${
                                    isSelected
                                        ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                                        : 'border-transparent'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                                <div className="relative z-10 text-white">
                                    <div className="text-xl mb-1">{cat.icon}</div>
                                    <h4 className="text-xs font-extrabold leading-snug line-clamp-2">
                                        {cat.name}
                                    </h4>
                                    <span className="text-[10px] text-blue-300 font-semibold block mt-0.5">
                                        {cat.products_count ?? 0} artículos
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                VITRINA GENERAL DE PRODUCTOS Y PRECIOS TRANSPARENTES
            ═══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                            Catálogo Completo
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                            Productos con Precios Transparentes
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Consulta precios minoristas por unidad y solicita cotizaciones mayoristas directas.
                        </p>
                    </div>
                    <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        Mostrando <span className="text-blue-600 font-bold">{filteredProducts.length}</span> artículos
                    </div>
                </div>

                {/* Explicación amigable de la insignia B2B */}
                <div className="mb-8 bg-blue-50/80 border border-blue-200/80 rounded-2xl px-5 py-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        B2B
                    </div>
                    <div>
                        <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">
                            ¿Qué significa la insignia B2B en un producto?
                        </h4>
                        <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                            Indica que la empresa es <strong>fabricante, importador o distribuidor mayorista</strong>. Si necesitas comprar en cantidad para tu negocio o reventa, puedes cotizar un precio preferencial por volumen haciendo clic en WhatsApp.
                        </p>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
                        <div className="text-5xl mb-3">🔍</div>
                        <h3 className="text-lg font-bold text-slate-800">No encontramos resultados</h3>
                        <p className="text-slate-500 text-sm mt-1">Prueba con otra palabra clave o selecciona otro rubro comercial.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((prod) => (
                            <div
                                key={prod.id}
                                className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    {/* Fotografía del Producto */}
                                    <div className="relative h-60 bg-slate-100 overflow-hidden">
                                        <img
                                            src={prod.main_image || fallbackImage}
                                            alt={prod.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />

                                        {/* Badges superiores */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <span className="px-3 py-1 bg-white/95 backdrop-blur text-blue-800 text-xs font-bold rounded-full shadow-sm">
                                                {prod.category?.name || 'General'}
                                            </span>
                                            {prod.wholesale_price && (
                                                <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-full shadow-sm" title="Productor / Mayorista">
                                                    B2B Mayorista
                                                </span>
                                            )}
                                        </div>

                                        {prod.stock_quantity && (
                                            <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold rounded-md">
                                                {prod.stock_quantity} disp.
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                                            {prod.name}
                                        </h3>

                                        {prod.short_description && (
                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                {prod.short_description}
                                            </p>
                                        )}

                                        {/* Empresa Proveedora */}
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                                            {prod.company?.logo ? (
                                                <img
                                                    src={prod.company.logo}
                                                    alt={prod.company.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    🏢
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                                                    <span>{prod.company?.name}</span>
                                                    {prod.company?.is_verified && <VerifiedBadge size="xs" />}
                                                </div>
                                                <div className="text-[11px] text-slate-400 truncate">
                                                    📍 {prod.company?.city || 'Bolivia'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Caja de Precios */}
                                        <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    Precio Regular:
                                                </span>
                                                <span className="text-xl font-black text-slate-900">
                                                    {prod.currency} {Number(prod.price).toFixed(2)}
                                                    <span className="text-xs font-normal text-slate-400"> / {prod.unit}</span>
                                                </span>
                                            </div>

                                            {prod.wholesale_price && (
                                                <div className="flex items-baseline justify-between border-t border-slate-200/70 pt-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-emerald-700 block">
                                                            Escala Mayorista:
                                                        </span>
                                                        <span className="text-[10px] text-emerald-600">
                                                            Desde {prod.min_wholesale_qty} {prod.unit}s
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-black text-emerald-700">
                                                        {prod.currency} {Number(prod.wholesale_price).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botón Cotizar */}
                                <div className="p-5 pt-0">
                                    <a
                                        href={getWhatsAppUrl(prod.company, prod)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition duration-150"
                                    >
                                        <span className="text-lg">💬</span>
                                        <span>Consultar por WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════
                AGENDA DE EVENTOS, FERIAS Y PROMOCIONES COMERCIALES
            ═══════════════════════════════════════════════ */}
            {latestEvents.length > 0 && (
                <section className="bg-slate-100/80 py-20 border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <span className="text-xs font-extrabold text-purple-600 tracking-wider uppercase bg-purple-50 px-3 py-1 rounded-full">
                                Agenda Comercial & Ferias
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                                Próximas Ferias, Ruedas B2B & Eventos
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Eventos presenciales y promociones con fecha límite de empresas bolivianas verificadas
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {latestEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col md:flex-row"
                                >
                                    {/* Fotografía del Evento */}
                                    <div className="relative md:w-5/12 h-56 md:h-auto bg-slate-200 overflow-hidden">
                                        <img
                                            src={evt.banner_image || fallbackImage}
                                            alt={evt.title}
                                            className="w-full h-full object-cover object-center"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow">
                                            {evt.event_type === 'fair' ? 'Feria Comercial' : 'Promoción Especial'}
                                        </div>
                                    </div>

                                    {/* Detalles */}
                                    <div className="p-6 md:w-7/12 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-purple-700 font-bold mb-2">
                                                <span>📅</span>
                                                <span>
                                                    {new Date(evt.start_date).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-black text-slate-900 leading-snug">
                                                {evt.title}
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                                                {evt.short_description || evt.description}
                                            </p>

                                            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                                                <div className="font-semibold text-slate-800">
                                                    📍 {evt.location_name || evt.city}
                                                </div>
                                                <div className="text-blue-600 font-medium flex items-center gap-1">
                                                    <span>Organiza: {evt.company?.name}</span>
                                                    {evt.company?.is_verified && <VerifiedBadge size="xs" />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-700">
                                                {evt.admission_type === 'free' ? 'Entrada Libre' : 'Registro Requerido'}
                                            </span>
                                            {evt.link ? (
                                                <a
                                                    href={evt.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                                                >
                                                    Más información →
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">En sede</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                DIRECTORIO DE EMPRESAS VERIFICADAS DE BOLIVIA
            ═══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                        Red Confiable
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                        Empresas y Negocios Verificados
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Cada empresa cuenta con identificación comprobada y contacto WhatsApp directo para compras seguras.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {companies.map((comp) => (
                        <div
                            key={comp.id}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
                        >
                            <div>
                                {/* Portada Fotográfica de Empresa */}
                                <div className="h-36 bg-slate-200 relative">
                                    <img
                                        src={comp.banner || fallbackImage}
                                        alt={comp.name}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                    {/* Logo Flotante */}
                                    <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-slate-100 overflow-hidden">
                                        <img
                                            src={comp.logo || fallbackImage}
                                            alt={comp.name}
                                            className="w-full h-full object-cover rounded-xl"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                    </div>

                                    {/* Insignia Verificado en Portada */}
                                    {comp.is_verified && (
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                            <VerifiedBadge size="xs" />
                                            <span className="text-[10px] font-black text-blue-700 uppercase">Verificado</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 pt-9">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-extrabold text-slate-900 text-base">
                                            {comp.name}
                                        </h4>
                                        {comp.is_verified && <VerifiedBadge size="sm" />}
                                    </div>

                                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                                        {comp.category?.name || 'Sector Empresarial'}
                                    </p>

                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                        {comp.short_description || comp.description}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                                        <span>📍 {comp.city || 'Bolivia'}</span>
                                        {comp.whatsapp && (
                                            <a
                                                href={`https://wa.me/${comp.whatsapp.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-600 font-bold hover:text-emerald-700 transition"
                                            >
                                                💬 WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Banner CTA para Negocios */}
                <div className="mt-14 bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">¿Eres comerciante, importador o productor?</span>
                        <h3 className="text-2xl font-black mt-1">Publica tus productos y promociones en LDR Comercial</h3>
                        <p className="text-slate-300 text-sm mt-1 max-w-xl">
                            Consigue clientes reales que buscan precios transparentes. Registra tu empresa y empieza a recibir consultas directas hoy.
                        </p>
                    </div>
                    <Link
                        href={route('register')}
                        className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition shrink-0"
                    >
                        🚀 Registrar mi Empresa
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════ */}
            <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="LDR Comercial"
                            className="h-9 w-auto opacity-90"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div>
                            <span className="font-bold text-white text-base">LDR Comercial</span>
                            <p className="text-[11px] text-slate-500">Hub de Negocios, Precios & Eventos en Bolivia</p>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 text-center md:text-left">
                        © {new Date().getFullYear()} LDR Comercial. Catálogos transparentes y empresas verificadas de Bolivia.
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <Link href={route('login')} className="hover:text-white transition">
                            Acceso Empresas
                        </Link>
                        <span>•</span>
                        <Link href={route('register')} className="hover:text-white transition">
                            Registrar Negocio
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

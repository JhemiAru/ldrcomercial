import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ company, stats, recentProducts = [], recentEvents = [] }) {
    const { auth } = usePage().props;
    // ═══════════════════════════════════════════════
    // SLIDER / CARRUSEL INTERACTIVO DEL DASHBOARD
    // ═══════════════════════════════════════════════
    const slides = [
        {
            id: 1,
            badge: '⚡ OPORTUNIDAD B2B & B2C',
            title: 'Multiplica tus ventas en Bolivia con LDR Comercial',
            description: 'Publica productos con precios transparentes al por menor o cotizaciones al por mayor. Destaca tus promociones y llega a clientes verificados.',
            buttonText: 'Publicar Nuevo Producto',
            buttonLink: route('products.create'),
            secondaryText: 'Ver Catálogo',
            secondaryLink: route('products.index'),
            bgColor: 'from-blue-900 via-indigo-900 to-slate-900',
            accentColor: 'text-blue-400',
            icon: '🚀',
        },
        {
            id: 2,
            badge: '🏆 INSIGNIA DE CONFIANZA',
            title: company?.is_verified ? 'Tu empresa cuenta con Insignia Verificada ✓' : 'Consigue la Insignia de Empresa Verificada',
            description: company?.is_verified
                ? 'Los clientes en Bolivia confían en tus precios y productos porque tu identidad comercial está 100% validada.'
                : 'Completa los datos de tu empresa (NIT, dirección y contacto) para obtener la insignia azul de verificación y atraer más compradores.',
            buttonText: 'Actualizar Perfil de Empresa',
            buttonLink: route('company.edit'),
            secondaryText: 'Ver Portal Público',
            secondaryLink: route('home'),
            bgColor: 'from-emerald-950 via-teal-900 to-slate-900',
            accentColor: 'text-emerald-400',
            icon: '🛡️',
        },
        {
            id: 3,
            badge: '⚽ SERVICIOS, CANCHAS Y EVENTOS',
            title: 'Promociona canchas deportivas, billar y ferias comerciales',
            description: 'Publica alquiler de canchas de fútbol, wally, mesas de billar y organiza torneos o ferias para convocar a toda tu comunidad.',
            buttonText: 'Organizar Nuevo Evento',
            buttonLink: route('events.create'),
            secondaryText: 'Ver Agenda',
            secondaryLink: route('events.index'),
            bgColor: 'from-amber-950 via-orange-950 to-slate-900',
            accentColor: 'text-amber-400',
            icon: '🎯',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const analyticsData = [
        { name: 'Lun', visitas: 120, clics: 45 },
        { name: 'Mar', visitas: 210, clics: 85 },
        { name: 'Mié', visitas: 150, clics: 55 },
        { name: 'Jue', visitas: 280, clics: 110 },
        { name: 'Vie', visitas: 340, clics: 160 },
        { name: 'Sáb', visitas: 420, clics: 210 },
        { name: 'Dom', visitas: 390, clics: 190 },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
                            <span>Panel de Control</span>
                            {company?.is_verified && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                                    <svg className="w-3.5 h-3.5 fill-blue-600 dark:fill-blue-400" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verificada
                                </span>
                            )}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">
                            Bienvenido a la gestión comercial de <strong className="text-slate-700 dark:text-white">{company?.name || 'tu negocio'}</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {auth?.user?.role === 'admin' && (
                            <Link
                                href={route('admin.companies.index')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-xs transition"
                            >
                                <span>🔑</span>
                                <span>Cuentas de Compañías</span>
                            </Link>
                        )}
                        <Link
                            href={route('sales.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-bold rounded-xl shadow-xs transition"
                        >
                            <span>📋</span>
                            <span>Ventas & Cotizaciones</span>
                        </Link>
                        <Link
                            href={route('products.create')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-xs transition"
                        >
                            <span>+</span>
                            <span>Nuevo Producto</span>
                        </Link>
                        <Link
                            href={route('company.edit')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-bold rounded-xl shadow-xs transition"
                        >
                            <span>🏢</span>
                            <span>Editar Empresa</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Panel de Control - LDR Comercial" />

            <div className="space-y-6">

                {/* SLIDER PRINCIPAL */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#0b132b] text-white shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-800 dark:border-white/5 transition-colors">
                    <div
                        className="transition-all duration-700 ease-out flex"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                className={`w-full shrink-0 p-6 sm:p-10 bg-gradient-to-r ${slide.bgColor} relative flex flex-col justify-between min-h-[220px] sm:min-h-[250px]`}
                            >
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black tracking-wide text-white mb-3">
                                        <span>{slide.icon}</span>
                                        <span>{slide.badge}</span>
                                    </div>
                                    <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                                        {slide.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                                        {slide.description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6">
                                    <Link
                                        href={slide.buttonLink}
                                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 transition transform hover:-translate-y-0.5"
                                    >
                                        {slide.buttonText}
                                    </Link>
                                    <Link
                                        href={slide.secondaryLink}
                                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/15 transition"
                                    >
                                        {slide.secondaryText}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition z-20"
                        aria-label="Anterior"
                    >
                        ‹
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition z-20"
                        aria-label="Siguiente"
                    >
                        ›
                    </button>

                    <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    currentSlide === idx ? 'w-7 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* KPIS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Catálogo Total
                            </span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {stats?.productsCount ?? 0}
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Productos registrados
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0 transition-colors">
                            📦
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Ofertas con Descuento
                            </span>
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                {stats?.promotionsCount ?? 0}
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Con precio tachado
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0 transition-colors">
                            🏷️
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Eventos & Alquileres
                            </span>
                            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
                                {stats?.eventsCount ?? 0}
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Ferias o canchas activas
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0 transition-colors">
                            ⚽
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Estado de Empresa
                            </span>
                            <div className="mt-1">
                                {company?.is_verified ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                        ✓ Verificada
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                        ⏳ En Revisión
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                {company?.city ? `Sede en ${company.city}` : 'Ubicación no fijada'}
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0 transition-colors">
                            🏢
                        </div>
                    </div>
                </div>

                {/* GRÁFICO DE ESTADÍSTICAS */}
                <div className="bg-white dark:bg-[#0b132b] p-5 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">Rendimiento de tu Catálogo</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vistas y clics de tus productos en los últimos 7 días</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1.5 text-orange-500">
                                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                Vistas
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-500">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                Clics
                            </div>
                        </div>
                    </div>
                    <div className="h-64 sm:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.2} vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--tw-prose-pre-bg, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', color: 'white' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="visitas" name="Vistas" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                                <Area type="monotone" dataKey="clics" name="Clics" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClics)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLUMNA IZQUIERDA: Tablas (Productos y Eventos) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* PRODUCTOS RECIENTES */}
                        <div className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs overflow-hidden transition-colors">
                            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm">
                                        Productos Recientes
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Tus últimos artículos añadidos al catálogo
                                    </p>
                                </div>
                                <Link href={route('products.index')} className="text-xs font-bold text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400 transition">
                                    Ver todos →
                                </Link>
                            </div>

                            {recentProducts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-white/5 transition-colors">
                                            <tr>
                                                <th className="px-5 py-3">Producto</th>
                                                <th className="px-5 py-3">Precio</th>
                                                <th className="px-5 py-3">Estado</th>
                                                <th className="px-5 py-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                                            {recentProducts.map((p) => {
                                                const hasDiscount = p.original_price && Number(p.original_price) > Number(p.price);
                                                return (
                                                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition">
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                                    {p.main_image ? (
                                                                        <img src={p.main_image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                                    ) : (
                                                                        <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">📦</span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                                                        {p.name}
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-500">
                                                                        {p.category?.name || 'General'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="font-black text-slate-900 dark:text-white">
                                                                Bs. {Number(p.price).toFixed(2)}
                                                            </div>
                                                            {hasDiscount && (
                                                                <div className="text-[10px] text-red-500 dark:text-red-400 line-through">
                                                                    Bs. {Number(p.original_price).toFixed(2)}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                p.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                                                            }`}>
                                                                {p.status === 'published' ? 'Publicado' : 'Borrador'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-right">
                                                            <Link href={route('products.edit', p.id)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-2.5 py-1 rounded-lg transition">
                                                                Editar
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center border-t border-slate-100 dark:border-white/5">
                                    <span className="text-3xl">📦</span>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-2">Aún no tienes productos</h4>
                                </div>
                            )}
                        </div>

                        {/* EVENTOS RECIENTES */}
                        <div className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs overflow-hidden transition-colors">
                            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm">
                                        Canchas y Eventos
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Tus últimas publicaciones deportivas o feriales
                                    </p>
                                </div>
                                <Link href={route('events.index')} className="text-xs font-bold text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400 transition">
                                    Ver todos →
                                </Link>
                            </div>

                            {recentEvents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-white/5 transition-colors">
                                            <tr>
                                                <th className="px-5 py-3">Nombre</th>
                                                <th className="px-5 py-3">Tipo</th>
                                                <th className="px-5 py-3">Estado</th>
                                                <th className="px-5 py-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                                            {recentEvents.map((e) => (
                                                <tr key={e.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition">
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                                {e.main_image ? (
                                                                    <img src={e.main_image} alt={e.title} className="w-full h-full object-cover" onError={(ev) => { ev.currentTarget.style.display = 'none'; }} />
                                                                ) : (
                                                                    <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">🎯</span>
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                                                {e.title}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                                                        {e.type === 'court' ? 'Cancha / Deporte' : 'Evento / Feria'}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            e.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                                                        }`}>
                                                            {e.status === 'published' ? 'Publicado' : 'Borrador'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <Link href={route('events.edit', e.id)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-2.5 py-1 rounded-lg transition">
                                                            Editar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center border-t border-slate-100 dark:border-white/5">
                                    <span className="text-3xl">⚽</span>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-2">Aún no tienes eventos o canchas</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                        Publica aquí tus reservas de canchas, mesas de billar, o eventos organizados.
                                    </p>
                                    <Link href={route('events.create')} className="mt-4 inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl transition">
                                        Publicar Nuevo Evento
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Atajos y Empresa */}
                    <div className="space-y-6">
                        {/* Perfil de Empresa */}
                        <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-3">
                                Ficha de tu Empresa
                            </h3>
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white font-black text-lg flex items-center justify-center shrink-0 overflow-hidden">
                                    {company?.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{company?.name?.charAt(0) || 'E'}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-black text-slate-900 dark:text-white text-sm truncate">
                                        {company?.name || 'Nombre no configurado'}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {company?.category?.name || 'Sector comercial'}
                                    </div>
                                </div>
                            </div>
                            <div className="py-3 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                    <span>Ciudad:</span>
                                    <strong className="text-slate-800 dark:text-white">{company?.city || 'No definida'}</strong>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                    <span>Teléfono:</span>
                                    <strong className="text-slate-800 dark:text-white">{company?.phone || 'No registrado'}</strong>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                    <span>Insignia:</span>
                                    <strong className={company?.is_verified ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-amber-600 dark:text-amber-400'}>
                                        {company?.is_verified ? '✓ Activada' : 'Pendiente'}
                                    </strong>
                                </div>
                            </div>
                            <Link href={route('company.edit')} className="mt-3 w-full block text-center py-2 px-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-xs rounded-xl transition border border-transparent dark:border-white/5">
                                Gestionar Perfil Empresarial
                            </Link>
                        </div>

                        {/* Atajos Rápidos */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 p-5 rounded-2xl text-white shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider text-orange-100 dark:text-orange-200 mb-2">
                                Atajos Rápidos
                            </h4>
                            <p className="text-xs text-white/90 dark:text-white/80 leading-relaxed mb-4">
                                Haz crecer tu presencia publicando promociones destacadas y gestionando tus alquileres.
                            </p>
                            <div className="space-y-2">
                                <Link href={route('products.create')} className="w-full flex items-center justify-between p-2.5 bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 rounded-xl text-xs font-bold transition">
                                    <span>➕ Crear nuevo producto</span>
                                    <span>→</span>
                                </Link>
                                <Link href={route('events.create')} className="w-full flex items-center justify-between p-2.5 bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 rounded-xl text-xs font-bold transition">
                                    <span>⚽ Publicar evento o cancha</span>
                                    <span>→</span>
                                </Link>
                                <Link href={route('home')} target="_blank" className="w-full flex items-center justify-between p-2.5 bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 rounded-xl text-xs font-bold transition">
                                    <span>🌐 Ver portal público</span>
                                    <span>↗</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

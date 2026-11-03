import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import CreateCompanyModal from './Companies/Partials/CreateCompanyModal';
import UsersTable from './Users/Partials/UsersTable';

export default function AdminDashboard({
    metrics = {},
    pendingVerificationList = [],
    recentCompanies = [],
    recentProducts = [],
    citiesDistribution = [],
    categories = [],
    users = [],
}) {
    const { auth, flash } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Pestaña activa ('resumen' | 'usuarios') con soporte de query param ?tab=usuarios
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam === 'usuarios' || tabParam === 'users') {
                return 'usuarios';
            }
        }
        return 'resumen';
    });

    const handleApproveVerification = (companyId) => {
        router.post(route('admin.companies.toggle-verification', companyId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Panel Maestro de Administración
                            </h1>
                            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                                👑 Super Admin
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Control del ecosistema B2B, empresas verificadas, catálogo y cuentas de acceso de LDR Comercial Bolivia
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                        >
                            <span>+</span>
                            <span>Registrar Empresa Verificada</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab(activeTab === 'usuarios' ? 'resumen' : 'usuarios')}
                            className={`px-3.5 py-2 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border ${
                                activeTab === 'usuarios'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                            }`}
                        >
                            <span>👥</span>
                            <span>{activeTab === 'usuarios' ? 'Ver Resumen' : `Gestionar Usuarios (${users.length})`}</span>
                        </button>

                        <Link
                            href={route('admin.companies.index')}
                            className="px-3.5 py-2 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                            <span>🏢</span>
                            <span>Administrar Empresas</span>
                        </Link>

                        <Link
                            href={route('home')}
                            target="_blank"
                            className="px-3.5 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                            <span>🌐</span>
                            <span>Ver Portal</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Panel Maestro de Administración - LDR Comercial" />

            <div className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Alerta Flash de Notificación */}
                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs">
                        <span className="text-base">✓</span>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2 shadow-xs">
                        <span className="text-base">⚠️</span>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    BARRA DE PESTAÑAS (TABS DEL DASHBOARD)
                   ═══════════════════════════════════════════════ */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('resumen')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                                activeTab === 'resumen'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-white dark:bg-[#0b132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <span>📊</span>
                            <span>Resumen del Ecosistema</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('usuarios')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                                activeTab === 'usuarios'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-white dark:bg-[#0b132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <span>👥</span>
                            <span>Gestión de Usuarios</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                activeTab === 'usuarios'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                            }`}>
                                {users.length}
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <Link
                            href={route('admin.users.index')}
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <span>Abrir Directorio en Pantalla Completa</span>
                            <span>↗</span>
                        </Link>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    VISTA 1: GESTIÓN DE USUARIOS (TAB 'usuarios')
                   ═══════════════════════════════════════════════ */}
                {activeTab === 'usuarios' && (
                    <div className="animate-fade-in space-y-6">
                        <UsersTable users={users} />
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    VISTA 2: RESUMEN EJECUTIVO (TAB 'resumen')
                   ═══════════════════════════════════════════════ */}
                {activeTab === 'resumen' && (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* 1. TARJETAS DE INDICADORES PRINCIPALES (KPIS) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            
                            {/* Tarjeta 1: Empresas */}
                            <div className="p-5 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-blue-500/40 transition">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Empresas en Plataforma
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                                        🏢
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {metrics.totalCompanies || 0}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs font-bold">
                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <span>✓</span>
                                            <span>{metrics.verifiedCompanies || 0} Verificadas</span>
                                        </span>
                                        {metrics.pendingCompanies > 0 && (
                                            <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg text-[10px]">
                                                ⏳ {metrics.pendingCompanies} Pendientes
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 2: Catálogo de Productos */}
                            <div className="p-5 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Catálogo B2B Activo
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
                                        📦
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {metrics.totalProducts || 0}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        <span>{metrics.publishedProducts || 0} Publicados</span>
                                        <span>•</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">{metrics.featuredProducts || 0} Destacados</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 3: Ecosistema de Usuarios */}
                            <div className="p-5 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-purple-500/40 transition">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Usuarios Registrados
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                                        👥
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {metrics.totalUsers || users.length || 0}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('usuarios')}
                                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                                    >
                                        <span>Gestionar {metrics.totalUsers || users.length} usuarios</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>

                            {/* Tarjeta 4: Prevención y Seguridad Antifraude */}
                            <div className="p-5 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-amber-500/40 transition">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Filtro de Seguridad
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
                                        🛡️
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                        <span>100% Blindado</span>
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                                        Verificación física y documental obligatoria
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* 2. SECCIÓN PRIORITARIA: EMPRESAS PENDIENTES */}
                        <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                            Empresas Pendientes de Verificación Presencial
                                        </h2>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Negocios registrados que requieren visita física del equipo comercial para validar local y NIT antes de publicar productos
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 self-start sm:self-auto">
                                    {pendingVerificationList.length} Por Validar
                                </span>
                            </div>

                            {pendingVerificationList.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-white/10 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                                                <th className="pb-3 pr-4">Empresa / Negocio</th>
                                                <th className="pb-3 pr-4">Rubro</th>
                                                <th className="pb-3 pr-4">Ciudad & Dirección</th>
                                                <th className="pb-3 pr-4">Titular / Contacto</th>
                                                <th className="pb-3 pr-4">Fecha Solicitud</th>
                                                <th className="pb-3 text-right">Acción Comercial</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {pendingVerificationList.map((company) => {
                                                const cleanPhone = (company.whatsapp || company.phone || company.user?.phone || '').replace(/[^0-9]/g, '');
                                                const whatsappMsg = `Hola ${company.name}, te contactamos de LDR Comercial para coordinar la visita presencial de verificación de tu negocio.`;
                                                const whatsappUrl = cleanPhone ? `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}` : null;

                                                return (
                                                    <tr key={company.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                                                        <td className="py-3.5 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                                                                    {company.logo ? (
                                                                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                                                                    ) : (
                                                                        company.name.charAt(0)
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                                        {company.name}
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-400">
                                                                        NIT: {company.tax_id || 'Sin NIT registrado'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">
                                                            {company.category?.name || 'Sector General'}
                                                        </td>
                                                        <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                                                            <div className="font-semibold">{company.city || 'Bolivia'}</div>
                                                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{company.address || 'Pendiente de dirección'}</div>
                                                        </td>
                                                        <td className="py-3.5 pr-4">
                                                            <div className="font-bold text-slate-800 dark:text-slate-200">
                                                                {company.user?.name || 'Titular'}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {company.phone || company.user?.email}
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 pr-4 text-slate-400 text-[11px]">
                                                            {new Date(company.created_at).toLocaleDateString('es-BO')}
                                                        </td>
                                                        <td className="py-3.5 text-right space-x-2">
                                                            {whatsappUrl && (
                                                                <a
                                                                    href={whatsappUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-[11px] transition inline-flex items-center gap-1"
                                                                    title="Coordinar visita por WhatsApp"
                                                                >
                                                                    <span>📲</span>
                                                                    <span className="hidden sm:inline">WhatsApp</span>
                                                                </a>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApproveVerification(company.id)}
                                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition inline-flex items-center gap-1 shadow-xs"
                                                                title="Aprobar verificación tras visita física"
                                                            >
                                                                <span>✓</span>
                                                                <span>Aprobar Verificación</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                    <span className="text-3xl block mb-2">🎉</span>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                        ¡Excelente! No hay empresas pendientes de verificación
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                                        Todas las empresas registradas cuentan con verificación presencial aprobada y sus papeles al día.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 3. DISTRIBUCIÓN GEOGRÁFICA Y CATEGORÍAS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Distribución por Ciudades */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>📍</span>
                                        <span>Empresas por Sede / Ciudad</span>
                                    </h3>
                                    <span className="text-[11px] font-bold text-slate-400">Bolivia</span>
                                </div>
                                <div className="space-y-3 pt-2">
                                    {citiesDistribution.map((cityItem, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                    {cityItem.city || 'Otras ciudades'}
                                                </span>
                                            </div>
                                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-white/10">
                                                {cityItem.count} empresas
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rubros y Categorías */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>🏷️</span>
                                        <span>Rubros Técnicos Activos</span>
                                    </h3>
                                    <span className="text-[11px] font-bold text-slate-400">{categories.length} Categorías</span>
                                </div>
                                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100/70 dark:hover:bg-white/10 transition">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="text-base">{cat.icon || '📦'}</span>
                                                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 text-xs">
                                                <span className="text-[11px] text-slate-500 font-semibold">
                                                    {cat.products_count} productos
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                    {cat.companies_count} empresas
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* 4. ACTIVIDAD RECIENTE: EMPRESAS Y PRODUCTOS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Últimas Empresas Registradas */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>🏢</span>
                                        <span>Últimas Empresas Registradas</span>
                                    </h3>
                                    <Link href={route('admin.companies.index')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Administrar empresas →
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {recentCompanies.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm shrink-0">
                                                    {c.logo ? <img src={c.logo} alt={c.name} className="w-full h-full object-cover rounded-xl" /> : c.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                        {c.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                        {c.city || 'Bolivia'} · {c.category?.name || 'General'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                {c.is_verified ? (
                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                                        Verificada ✓
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
                                                        Pendiente
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Últimos Productos Añadidos */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>📦</span>
                                        <span>Últimos Productos Publicados</span>
                                    </h3>
                                    <Link href={route('companies.index')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver catálogo →
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {recentProducts.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0 text-lg">
                                                    {p.main_image ? (
                                                        <img src={p.main_image} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        '📦'
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate" title={p.name}>
                                                        {p.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                                        {p.company?.name || 'Proveedor'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <div className="text-xs font-black text-slate-900 dark:text-white">
                                                    Bs. {Number(p.price).toFixed(2)}
                                                </div>
                                                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                    {p.in_stock ? 'En Stock' : 'Bajo Pedido'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* Modal para Registrar Empresa Verificada */}
            <CreateCompanyModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
}

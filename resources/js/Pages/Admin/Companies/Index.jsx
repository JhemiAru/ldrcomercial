import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ResetPasswordModal from './Partials/ResetPasswordModal';
import CreateCompanyModal from './Partials/CreateCompanyModal';
import ViewCompanyModal from './Partials/ViewCompanyModal';
import EditCompanyModal from './Partials/EditCompanyModal';
import DeleteCompanyModal from './Partials/DeleteCompanyModal';

export default function AdminCompaniesIndex({
    companies = [],
    usersWithoutCompany = [],
    categories = [],
    stats = {},
    filters = {},
}) {
    const { flash, auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [filterVerified, setFilterVerified] = useState('all'); // 'all' | 'verified' | 'unverified'

    // Estados de modales
    const [viewCompany, setViewCompany] = useState(null);
    const [editCompany, setEditCompany] = useState(null);
    const [deleteCompany, setDeleteCompany] = useState(null);
    const [selectedCompanyForReset, setSelectedCompanyForReset] = useState(null);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.companies.index'), { search }, { preserveState: true, replace: true });
    };

    const handleOpenResetModal = (company, user) => {
        setSelectedCompanyForReset(company);
        setSelectedUserForReset(user);
        setIsResetModalOpen(true);
    };

    const handleToggleVerification = (companyId) => {
        router.post(route('admin.companies.toggle-verification', companyId), {}, {
            preserveScroll: true,
        });
    };

    // Filtrar localmente si aplica
    const filteredCompanies = companies.filter((c) => {
        if (filterVerified === 'verified' && !c.is_verified) return false;
        if (filterVerified === 'unverified' && c.is_verified) return false;
        return true;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Administrar Empresas
                            </h1>
                            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                                👑 Super Admin
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Control integral de proveedores B2B: ver detalles, editar fichas, verificar locales y gestionar catálogos
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
                        >
                            <span>+</span>
                            <span>Registrar Empresa Verificada</span>
                        </button>

                        <Link
                            href={route('admin.dashboard')}
                            className="px-3.5 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                            <span>←</span>
                            <span>Volver al Dashboard</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Administrar Empresas - Panel Admin LDR Comercial" />

            <div className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Alertas Flash */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-base">✓</span>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-800 dark:text-red-300 text-xs font-bold flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    KPIS DE ADMINISTRACIÓN DE EMPRESAS
                   ═══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Empresas Totales</span>
                            <span className="text-xl">🏢</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.totalCompanies ?? companies.length}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Empresas registradas en plataforma</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Empresas Verificadas</span>
                            <span className="text-xl">🛡️</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
                            {stats?.verifiedCompanies ?? companies.filter(c => c.is_verified).length}
                        </div>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1 block">Con validación presencial aprobada</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Pendientes de Visita</span>
                            <span className="text-xl">⏳</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
                            {companies.filter(c => !c.is_verified).length}
                        </div>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 block">Por inspeccionar físicamente</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Cuentas Comerciales</span>
                            <span className="text-xl">🔑</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
                            {stats?.companyUsers ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Usuarios con rol Empresa B2B</span>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    BARRA DE BÚSQUEDA Y FILTRADO
                   ═══════════════════════════════════════════════ */}
                <div className="bg-white dark:bg-[#0b132b] p-5 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-96">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    placeholder="Buscar por nombre, NIT, ciudad o correo..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <span className="absolute left-2.5 top-3 text-slate-400 text-xs">🔍</span>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition shadow-xs"
                            >
                                Buscar
                            </button>
                        </form>

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Filtrar:</label>
                            <select
                                className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                value={filterVerified}
                                onChange={(e) => setFilterVerified(e.target.value)}
                            >
                                <option value="all">Todas las empresas ({companies.length})</option>
                                <option value="verified">Solo Verificadas ✓</option>
                                <option value="unverified">No Verificadas (Pendientes)</option>
                            </select>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        TABLA DE EMPRESAS (VER, EDITAR, ELIMINAR)
                       ═══════════════════════════════════════════════ */}
                    {filteredCompanies.length > 0 ? (
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/5">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-white/5">
                                    <tr>
                                        <th className="px-5 py-3.5">Empresa / Negocio</th>
                                        <th className="px-5 py-3.5">Titular / Acceso</th>
                                        <th className="px-5 py-3.5">Contacto & NIT</th>
                                        <th className="px-5 py-3.5">Catálogo</th>
                                        <th className="px-5 py-3.5">Verificación</th>
                                        <th className="px-5 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                                    {filteredCompanies.map((company) => {
                                        const companyUser = company.user;
                                        const cleanPhone = (company.whatsapp || company.phone || '').replace(/[^0-9]/g, '');

                                        return (
                                            <tr key={company.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                                                
                                                {/* Empresa */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        {company.logo ? (
                                                            <img
                                                                src={company.logo}
                                                                alt={company.name}
                                                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0 bg-white"
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                                                                {company.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                                                <span className="truncate">{company.name}</span>
                                                                {company.is_verified && (
                                                                    <span className="text-blue-500 text-xs shrink-0" title="Empresa Verificada">✓</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                                                {company.category?.name || 'Sector General'} • 📍 {company.city || 'Bolivia'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Cuenta de Acceso (Usuario) */}
                                                <td className="px-5 py-3.5">
                                                    {companyUser ? (
                                                        <div className="min-w-0">
                                                            <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate">
                                                                <span>📧</span>
                                                                <span className="truncate">{companyUser.email}</span>
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                                                {companyUser.name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">
                                                            Sin cuenta de usuario
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Contacto / NIT */}
                                                <td className="px-5 py-3.5">
                                                    <div className="space-y-0.5 text-[11px]">
                                                        {company.tax_id && (
                                                            <div><strong className="text-slate-400 text-[10px]">NIT:</strong> {company.tax_id}</div>
                                                        )}
                                                        {company.whatsapp ? (
                                                            <a
                                                                href={`https://wa.me/591${cleanPhone}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                                                            >
                                                                <span>📲</span>
                                                                <span>{company.whatsapp}</span>
                                                            </a>
                                                        ) : (
                                                            <div className="text-slate-400 text-xs">{company.phone || 'Sin teléfono'}</div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Catálogo de Productos y Eventos */}
                                                <td className="px-5 py-3.5">
                                                    <div className="text-xs">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            📦 {company.products_count ?? 0} productos
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            📅 {company.events_count ?? 0} eventos
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Verificación */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleVerification(company.id)}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition ${
                                                            company.is_verified
                                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 hover:bg-blue-100'
                                                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 hover:bg-amber-100'
                                                        }`}
                                                        title="Clic para cambiar estado de verificación presencial"
                                                    >
                                                        {company.is_verified ? '✓ Verificada' : '⏳ Pendiente'}
                                                    </button>
                                                </td>

                                                {/* Acciones: Ver, Editar, Clave, Eliminar */}
                                                <td className="px-5 py-3.5 text-right space-x-1.5 shrink-0">
                                                    
                                                    {/* Ver Detalles */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewCompany(company)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition"
                                                        title="Ver detalles completos de la empresa"
                                                    >
                                                        👁️
                                                    </button>

                                                    {/* Editar Empresa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditCompany(company)}
                                                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition"
                                                        title="Editar datos de la empresa"
                                                    >
                                                        ✏️
                                                    </button>

                                                    {/* Restablecer Contraseña */}
                                                    {companyUser && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenResetModal(company, companyUser)}
                                                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition"
                                                            title="Restablecer clave de acceso"
                                                        >
                                                            🔑
                                                        </button>
                                                    )}

                                                    {/* Eliminar Empresa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteCompany(company)}
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition"
                                                        title="Eliminar empresa definitivamente"
                                                    >
                                                        🗑️
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                            <span className="text-4xl">🏢</span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-3">
                                No se encontraron empresas
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                No hay resultados para el término de búsqueda ingresado o los filtros seleccionados.
                            </p>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════
                    CUENTAS SIN COMPAÑÍA CONFIGURADA
                   ═══════════════════════════════════════════════ */}
                {usersWithoutCompany.length > 0 && (
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Usuarios de empresa pendientes de completar su ficha ({usersWithoutCompany.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100 dark:border-white/5">
                                        <th className="py-2 px-3">Usuario</th>
                                        <th className="py-2 px-3">Correo</th>
                                        <th className="py-2 px-3">Rol</th>
                                        <th className="py-2 px-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {usersWithoutCompany.map((u) => (
                                        <tr key={u.id}>
                                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                                            <td className="py-2.5 px-3 font-mono">{u.email}</td>
                                            <td className="py-2.5 px-3 uppercase text-slate-500">{u.role}</td>
                                            <td className="py-2.5 px-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenResetModal({ name: u.name }, u)}
                                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-lg text-[11px] font-bold"
                                                >
                                                    🔑 Restablecer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════
                MODALES: VER, EDITAR, ELIMINAR, CREAR, CLAVE
               ═══════════════════════════════════════════════ */}
            
            {/* Modal de Ver Detalles de Empresa */}
            <ViewCompanyModal
                isOpen={!!viewCompany}
                onClose={() => setViewCompany(null)}
                company={viewCompany}
                onEdit={(c) => setEditCompany(c)}
                onResetPassword={(comp, usr) => handleOpenResetModal(comp, usr)}
            />

            {/* Modal de Edición de Empresa */}
            <EditCompanyModal
                isOpen={!!editCompany}
                onClose={() => setEditCompany(null)}
                company={editCompany}
                categories={categories}
            />

            {/* Modal de Eliminación de Empresa */}
            <DeleteCompanyModal
                isOpen={!!deleteCompany}
                onClose={() => setDeleteCompany(null)}
                company={deleteCompany}
            />

            {/* Modal de Restablecimiento de Contraseña */}
            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                targetCompany={selectedCompanyForReset}
                targetUser={selectedUserForReset}
            />

            {/* Modal para Registrar Nueva Empresa Verificada */}
            <CreateCompanyModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
}

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ResetPasswordModal from './Partials/ResetPasswordModal';

export default function AdminCompaniesIndex({
    companies = [],
    usersWithoutCompany = [],
    stats = {},
    filters = {},
}) {
    const { flash, auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [filterVerified, setFilterVerified] = useState('all'); // 'all' | 'verified' | 'unverified'

    // Estado del modal de restablecimiento de contraseña
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.companies.index'), { search }, { preserveState: true, replace: true });
    };

    const handleOpenResetModal = (company, user) => {
        setSelectedCompany(company);
        setSelectedUser(user);
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
                                Gestión de Cuentas de Compañías
                            </h1>
                            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                                Panel Maestro
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Restablecimiento directo de contraseñas y administración de credenciales de empresas para <strong className="text-slate-700 dark:text-slate-200">{auth?.user?.email}</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                            <span>🛡️</span>
                            <span>Sesión Administrador: <strong>{auth?.user?.name}</strong></span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Cuentas de Compañías & Contraseñas - Admin" />

            <div className="py-8 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Alerta de Notificación Flash */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-base">✓</span>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    KPIS DE ADMINISTRACIÓN
                   ═══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Empresas Registradas</span>
                            <span className="text-xl">🏢</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.totalCompanies ?? companies.length}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Fichas comerciales activas</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Empresas Verificadas</span>
                            <span className="text-xl">🛡️</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
                            {stats?.verifiedCompanies ?? 0}
                        </div>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1 block">Con insignia azul de confianza</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Cuentas de Acceso</span>
                            <span className="text-xl">👥</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.totalUsers ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Usuarios en base de datos</span>
                    </div>

                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Rol Compañía</span>
                            <span className="text-xl">🔑</span>
                        </div>
                        <div className="mt-2 text-2xl font-black text-orange-600 dark:text-orange-400">
                            {stats?.companyUsers ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Cuentas con acceso comercial</span>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    BARRA DE BÚSQUEDA Y FILTRADO
                   ═══════════════════════════════════════════════ */}
                <div className="bg-white dark:bg-[#0b132b] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-96">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Buscar por empresa, correo, NIT o ciudad..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <span className="absolute left-2.5 top-3 text-slate-400 text-xs">🔍</span>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                            >
                                Buscar
                            </button>
                        </form>

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Filtrar:</label>
                            <select
                                className="text-xs py-2 px-3 rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500"
                                value={filterVerified}
                                onChange={(e) => setFilterVerified(e.target.value)}
                            >
                                <option value="all">Todas las empresas</option>
                                <option value="verified">Solo Verificadas ✓</option>
                                <option value="unverified">No Verificadas</option>
                            </select>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        TABLA DE COMPAÑÍAS & RESTABLECIMIENTO
                       ═══════════════════════════════════════════════ */}
                    {filteredCompanies.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-white/5">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/90 dark:border-white/5">
                                    <tr>
                                        <th className="px-5 py-3.5">Empresa</th>
                                        <th className="px-5 py-3.5">Cuenta de Acceso (Usuario)</th>
                                        <th className="px-5 py-3.5">Contacto / NIT</th>
                                        <th className="px-5 py-3.5">Verificación</th>
                                        <th className="px-5 py-3.5 text-right">Gestión de Clave</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                                    {filteredCompanies.map((company) => {
                                        const companyUser = company.user;
                                        return (
                                            <tr key={company.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition">
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
                                                            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                                                                {company.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                <span>{company.name}</span>
                                                                {company.is_verified && (
                                                                    <span className="text-blue-500 text-xs" title="Empresa Verificada">✓</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                                {company.category?.name || 'Comercio General'} • 📍 {company.city || 'Bolivia'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Cuenta de Acceso (Usuario) */}
                                                <td className="px-5 py-3.5">
                                                    {companyUser ? (
                                                        <div>
                                                            <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                <span>📧</span>
                                                                <span>{companyUser.email}</span>
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                                Titular: {companyUser.name} • Rol: <span className="uppercase font-bold text-slate-600 dark:text-slate-300">{companyUser.role}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">
                                                            Sin usuario vinculado (ID {company.user_id})
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Contacto / NIT */}
                                                <td className="px-5 py-3.5">
                                                    <div className="space-y-0.5 text-[11px]">
                                                        {company.tax_id && (
                                                            <div><strong className="text-slate-500">NIT:</strong> {company.tax_id}</div>
                                                        )}
                                                        {company.whatsapp ? (
                                                            <a
                                                                href={`https://wa.me/591${company.whatsapp.replace(/[^0-9]/g, '')}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                                                            >
                                                                <span>💬</span> {company.whatsapp}
                                                            </a>
                                                        ) : (
                                                            <div className="text-slate-500">{company.phone || 'Sin teléfono'}</div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Verificación */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleVerification(company.id)}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                                                            company.is_verified
                                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100'
                                                                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-200'
                                                        }`}
                                                        title="Clic para cambiar estado de verificación"
                                                    >
                                                        {company.is_verified ? '✓ Verificada' : '○ No verificada'}
                                                    </button>
                                                </td>

                                                {/* Acción Principal: Restablecer Contraseña */}
                                                <td className="px-5 py-3.5 text-right">
                                                    {companyUser ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenResetModal(company, companyUser)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
                                                            title="Restablecer contraseña de esta cuenta de compañía"
                                                        >
                                                            <span>🔑</span>
                                                            <span>Restablecer Clave</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">-</span>
                                                    )}
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
                                No se encontraron compañías
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                No hay resultados para el término de búsqueda ingresado.
                            </p>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════
                    CUENTAS SIN COMPAÑÍA CONFIGURADA (OPCIONAL)
                   ═══════════════════════════════════════════════ */}
                {usersWithoutCompany.length > 0 && (
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Cuentas registradas pendientes de completar perfil ({usersWithoutCompany.length})
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
                MODAL DE RESTABLECIMIENTO DE CONTRASEÑA
               ═══════════════════════════════════════════════ */}
            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                targetCompany={selectedCompany}
                targetUser={selectedUser}
            />
        </AuthenticatedLayout>
    );
}


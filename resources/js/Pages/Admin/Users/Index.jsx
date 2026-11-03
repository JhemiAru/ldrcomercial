import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import UsersTable from './Partials/UsersTable';
import CreateUserModal from './Partials/CreateUserModal';

export default function UsersIndex({ users = [], stats = {}, filters = {} }) {
    const { auth, flash } = usePage().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Gestión Integral de Usuarios
                            </h1>
                            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                                👑 Super Admin
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Administra cuentas de acceso, roles de compradores y empresas, y credenciales del sistema
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
                        >
                            <span>+</span>
                            <span>Registrar Usuario</span>
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
            <Head title="Gestión de Usuarios - Admin LDR Comercial" />

            <div className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Alertas Flash */}
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

                {/* Métricas Rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-[11px] font-black uppercase">Total Usuarios</span>
                            <span className="text-xl">👥</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats.totalUsers || users.length}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-[11px] font-black uppercase">Empresas / Proveedores</span>
                            <span className="text-xl">🏢</span>
                        </div>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {stats.companyUsers || users.filter((u) => u.role === 'company').length}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-[11px] font-black uppercase">Compradores B2B</span>
                            <span className="text-xl">🛒</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {stats.buyerUsers || users.filter((u) => u.role === 'buyer').length}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/90 dark:border-white/10 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-[11px] font-black uppercase">Super Administradores</span>
                            <span className="text-xl">👑</span>
                        </div>
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                            {stats.adminUsers || users.filter((u) => u.role === 'admin').length}
                        </div>
                    </div>
                </div>

                {/* Tabla de Usuarios */}
                <UsersTable users={users} />

            </div>

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </AuthenticatedLayout>
    );
}


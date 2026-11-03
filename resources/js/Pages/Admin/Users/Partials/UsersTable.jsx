import React, { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import CreateUserModal from './CreateUserModal';
import ResetPasswordModal from '@/Pages/Admin/Companies/Partials/ResetPasswordModal';

export default function UsersTable({ users = [] }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    // Modales
    const [viewUser, setViewUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [resetUser, setResetUser] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Contadores de roles
    const counts = useMemo(() => {
        let total = users.length;
        let admin = 0;
        let company = 0;
        let buyer = 0;

        users.forEach((u) => {
            if (u.role === 'admin') admin++;
            else if (u.role === 'company') company++;
            else if (u.role === 'buyer') buyer++;
        });

        return { total, admin, company, buyer };
    }, [users]);

    // Filtrado en vivo por texto y rol
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            if (selectedRole !== 'all' && u.role !== selectedRole) {
                return false;
            }

            if (!search) return true;

            const term = search.toLowerCase();
            const nameMatch = u.name?.toLowerCase().includes(term);
            const emailMatch = u.email?.toLowerCase().includes(term);
            const phoneMatch = u.phone?.toLowerCase().includes(term);
            const companyMatch =
                u.company?.name?.toLowerCase().includes(term) ||
                (u.companies && u.companies.some((c) => c.name?.toLowerCase().includes(term)));

            return nameMatch || emailMatch || phoneMatch || companyMatch;
        });
    }, [users, search, selectedRole]);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return {
                    label: 'Super Admin',
                    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
                    icon: '👑',
                };
            case 'company':
                return {
                    label: 'Empresa B2B',
                    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
                    icon: '🏢',
                };
            default:
                return {
                    label: 'Comprador',
                    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
                    icon: '🛒',
                };
        }
    };

    return (
        <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 shadow-xs space-y-6">
            
            {/* Cabecera y Barra de Controles */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>👥</span>
                        <span>Directorio & Control de Usuarios</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Supervisa, edita roles, restablece credenciales y gestiona cuentas en la plataforma
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                    >
                        <span>+</span>
                        <span>Registrar Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                
                {/* Selector de Rol */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedRole('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                            selectedRole === 'all'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
                        }`}
                    >
                        Todos ({counts.total})
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRole('company')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                            selectedRole === 'company'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                        }`}
                    >
                        <span>🏢</span>
                        <span>Empresas ({counts.company})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRole('buyer')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                            selectedRole === 'buyer'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                        }`}
                    >
                        <span>🛒</span>
                        <span>Compradores ({counts.buyer})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                            selectedRole === 'admin'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20'
                        }`}
                    >
                        <span>👑</span>
                        <span>Admins ({counts.admin})</span>
                    </button>
                </div>

                {/* Input de Búsqueda */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre, email o empresa..."
                        className="w-full text-xs px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

            </div>

            {/* Tabla de Usuarios */}
            {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/10 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                                <th className="pb-3 pr-4">Usuario / Contacto</th>
                                <th className="pb-3 pr-4">Rol Asignado</th>
                                <th className="pb-3 pr-4">Teléfono / WhatsApp</th>
                                <th className="pb-3 pr-4">Empresa Vinculada</th>
                                <th className="pb-3 pr-4">Registrado</th>
                                <th className="pb-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredUsers.map((user) => {
                                const role = getRoleBadge(user.role);
                                const isCurrent = auth?.user?.id === user.id;
                                const userCompanies = user.companies || (user.company ? [user.company] : []);
                                const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                                        
                                        {/* Usuario y Email */}
                                        <td className="py-3.5 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-slate-900 dark:text-white truncate">
                                                            {user.name}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                                                                TÚ
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 truncate">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rol */}
                                        <td className="py-3.5 pr-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${role.badge}`}>
                                                <span>{role.icon}</span>
                                                <span>{role.label}</span>
                                            </span>
                                        </td>

                                        {/* Teléfono */}
                                        <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                                            {user.phone ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span>{user.phone}</span>
                                                    {cleanPhone && (
                                                        <a
                                                            href={`https://wa.me/591${cleanPhone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-500 hover:text-emerald-600 text-xs"
                                                            title="Abrir WhatsApp"
                                                        >
                                                            📲
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">No registrado</span>
                                            )}
                                        </td>

                                        {/* Empresas Vinculadas */}
                                        <td className="py-3.5 pr-4">
                                            {userCompanies.length > 0 ? (
                                                <div className="space-y-1">
                                                    {userCompanies.map((c) => (
                                                        <div key={c.id} className="flex items-center gap-1.5">
                                                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                                                                {c.name}
                                                            </span>
                                                            {c.is_verified ? (
                                                                <span className="text-emerald-500 text-[10px]" title="Empresa Verificada">
                                                                    ✓
                                                                </span>
                                                            ) : (
                                                                <span className="text-amber-500 text-[10px]" title="Sin verificar">
                                                                    ⏳
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">Sin empresas</span>
                                            )}
                                        </td>

                                        {/* Fecha */}
                                        <td className="py-3.5 pr-4 text-slate-400 text-[11px]">
                                            {new Date(user.created_at).toLocaleDateString('es-BO')}
                                        </td>

                                        {/* Acciones */}
                                        <td className="py-3.5 text-right space-x-1.5 shrink-0">
                                            
                                            {/* Ver Detalle */}
                                            <button
                                                type="button"
                                                onClick={() => setViewUser(user)}
                                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition"
                                                title="Ver detalles completos"
                                            >
                                                👁️
                                            </button>

                                            {/* Editar */}
                                            <button
                                                type="button"
                                                onClick={() => setEditUser(user)}
                                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition"
                                                title="Editar usuario"
                                            >
                                                ✏️
                                            </button>

                                            {/* Restablecer Contraseña */}
                                            <button
                                                type="button"
                                                onClick={() => setResetUser(user)}
                                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition"
                                                title="Restablecer contraseña"
                                            >
                                                🔑
                                            </button>

                                            {/* Eliminar (deshabilitado si es el admin actual) */}
                                            <button
                                                type="button"
                                                onClick={() => setDeleteUser(user)}
                                                disabled={isCurrent}
                                                className={`p-1.5 rounded-lg transition ${
                                                    isCurrent
                                                        ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                                                        : 'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400'
                                                }`}
                                                title={isCurrent ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
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
                <div className="py-12 text-center bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                    <span className="text-3xl block mb-2">🔍</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        No se encontraron usuarios
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        {search || selectedRole !== 'all'
                            ? 'Prueba ajustando los términos de búsqueda o cambiando el filtro de rol.'
                            : 'Aún no hay usuarios registrados en esta sección.'}
                    </p>
                </div>
            )}

            {/* Modales */}
            <ViewUserModal
                isOpen={!!viewUser}
                onClose={() => setViewUser(null)}
                user={viewUser}
                onEdit={(u) => setEditUser(u)}
                onResetPassword={(u) => setResetUser(u)}
            />

            <EditUserModal
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                user={editUser}
            />

            <DeleteUserModal
                isOpen={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                user={deleteUser}
            />

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <ResetPasswordModal
                isOpen={!!resetUser}
                onClose={() => setResetUser(null)}
                targetUser={resetUser}
                targetCompany={resetUser?.company || resetUser?.companies?.[0]}
            />

        </div>
    );
}


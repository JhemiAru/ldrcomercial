import React from 'react';

export default function ViewUserModal({ isOpen, onClose, user, onEdit, onResetPassword }) {
    if (!isOpen || !user) return null;

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return {
                    label: 'Super Administrador',
                    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
                    icon: '👑',
                };
            case 'company':
                return {
                    label: 'Empresa / Proveedor B2B',
                    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
                    icon: '🏢',
                };
            default:
                return {
                    label: 'Comprador / Cliente',
                    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
                    icon: '🛒',
                };
        }
    };

    const roleInfo = getRoleBadge(user.role);
    const companies = user.companies || (user.company ? [user.company] : []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-[#0b132b] w-full max-w-xl rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden my-8">
                
                {/* Header con Banner decorativo */}
                <div className="relative p-6 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition"
                    >
                        ✕
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-black tracking-tight truncate">{user.name}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${roleInfo.badge}`}>
                                    <span>{roleInfo.icon}</span>
                                    <span>{roleInfo.label}</span>
                                </span>
                            </div>
                            <p className="text-xs text-blue-200/90 truncate mt-0.5">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Contenido del Detalle */}
                <div className="p-6 space-y-6">
                    
                    {/* Ficha de Información de Usuario */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Correo Electrónico
                            </span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {user.email}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Teléfono / WhatsApp
                            </span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                <span>📞</span>
                                <span>{user.phone || 'No registrado'}</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Fecha de Registro
                            </span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {new Date(user.created_at).toLocaleDateString('es-BO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Estado de Verificación Email
                            </span>
                            <div className="text-xs font-bold">
                                {user.email_verified_at ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span>✓</span>
                                        <span>Verificado el {new Date(user.email_verified_at).toLocaleDateString('es-BO')}</span>
                                    </span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">
                                        Pendiente de verificación
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Empresas Vinculadas */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <span>🏢</span>
                                <span>Empresas Vinculadas ({companies.length})</span>
                            </h4>
                        </div>

                        {companies.length > 0 ? (
                            <div className="space-y-2.5">
                                {companies.map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                                                {c.logo ? <img src={c.logo} alt={c.name} className="w-full h-full object-cover rounded-xl" /> : c.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {c.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate">
                                                    NIT: {c.tax_id || 'S/N'} • {c.city || 'Bolivia'} • {c.category?.name || 'General'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            {c.is_verified ? (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                                    Verificada ✓
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                    No Verificada
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Este usuario no tiene ninguna empresa comercial vinculada.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            Cerrar
                        </button>
                        {onResetPassword && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onResetPassword(user);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-500/20 transition flex items-center gap-1.5"
                            >
                                <span>🔑</span>
                                <span>Restablecer Clave</span>
                            </button>
                        )}
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onEdit(user);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
                            >
                                <span>✏️</span>
                                <span>Editar Datos</span>
                            </button>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}


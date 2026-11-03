import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function DeleteUserModal({ isOpen, onClose, user }) {
    if (!isOpen || !user) return null;

    const { auth } = usePage().props;
    const [isDeleting, setIsDeleting] = useState(false);

    const isSelf = auth?.user?.id === user.id;
    const companies = user.companies || (user.company ? [user.company] : []);

    const handleDelete = () => {
        if (isSelf) return;

        setIsDeleting(true);
        router.delete(route('admin.users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-[#0b132b] w-full max-w-md rounded-3xl border border-red-200 dark:border-red-500/20 shadow-2xl overflow-hidden my-8">
                
                {/* Header Peligro */}
                <div className="p-6 bg-red-50/50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xl shrink-0 font-bold">
                        ⚠️
                    </div>
                    <div>
                        <h3 className="text-base font-black text-red-950 dark:text-red-200">
                            Eliminar Usuario Permanentemente
                        </h3>
                        <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-0.5">
                            Esta acción es destructiva e irreversible
                        </p>
                    </div>
                </div>

                {/* Contenido y Advertencias */}
                <div className="p-6 space-y-4">
                    
                    {isSelf ? (
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-300">
                            ⛔ Operación Bloqueada: No puedes eliminar tu propia cuenta de Administrador con la sesión activa.
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                ¿Estás seguro de que deseas eliminar permanentemente la cuenta del usuario{' '}
                                <strong className="text-slate-900 dark:text-white font-extrabold">{user.name}</strong> ({user.email})?
                            </p>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Rol:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{user.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Registrado el:</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {new Date(user.created_at).toLocaleDateString('es-BO')}
                                    </span>
                                </div>
                            </div>

                            {companies.length > 0 && (
                                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                                    <div className="font-black flex items-center gap-1.5">
                                        <span>⚡</span>
                                        <span>Empresas Vinculadas ({companies.length}):</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                                        Este usuario es titular de {companies.map((c) => c.name).join(', ')}. Al eliminar el usuario, sus empresas asociadas, productos y eventos también serán eliminados de la base de datos.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Botones de Acción */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            {isSelf ? 'Entendido / Cerrar' : 'Cancelar'}
                        </button>

                        {!isSelf && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white transition shadow-md shadow-red-600/20 flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>Eliminando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🗑️</span>
                                        <span>Sí, Eliminar Permanentemente</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DeleteCompanyModal({ isOpen, onClose, company }) {
    if (!isOpen || !company) return null;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.companies.destroy', company.id), {
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

    const productsCount = company.products_count ?? 0;
    const eventsCount = company.events_count ?? 0;

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
                            Eliminar Empresa Permanentemente
                        </h3>
                        <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-0.5">
                            Esta acción destruirá la ficha y su catálogo comercial
                        </p>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        ¿Estás seguro de que deseas eliminar permanentemente la empresa{' '}
                        <strong className="text-slate-900 dark:text-white font-extrabold">{company.name}</strong>?
                    </p>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Rubro:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{company.category?.name || 'General'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">NIT:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">{company.tax_id || 'Sin NIT'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Ciudad:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{company.city || 'Bolivia'}</span>
                        </div>
                        {company.user && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Titular de Cuenta:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{company.user.name}</span>
                            </div>
                        )}
                    </div>

                    {(productsCount > 0 || eventsCount > 0) && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                            <div className="font-black flex items-center gap-1.5">
                                <span>⚡</span>
                                <span>Catálogo Asociado en Riesgo:</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                                Esta empresa tiene <strong className="font-bold">{productsCount} producto(s)</strong> y <strong className="font-bold">{eventsCount} evento(s)</strong> registrados. Al confirmar la eliminación, todos sus productos y eventos se borrarán permanentemente del sistema.
                            </p>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            Cancelar
                        </button>

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
                                    <span>Sí, Eliminar Empresa</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}


import React from 'react';

export default function ViewCompanyModal({
    isOpen,
    onClose,
    company,
    onEdit,
    onResetPassword,
}) {
    if (!isOpen || !company) return null;

    const user = company.user;
    const cleanPhone = (company.whatsapp || company.phone || '').replace(/[^0-9]/g, '');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-[#0b132b] w-full max-w-2xl rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden my-8">
                
                {/* Header con Banner decorativo */}
                <div className="relative p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition"
                    >
                        ✕
                    </button>

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => onEdit && onEdit(company)}
                            className="relative group w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner cursor-pointer"
                            title="Clic para cambiar foto de perfil de la empresa"
                        >
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                                <span className="text-2xl font-black text-white">{company.name.charAt(0)}</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition">
                                📷
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-black tracking-tight truncate">{company.name}</h3>
                                {company.is_verified ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                                        <span>✓</span>
                                        <span>Verificada</span>
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                                        <span>⏳</span>
                                        <span>Pendiente</span>
                                    </span>
                                )}
                                {company.is_active ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                                        Activa
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-500/20 text-slate-300 border border-slate-400/30">
                                        Inactiva
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-blue-200/90 truncate mt-0.5">
                                {company.legal_name || company.name} {company.tax_id ? `• NIT: ${company.tax_id}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    
                    {/* Indicadores Clave de la Empresa */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                                Rubro / Sector
                            </span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {company.category?.name || 'Sector General'}
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                                Sede / Ciudad
                            </span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {company.city || 'Bolivia'}
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                                Catálogo Productos
                            </span>
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                📦 {company.products_count ?? 0} publicados
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                                Eventos / Ferias
                            </span>
                            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                📅 {company.events_count ?? 0} eventos
                            </div>
                        </div>
                    </div>

                    {/* Datos de Contacto y Ubicación */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>📍</span>
                            <span>Ubicación & Contacto Comercial</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block">Dirección Física:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {company.address || 'Sin dirección registrada'}
                                </span>
                                {company.department && (
                                    <div className="text-[11px] text-slate-400">Dpto: {company.department}</div>
                                )}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block">Teléfonos & WhatsApp:</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {company.whatsapp && (
                                        <a
                                            href={`https://wa.me/591${cleanPhone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100"
                                        >
                                            <span>📲</span>
                                            <span>WhatsApp: {company.whatsapp}</span>
                                        </a>
                                    )}
                                    {company.phone && company.phone !== company.whatsapp && (
                                        <span className="text-slate-600 dark:text-slate-300 font-semibold">
                                            Tel: {company.phone}
                                        </span>
                                    )}
                                    {!company.whatsapp && !company.phone && (
                                        <span className="text-slate-400">Sin teléfono</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block">Correo Institucional:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                                    {company.email || 'Sin correo de empresa'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block">Sitio Web:</span>
                                {company.website ? (
                                    <a
                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-bold truncate block"
                                    >
                                        🌐 {company.website}
                                    </a>
                                ) : (
                                    <span className="text-slate-400">Sin sitio web</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Descripción de la Empresa */}
                    {(company.short_description || company.description) && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>📝</span>
                                <span>Reseña Comercial</span>
                            </h4>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {company.short_description && (
                                    <p className="font-semibold mb-2">{company.short_description}</p>
                                )}
                                {company.description && (
                                    <p className="text-slate-500 dark:text-slate-400 whitespace-pre-line">{company.description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cuenta de Acceso Asociada */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>🔑</span>
                            <span>Cuenta de Usuario (Acceso Comercial)</span>
                        </h4>

                        {user ? (
                            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-200/80 dark:border-purple-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>👤 {user.name}</span>
                                        <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                        📧 {user.email} {user.phone ? `• Tel: ${user.phone}` : ''}
                                    </div>
                                </div>

                                {onResetPassword && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            onResetPassword(company, user);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
                                    >
                                        <span>🔑</span>
                                        <span>Restablecer Clave</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                                ⚠️ Esta empresa no tiene ningún usuario vinculado actualmente.
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <a
                            href={route('companies.show', company.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                        >
                            <span>🌐</span>
                            <span>Ver Ficha Pública</span>
                        </a>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                            >
                                Cerrar
                            </button>

                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onEdit(company);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
                                >
                                    <span>✏️</span>
                                    <span>Editar Empresa</span>
                                </button>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}


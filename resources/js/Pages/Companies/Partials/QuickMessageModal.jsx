import React from 'react';

export default function QuickMessageModal({
    isOpen,
    onClose,
    company,
    quickMessageText,
    setQuickMessageText,
    cleanPhone,
}) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-[#0b132b] border border-white/20 text-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white p-1 shrink-0 overflow-hidden">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl rounded-xl">
                                    {company.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-base text-white truncate">{company.name}</h3>
                            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Canal Comercial Verificado LDR
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Campo de redacción rápida del mensaje */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Mensaje o Consulta Comercial</span>
                        <span className="text-[10px] text-slate-400 normal-case font-normal">Personaliza tu texto</span>
                    </label>
                    <textarea
                        rows="3"
                        value={quickMessageText}
                        onChange={(e) => setQuickMessageText(e.target.value)}
                        className="w-full rounded-2xl bg-[#050914] border border-white/15 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 resize-none"
                        placeholder="Escribe tu consulta aquí..."
                    />
                </div>

                {/* Opciones directas de contacto */}
                <div className="space-y-2.5 pt-1">
                    {cleanPhone && (
                        <a
                            href={`https://wa.me/591${cleanPhone}?text=${encodeURIComponent(quickMessageText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition text-xs sm:text-sm group cursor-pointer"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            <span>Enviar directamente por WhatsApp</span>
                        </a>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {company.email && (
                            <a
                                href={`mailto:${company.email}?subject=${encodeURIComponent(`Consulta Comercial para ${company.name} - LDR Comercial`)}&body=${encodeURIComponent(quickMessageText)}`}
                                className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition"
                            >
                                <span>✉️ Por Correo</span>
                            </a>
                        )}
                        {company.phone && (
                            <a
                                href={`tel:${company.phone}`}
                                className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition"
                            >
                                <span>📞 Llamar</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

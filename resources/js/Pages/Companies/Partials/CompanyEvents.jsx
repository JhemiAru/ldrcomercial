import React from 'react';

export default function CompanyEvents({ company, events, contactWhatsApp }) {
    if ((!events || events.length === 0) && !company.description) {
        return null;
    }

    return (
        <div className="space-y-10 pt-4">
            {/* ───────────────────────────────────────────────
                SECCIÓN: FERIAS & EVENTOS DE LA EMPRESA
               ─────────────────────────────────────────────── */}
            {events && events.length > 0 && (
                <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-6 h-[2px] bg-purple-600"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-purple-600">
                            AGENDA EMPRESARIAL
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                        Ferias, Charlas & Eventos Activos
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {events.map((ev) => (
                            <div key={ev.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg">
                                        📅 {ev.event_date ? new Date(ev.event_date).toLocaleDateString('es-BO') : 'Próximamente'}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-semibold">{ev.location || 'Bolivia'}</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                                {ev.description && (
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {ev.description}
                                    </p>
                                )}
                                {contactWhatsApp && (
                                    <a
                                        href={`${contactWhatsApp}&text=${encodeURIComponent(`Hola ${company.name}, deseo información sobre su evento "${ev.title}".`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 pt-1"
                                    >
                                        Consultar asistencia por WhatsApp →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reseña Corporativa Expandida */}
            {company.description && (
                <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-6 h-[2px] bg-slate-400"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                            TRAYECTORIA
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                        Acerca de {company.name}
                    </h3>
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line shadow-xs">
                        {company.description}
                    </div>
                </div>
            )}
        </div>
    );
}

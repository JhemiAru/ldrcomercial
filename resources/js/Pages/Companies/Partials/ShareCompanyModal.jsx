import React from 'react';

export default function ShareCompanyModal({
    isOpen,
    onClose,
    company,
    selectedBannerKey,
    setSelectedBannerKey,
    getShareUrl,
    onCopyPageUrl,
    copied,
}) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-[#0b132b] border border-white/20 text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                            ↗️
                        </span>
                        <div>
                            <h3 className="font-bold text-sm text-white">Compartir Empresa</h3>
                            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{company.name}</p>
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

                {/* Selector de Flyer / Imagen para WhatsApp */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Elige qué flyer o imagen compartir
                        </label>
                        <span className="text-[10px] text-blue-400 font-bold">
                            {selectedBannerKey === 'card' ? 'Plantilla Auto' : selectedBannerKey === 'logo' ? 'Logotipo' : `Flyer Slide ${selectedBannerKey}`}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {/* Opción Slide 1 */}
                        <button
                            type="button"
                            onClick={() => setSelectedBannerKey('1')}
                            className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                selectedBannerKey === '1'
                                    ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 text-white'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                            }`}
                        >
                            <div className="w-full h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                                {company.banner ? (
                                    <img src={company.banner} alt="Flyer 1" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs">🖼️ 1</span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold truncate max-w-full">Flyer 1</span>
                        </button>

                        {/* Opción Slide 2 */}
                        {company.banner_2 && (
                            <button
                                type="button"
                                onClick={() => setSelectedBannerKey('2')}
                                className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                    selectedBannerKey === '2'
                                        ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 text-white'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                                }`}
                            >
                                <div className="w-full h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                                    <img src={company.banner_2} alt="Flyer 2" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold truncate max-w-full">Flyer 2</span>
                            </button>
                        )}

                        {/* Opción Slide 3 */}
                        {company.banner_3 && (
                            <button
                                type="button"
                                onClick={() => setSelectedBannerKey('3')}
                                className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                    selectedBannerKey === '3'
                                        ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 text-white'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                                }`}
                            >
                                <div className="w-full h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                                    <img src={company.banner_3} alt="Flyer 3" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold truncate max-w-full">Flyer 3</span>
                            </button>
                        )}

                        {/* Opción Logo */}
                        {company.logo && (
                            <button
                                type="button"
                                onClick={() => setSelectedBannerKey('logo')}
                                className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                    selectedBannerKey === 'logo'
                                        ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 text-white'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                                }`}
                            >
                                <div className="w-full h-11 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center">
                                    <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-bold truncate max-w-full">Logo</span>
                            </button>
                        )}

                        {/* Opción Tarjeta Auto con Productos */}
                        <button
                            type="button"
                            onClick={() => setSelectedBannerKey('card')}
                            className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                selectedBannerKey === 'card'
                                    ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 text-white'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                            }`}
                        >
                            <div className="w-full h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center text-xs">
                                ✨
                            </div>
                            <span className="text-[10px] font-bold truncate max-w-full">Productos</span>
                        </button>
                    </div>
                </div>

                {/* Vista previa en tiempo real de la imagen que verá WhatsApp */}
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Vista previa en WhatsApp y Redes
                        </label>
                        <a 
                            href={route('companies.og-image', { id: company.slug || company.id, banner: selectedBannerKey })} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline"
                        >
                            Ver imagen HD ↗
                        </a>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#050914] shadow-inner group relative max-h-48 flex items-center justify-center">
                        <img 
                            key={selectedBannerKey}
                            src={route('companies.og-image', { id: company.slug || company.id, banner: selectedBannerKey })} 
                            alt={`Flyer seleccionado de ${company.name}`} 
                            className="w-full h-full max-h-48 object-contain transition duration-300 group-hover:scale-[1.01]"
                            loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] font-black text-slate-300">
                            {selectedBannerKey === 'card' ? 'Tarjeta Auto' : selectedBannerKey === 'logo' ? 'Logo' : `Flyer ${selectedBannerKey}`}
                        </div>
                    </div>
                </div>

                {/* Copiar enlace */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Enlace personalizado con este Flyer
                    </label>
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#050914] border border-white/10">
                        <input 
                            type="text" 
                            readOnly 
                            value={getShareUrl(selectedBannerKey)} 
                            className="bg-transparent border-none text-xs text-slate-300 w-full px-2 focus:outline-hidden truncate"
                        />
                        <button
                            type="button"
                            onClick={onCopyPageUrl}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shrink-0 transition cursor-pointer"
                        >
                            {copied ? '✓ Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>

                {/* Botones de Redes Sociales para Compartir */}
                <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Compartir en redes sociales
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira el catálogo y promociones de ${company.name} en LDR Comercial Bolivia:\n${getShareUrl(selectedBannerKey)}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
                        >
                            <span>WhatsApp ↗</span>
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(selectedBannerKey))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition"
                        >
                            <span>Facebook ↗</span>
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(selectedBannerKey))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-bold transition"
                        >
                            <span>LinkedIn ↗</span>
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Catálogo oficial de ${company.name} en LDR Comercial Bolivia:`)}&url=${encodeURIComponent(getShareUrl(selectedBannerKey))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition"
                        >
                            <span>X (Twitter) ↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from 'react';

export default function ShareProductModal({
    product,
    onClose,
    company,
    getProductShareUrl,
    onCopyProductUrl,
    copied,
}) {
    if (!product) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-[#0b132b] border border-white/20 text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">
                            ↗️
                        </span>
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm text-white truncate">Compartir Producto</h3>
                            <p className="text-[11px] text-slate-400 truncate">{company.name}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Previsualización del Producto (Foto + Datos que cargará WhatsApp) */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                        {product.main_image ? (
                            <img 
                                src={product.main_image} 
                                alt={product.name} 
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-2xl">📦</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                            {product.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="font-mono font-black text-sm text-emerald-400">
                                {product.currency || 'Bs.'} {Number(product.price).toFixed(2)}
                            </span>
                            {product.wholesale_price && (
                                <span className="text-[10px] text-blue-400 font-bold">
                                    Mayor: {product.currency || 'Bs.'} {Number(product.wholesale_price).toFixed(2)}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <span>📸</span>
                            <span>WhatsApp cargará automáticamente la foto y datos de este producto.</span>
                        </p>
                    </div>
                </div>

                {/* Enlace Directo al Producto */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Enlace directo a la ficha del producto
                    </label>
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#050914] border border-white/10">
                        <input 
                            type="text" 
                            readOnly 
                            value={getProductShareUrl(product)} 
                            className="bg-transparent border-none text-xs text-slate-300 w-full px-2 focus:outline-hidden truncate font-mono"
                        />
                        <button
                            type="button"
                            onClick={() => onCopyProductUrl(product)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shrink-0 transition cursor-pointer"
                        >
                            {copied ? '✓ Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>

                {/* Botones de Redes Sociales */}
                <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Compartir en redes sociales
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                `Mira este producto de ${company.name} en LDR Comercial Bolivia:\n\n` +
                                `📦 *${product.name}*\n` +
                                `💰 *Precio:* ${product.currency || 'Bs.'} ${Number(product.price).toFixed(2)}\n\n` +
                                `👉 Ver foto y detalles completos aquí:\n${getProductShareUrl(product)}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                        >
                            <span>WhatsApp ↗</span>
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl(product))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition"
                        >
                            <span>Facebook ↗</span>
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getProductShareUrl(product))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-bold transition"
                        >
                            <span>LinkedIn ↗</span>
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira ${product.name} de ${company.name} en LDR Comercial Bolivia:`)}&url=${encodeURIComponent(getProductShareUrl(product))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition"
                        >
                            <span>X (Twitter) ↗</span>
                        </a>
                    </div>
                </div>

                {/* Link para ver ficha técnica directamente */}
                <div className="pt-1 text-center">
                    <a
                        href={route('products.show', product.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-bold hover:underline"
                    >
                        Abrir ficha técnica completa de este producto &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}

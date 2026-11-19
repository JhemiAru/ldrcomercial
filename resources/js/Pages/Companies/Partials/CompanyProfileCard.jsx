import React from 'react';
import { fallbackImage } from '../../Welcome/Partials/WelcomeUtils';

export const VerifiedBadge = ({ size = 'sm' }) => {
    const dims = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    return (
        <svg className={`${dims} text-blue-500 shrink-0 inline-block`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
};

export default function CompanyProfileCard({
    company,
    productsCount,
    liked,
    likesCount,
    onToggleLike,
    isFollowing,
    followersCount,
    onToggleFollow,
    onOpenShareModal,
    onOpenMessageModal,
    contactWhatsApp,
    fbUrl,
    igUrl,
    ttUrl,
    webUrl,
    googleMapsUrl,
}) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-4 sm:mt-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-200/90 dark:border-white/10 transition-colors">
                
                {/* Fila Superior: Logo + Badges + Suite Social */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    {/* Logo y Datos Principales */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                        
                        {/* Contenedor del Logo (integrado en la cabecera sin tapar el flyer) */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-1.5 shadow-md overflow-hidden border-2 border-slate-200/90 dark:border-slate-700 relative z-30">
                            {company.logo ? (
                                <img 
                                    src={company.logo} 
                                    alt={company.name} 
                                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white">
                                    {company.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Títulos y Metadatos */}
                        <div className="space-y-2">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                                    {company.category?.name || 'ECOSISTEMA EMPRESARIAL B2B'}
                                </span>
                                {company.is_verified && (
                                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5 shadow-xs">
                                        <VerifiedBadge size="sm" />
                                        <span>Tienda Verificada</span>
                                    </span>
                                )}
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    📍 {company.city || 'Bolivia'}
                                </span>
                            </div>

                            {/* Nombre del Negocio */}
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {company.name}
                            </h1>

                            {company.legal_name && company.legal_name !== company.name && (
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {company.legal_name} {company.tax_id ? `• NIT: ${company.tax_id}` : ''}
                                </p>
                            )}

                            {/* Datos de Atención y Ubicación Rápida */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
                                {(company.atencion || company.attention_hours) && (
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <span className="text-amber-500">⏰</span>
                                        <span>Horario: <strong>{company.atencion || company.attention_hours}</strong></span>
                                    </span>
                                )}
                                {company.address && (
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <span className="text-blue-500">📍</span>
                                        <span>{company.address}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones Sociales (Me Gusta, Seguir, Compartir) */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 pt-2 md:pt-0">
                        {/* Me Gusta */}
                        <button
                            type="button"
                            onClick={onToggleLike}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                                liked
                                    ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-white/10'
                            }`}
                            title="Me gusta"
                        >
                            <svg 
                                className={`w-4 h-4 transition-transform ${liked ? 'scale-110 fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
                                viewBox="0 0 24 24" 
                                fill={liked ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{liked ? 'Te gusta' : 'Me gusta'}</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/10">
                                {likesCount}
                            </span>
                        </button>

                        {/* Seguir */}
                        <button
                            type="button"
                            onClick={onToggleFollow}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                                isFollowing
                                    ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-xs dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-white/10'
                            }`}
                            title="Seguir novedades de la empresa"
                        >
                            <span>{isFollowing ? '✓ Siguiendo' : '+ Seguir'}</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/10">
                                {followersCount}
                            </span>
                        </button>

                        {/* Compartir */}
                        <button
                            type="button"
                            onClick={onOpenShareModal}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition cursor-pointer"
                            title="Compartir catálogo"
                        >
                            <span>↗ Compartir</span>
                        </button>
                    </div>
                </div>

                {/* Descripción de la Empresa */}
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/10">
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
                        {company.short_description || company.description || 'Proveedor comercial verificado. Catálogo de productos y soluciones industriales, técnicas y comerciales con trato directo y sin intermediarios.'}
                    </p>
                </div>

                {/* Barra de Acciones Directas: WhatsApp + Redes Sociales Oficiales */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Botón Principal de WhatsApp y Contacto */}
                    <div className="flex flex-wrap items-center gap-3">
                        {contactWhatsApp && (
                            <a
                                href={contactWhatsApp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Contactar por WhatsApp</span>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={onOpenMessageModal}
                            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                        >
                            <span>💬 Mandar Cotización</span>
                        </button>
                    </div>

                    {/* Redes Sociales Oficiales en Píldoras Limpias */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Facebook */}
                        {fbUrl && (
                            <a
                                href={fbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-[#1877F2] font-bold text-xs flex items-center gap-1.5 transition border border-blue-200/80 dark:border-blue-800/40"
                                title="Página de Facebook"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span>Facebook</span>
                            </a>
                        )}

                        {/* TikTok */}
                        {ttUrl && (
                            <a
                                href={ttUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                                title="Cuenta de TikTok"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                                <span>TikTok</span>
                            </a>
                        )}

                        {/* Instagram */}
                        {igUrl && (
                            <a
                                href={igUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 text-[#E1306C] font-bold text-xs flex items-center gap-1.5 transition border border-pink-200/80 dark:border-pink-800/40"
                                title="Instagram"
                            >
                                <span>📷 Instagram</span>
                            </a>
                        )}

                        {/* Sitio Web */}
                        {webUrl && (
                            <a
                                href={webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
                                title="Sitio Web Oficial"
                            >
                                <span>🌐 Web</span>
                            </a>
                        )}

                        {/* Google Maps */}
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
                            title="Ver en Google Maps"
                        >
                            <span>🗺️ Mapa</span>
                        </a>
                    </div>
                </div>

                {/* Fila de Insignias de Confianza */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Ubicación</p>
                            <p className="text-[11px] text-slate-500">{company.city || 'Bolivia'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🛡️</span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Seguridad</p>
                            <p className="text-[11px] text-slate-500">100% Verificada</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📦</span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Catálogo</p>
                            <p className="text-[11px] text-slate-500">{productsCount} productos publicados</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🤝</span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Trato Directo</p>
                            <p className="text-[11px] text-slate-500">Sin intermediarios</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

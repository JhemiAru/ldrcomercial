import { Head, Link } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';
import { fallbackImage, getPromoWhatsAppUrl, Stars } from '../Welcome/Partials/WelcomeUtils';

export default function OffersIndex({ offers, categories }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-rose-500 selection:text-white">
            <Head title="Ofertas y Promociones" />

            <Header categories={categories} />

            {/* --- HERO OFERTAS --- */}
            <div className="bg-rose-600 py-16 border-b border-rose-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-rose-500/30 border border-rose-400/50 backdrop-blur-sm text-xs font-black uppercase tracking-widest mb-4">
                        Descuentos Especiales
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight shadow-sm">Promociones B2B y B2C</h1>
                    <p className="text-rose-100 max-w-2xl mx-auto mb-8 text-sm md:text-base font-medium">
                        Descubre productos con precios rebajados directos de los proveedores. Trato sin intermediarios para asegurar el mejor ahorro.
                    </p>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-bold text-2xl text-gray-900">
                        Catálogo de Ofertas <span className="text-rose-500 text-lg">({offers.total})</span>
                    </h2>
                </div>

                {offers.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm max-w-2xl mx-auto mt-10">
                        <div className="text-5xl mb-4">🏷️</div>
                        <h3 className="font-bold text-gray-900 text-lg">No hay ofertas en este momento</h3>
                        <p className="text-gray-500 text-sm mt-1">Nuestras empresas están preparando nuevos descuentos. ¡Vuelve pronto!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {offers.data.map(prod => (
                            <div key={prod.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-xl transition duration-300 flex flex-col">
                                <div className="relative h-56 bg-gray-100 shrink-0">
                                    <img 
                                        src={prod.main_image || fallbackImage} 
                                        alt={prod.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                    
                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                        <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded shadow-sm">
                                            -{Math.round((1 - (prod.price / prod.original_price)) * 100)}%
                                        </span>
                                        {prod.wholesale_price && (
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">B2B</span>
                                        )}
                                    </div>

                                    {/* Company Mini Badge */}
                                    {prod.company && (
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-100 flex items-center gap-1.5">
                                            <img src={prod.company.logo || fallbackImage} className="w-4 h-4 rounded-full object-cover" />
                                            <span className="text-[9px] font-bold text-gray-800 line-clamp-1 max-w-[80px]">{prod.company.name}</span>
                                        </div>
                                    )}

                                    {/* Hover Action */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a 
                                            href={getPromoWhatsAppUrl(prod.company, prod, Math.round((1 - (prod.price / prod.original_price)) * 100))}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-white px-4 py-2 rounded-full font-bold text-xs text-rose-500 hover:bg-rose-500 hover:text-white transition shadow-lg flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/></svg>
                                            Lo Quiero
                                        </a>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-semibold">{prod.category?.name}</p>
                                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-rose-600 transition flex-1">
                                        {prod.name}
                                    </h4>
                                    <div className="mb-3"><Stars /></div>
                                    <div className="flex items-end justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs line-through font-medium">{prod.currency} {Number(prod.original_price).toFixed(2)}</span>
                                            <span className="text-rose-600 font-black text-lg leading-none">{prod.currency} {Number(prod.price).toFixed(2)}</span>
                                        </div>
                                        <a 
                                            href={getPromoWhatsAppUrl(prod.company, prod)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINACIÓN */}
                {offers.links && offers.links.length > 3 && (
                    <div className="mt-12 flex justify-center flex-wrap gap-2">
                        {offers.links.map((link, i) => (
                            <Link 
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition ${link.active ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:text-rose-500'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* --- FOOTER SIMPLIFICADO --- */}
            <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800 mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="font-black text-xl tracking-tighter text-white">
                            LDR<span className="text-rose-500">.</span>
                        </div>
                    </div>
                    <div className="text-xs text-center">
                        © {new Date().getFullYear()} LDR Comercial. Catálogos transparentes.
                    </div>
                </div>
            </footer>
        </div>
    );
}


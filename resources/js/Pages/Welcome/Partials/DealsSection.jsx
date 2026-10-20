import { fallbackImage, getPromoWhatsAppUrl, Stars } from './WelcomeUtils';

export default function DealsSection({ promotionalProducts, featuredProducts }) {
    return (
        <section className="bg-gray-50 border-t border-gray-200 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
                
                {/* DEAL OF THE DAY WIDGET (LEFT COL) */}
                <div className="hidden lg:block w-[260px] shrink-0 border border-gray-200 rounded-xl bg-white p-5">
                    <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase mb-5">Oferta del Día</h3>
                    {promotionalProducts[0] ? (
                        <div className="text-center group">
                            <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                                <img src={promotionalProducts[0].main_image || fallbackImage} alt="Deal" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={(e) => { e.currentTarget.src = fallbackImage; }}/>
                                <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded">
                                    - {Math.round((1 - (promotionalProducts[0].price / promotionalProducts[0].original_price)) * 100)}%
                                </div>
                            </div>
                            <div className="flex justify-center mb-2"><Stars /></div>
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2">{promotionalProducts[0].name}</h4>
                            <div className="flex justify-center items-center gap-3 mb-4">
                                <span className="text-rose-500 font-black text-lg">{promotionalProducts[0].currency} {promotionalProducts[0].price}</span>
                                <span className="text-gray-400 text-sm line-through">{promotionalProducts[0].currency} {promotionalProducts[0].original_price}</span>
                            </div>
                            <a 
                                href={getPromoWhatsAppUrl(promotionalProducts[0].company, promotionalProducts[0])}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase rounded-md transition"
                            >
                                Pedir por WhatsApp
                            </a>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-center">
                                <div className="w-10 h-12 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                                    <span className="font-bold text-gray-800 text-sm">360</span><span className="text-[9px] text-gray-500 uppercase">Días</span>
                                </div>
                                <div className="w-10 h-12 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                                    <span className="font-bold text-gray-800 text-sm">24</span><span className="text-[9px] text-gray-500 uppercase">Hrs</span>
                                </div>
                                <div className="w-10 h-12 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                                    <span className="font-bold text-gray-800 text-sm">59</span><span className="text-[9px] text-gray-500 uppercase">Min</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">No hay ofertas de tiempo limitado hoy.</p>
                    )}
                </div>

                {/* NUEVOS PRODUCTOS GRID (RIGHT COL) */}
                <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-6">Nuevos Productos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...featuredProducts, ...promotionalProducts].slice(0, 8).map(prod => (
                            <div key={prod.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition duration-300">
                                <div className="relative h-48 bg-gray-100">
                                    <img 
                                        src={prod.main_image || fallbackImage} 
                                        alt={prod.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                    {/* Status badges */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {prod.original_price > prod.price && (
                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                                                -{Math.round((1 - (prod.price / prod.original_price)) * 100)}%
                                            </span>
                                        )}
                                        {prod.wholesale_price && (
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">B2B</span>
                                        )}
                                    </div>
                                    {/* Hover Overlay actions */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <a 
                                            href={getPromoWhatsAppUrl(prod.company, prod)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition shadow"
                                            title="Contactar por WhatsApp"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{prod.category?.name}</p>
                                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-2 hover:text-rose-500 cursor-pointer">{prod.name}</h4>
                                    <div className="mb-2"><Stars /></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-900 font-black text-sm">{prod.currency} {Number(prod.price).toFixed(2)}</span>
                                        {prod.original_price > prod.price && (
                                            <span className="text-gray-400 text-xs line-through">{prod.currency} {Number(prod.original_price).toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


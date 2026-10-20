import { Head, Link } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';
import { fallbackImage } from '../Welcome/Partials/WelcomeUtils';

export default function PublicIndex({ events, categories }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-rose-500 selection:text-white">
            <Head title="Canchas & Eventos" />

            <Header categories={categories} />

            {/* --- HERO CANCHAS & EVENTOS --- */}
            <div className="bg-slate-900 py-16 border-b border-gray-200 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540304834241-11d51a65f973?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">Canchas & Eventos</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Reserva canchas deportivas, descubre lugares de entretenimiento y encuentra los mejores eventos publicados por nuestras empresas verificadas.
                    </p>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-bold text-2xl text-gray-900">
                        Resultados <span className="text-rose-500 text-lg">({events.total})</span>
                    </h2>
                </div>

                {events.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm max-w-2xl mx-auto mt-10">
                        <div className="text-5xl mb-4">🎫</div>
                        <h3 className="font-bold text-gray-900 text-lg">No hay eventos ni canchas</h3>
                        <p className="text-gray-500 text-sm mt-1">Pronto nuestras empresas publicarán nuevos servicios.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.data.map(evt => (
                            <div key={evt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col group">
                                <div className="relative h-48 bg-gray-200 shrink-0">
                                    <img 
                                        src={evt.banner_image || fallbackImage} 
                                        alt={evt.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded shadow-sm">
                                        {evt.event_type || 'Servicio'}
                                    </div>

                                    {/* Company Mini Badge */}
                                    {evt.company && (
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-100 flex items-center gap-1.5">
                                            <img src={evt.company.logo || fallbackImage} className="w-4 h-4 rounded-full object-cover" />
                                            <span className="text-[9px] font-bold text-gray-800 line-clamp-1 max-w-[100px]">{evt.company.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h4 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2 group-hover:text-rose-600 transition">{evt.title}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{evt.short_description || evt.description}</p>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4 flex flex-col gap-2 border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            <span className="line-clamp-1">{evt.location || evt.city || 'Ubicación a convenir'}</span>
                                        </div>
                                        {evt.start_date && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                <span>Inicia: {new Date(evt.start_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {evt.link ? (
                                        <a 
                                            href={evt.link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg text-xs transition"
                                        >
                                            Más Información
                                        </a>
                                    ) : evt.company?.whatsapp ? (
                                        <a 
                                            href={`https://wa.me/${evt.company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, quiero información sobre: ' + evt.title)}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="block w-full text-center bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2.5 rounded-lg text-xs transition"
                                        >
                                            Consultar Disponibilidad
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINACIÓN */}
                {events.links && events.links.length > 3 && (
                    <div className="mt-12 flex justify-center flex-wrap gap-2">
                        {events.links.map((link, i) => (
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

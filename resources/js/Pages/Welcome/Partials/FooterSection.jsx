import { Link } from '@inertiajs/react';
import { fallbackImage } from './WelcomeUtils';

export default function FooterSection({ latestEvents }) {
    return (
        <>
            {/* --- OUR SERVICES & FOOTER --- */}
            <div className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl text-rose-300">🌍</div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Trato Directo</h4>
                                <p className="text-xs text-gray-500 mt-1">Sin comisiones, trata directo con el vendedor.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl text-rose-300">🚀</div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Ofertas B2B</h4>
                                <p className="text-xs text-gray-500 mt-1">Precios preferenciales para compras por mayor.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl text-rose-300">📞</div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Soporte Local</h4>
                                <p className="text-xs text-gray-500 mt-1">Directorio 100% verificado en Bolivia.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl text-rose-300">🛡️</div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Empresas Reales</h4>
                                <p className="text-xs text-gray-500 mt-1">Insignias de verificación para tu seguridad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EVENTOS & ENTRETENIMIENTO --- */}
            {latestEvents && latestEvents.length > 0 && (
                <section id="entretenimiento" className="bg-white border-t border-gray-200 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">Lugares de Entretenimiento & Eventos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {latestEvents.map((evt) => (
                                <div key={evt.id} className="bg-gray-50 rounded-xl overflow-hidden group hover:shadow-lg transition duration-300 border border-gray-200">
                                    <div className="relative h-40 bg-gray-200">
                                        <img 
                                            src={evt.banner_image || fallbackImage} 
                                            alt={evt.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded">
                                            {evt.event_type || 'Servicio'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{evt.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{evt.short_description || evt.description}</p>
                                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                                            <span>📍 {evt.city || evt.location}</span>
                                            {evt.link ? (
                                                <a href={evt.link} target="_blank" className="text-rose-500 font-bold hover:underline">Ver Más</a>
                                            ) : (
                                                <span className="text-rose-500 font-bold">Reserva</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="font-black text-2xl tracking-tighter text-white">
                            LDR<span className="text-rose-500">.</span>
                        </div>
                        <div>
                            <span className="font-bold text-white text-base ml-2">Comercial</span>
                        </div>
                    </div>

                    <div className="text-xs text-center md:text-left">
                        © {new Date().getFullYear()} LDR Comercial. Catálogos transparentes y empresas verificadas de Bolivia.
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <Link href={route('login')} className="hover:text-rose-500 transition">
                            Acceso Empresas
                        </Link>
                        <span>|</span>
                        <Link href={route('register')} className="hover:text-rose-500 transition">
                            Registrar Negocio
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    );
}


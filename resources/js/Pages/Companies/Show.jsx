import { Head, Link } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';
import { fallbackImage, getPromoWhatsAppUrl } from '../Welcome/Partials/WelcomeUtils';

const VerifiedBadge = ({ size = 'sm' }) => {
    const dims = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <svg className={`${dims} text-orange-500 shrink-0`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
};

export default function Show({ company, categories }) {
    const contactWhatsApp = company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola ' + company.name + ', vengo desde LDR Comercial y me gustaría solicitar más información.')}` : '#';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
            <Head title={`${company.name} - Directorio B2B`} />
            <Header categories={categories} />

            {/* --- HERO SECTION --- */}
            <div className="relative bg-[#0b132b] text-white pt-20 pb-0 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={company.banner || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80'} 
                        alt="Banner" 
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b] via-[#0b132b]/90 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl pb-16">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-[2px] bg-orange-500"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                                {company.category?.name || 'PERFIL EMPRESARIAL B2B'}
                            </span>
                        </div>
                        
                        {/* Title with Logo */}
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-20 h-20 shrink-0 bg-white rounded-xl p-1 shadow-lg overflow-hidden">
                                <img 
                                    src={company.logo || fallbackImage} 
                                    alt={company.name} 
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight flex items-center gap-3">
                                {company.name}
                                {company.is_verified && <VerifiedBadge size="md" />}
                            </h1>
                        </div>
                        
                        {/* Subtitle */}
                        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-slate-200">
                            Soluciones completas. <br className="hidden md:block"/>
                            <span className="text-orange-500">Atención directa.</span>
                        </h2>

                        <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                            {company.short_description || 'Explora nuestro catálogo de productos y servicios. Nos especializamos en brindar las mejores soluciones para tu negocio o necesidades personales, con trato directo y sin intermediarios.'}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            {company.whatsapp && (
                                <a href={contactWhatsApp} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-lg transition flex items-center gap-2">
                                    Cotizar Ahora <span>→</span>
                                </a>
                            )}
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold transition flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                                    Visitar Sitio Web
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Bar at Bottom of Hero */}
                <div className="bg-[#050914] relative z-10 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-between items-center py-6 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl shrink-0">📍</div>
                                <div>
                                    <p className="text-white font-bold text-sm">Ubicación</p>
                                    <p className="text-slate-400 text-xs">{company.city || 'Bolivia'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl shrink-0">📦</div>
                                <div>
                                    <p className="text-white font-bold text-sm">Catálogo</p>
                                    <p className="text-slate-400 text-xs">Venta Directa</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl shrink-0">⏰</div>
                                <div>
                                    <p className="text-white font-bold text-sm">Atención</p>
                                    <p className="text-slate-400 text-xs">Lunes a Sábado</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl shrink-0">🎧</div>
                                <div>
                                    <p className="text-white font-bold text-sm">Soporte</p>
                                    <p className="text-slate-400 text-xs">Atención por WhatsApp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT LAYOUT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-10">
                
                {/* Left Column: Products & Services (Main Focus) */}
                <div className="lg:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-[2px] bg-orange-500"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">NUESTRO CATÁLOGO</span>
                    </div>
                    <h2 className="font-black text-3xl text-[#0b132b] mb-4 leading-tight">
                        Soluciones Completas para <br/>
                        <span className="text-orange-500">Tu Negocio o Proyecto</span>
                    </h2>
                    <p className="text-slate-500 mb-10 max-w-2xl text-sm leading-relaxed">
                        Explora nuestros productos y servicios destacados. Nos enorgullece ofrecer calidad y trato directo.
                    </p>

                    {company.products && company.products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {company.products.map(prod => (
                                <div key={prod.id} className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col group border border-slate-100">
                                    <div className="h-56 relative overflow-hidden bg-slate-100">
                                        <img 
                                            src={prod.main_image || fallbackImage} 
                                            alt={prod.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-sm text-orange-600 w-10 h-10 rounded-full flex items-center justify-center font-black">
                                            {prod.icon || '🛍️'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-[#0b132b] mb-3 group-hover:text-orange-500 transition-colors">
                                            {prod.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-5 flex-1 leading-relaxed">
                                            {prod.short_description || 'Sin descripción detallada.'}
                                        </p>
                                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                                            <div>
                                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Precio</span>
                                                <span className="font-black text-xl text-[#0b132b]">{prod.currency} {Number(prod.price).toFixed(2)}</span>
                                            </div>
                                            <a 
                                                href={getPromoWhatsAppUrl(company, prod)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-bold text-[#0b132b] group-hover:text-orange-500 flex items-center gap-1 transition-colors"
                                            >
                                                Consultar <span className="text-lg">→</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                            <div className="text-4xl mb-4 opacity-30">📦</div>
                            <h3 className="font-bold text-slate-800">Catálogo en preparación</h3>
                            <p className="text-slate-500 text-sm mt-1">La empresa está actualizando sus productos públicos.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar (About & Contact) */}
                <div className="lg:w-1/3 flex flex-col gap-8">
                    
                    {/* About Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-4 h-[2px] bg-orange-500"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">QUIÉNES SOMOS</span>
                            </div>
                            <h3 className="font-black text-xl text-[#0b132b] mb-4">Acerca de la Empresa</h3>
                            <div className="text-sm text-slate-600 leading-relaxed mb-6">
                                {company.description ? (
                                    <p>{company.description}</p>
                                ) : (
                                    <p>Empresa afiliada a LDR Comercial brindando productos y servicios de calidad para el mercado B2B y B2C.</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                <div>
                                    <p className="font-black text-2xl text-orange-500">100%</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trato Directo</p>
                                </div>
                                <div>
                                    <p className="font-black text-2xl text-[#0b132b] flex items-center gap-1">24/7</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disponibilidad</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card (Dark Blue style like Testimonial in reference) */}
                    <div className="bg-[#0b132b] rounded-xl shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <span className="w-4 h-[2px] bg-orange-500"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CONTACTO DIRECTO</span>
                        </div>
                        <h3 className="font-black text-2xl mb-6 relative z-10">Estamos a un mensaje de distancia</h3>
                        
                        <ul className="space-y-6 relative z-10">
                            {company.address && (
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-orange-400">📍</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ubicación Físca</p>
                                        <p className="text-sm font-medium mt-1">{company.address}</p>
                                        {company.city && <p className="text-xs text-slate-400">{company.city}</p>}
                                    </div>
                                </li>
                            )}
                            {company.phone && (
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-orange-400">📞</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teléfono</p>
                                        <p className="text-sm font-medium mt-1">{company.phone}</p>
                                    </div>
                                </li>
                            )}
                            {company.email && (
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-orange-400">✉️</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Correo</p>
                                        <p className="text-sm font-medium mt-1 break-all">{company.email}</p>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {(company.facebook || company.instagram || company.linkedin) && (
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10 flex gap-3">
                                {company.facebook && <a href={company.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition flex items-center justify-center text-sm font-bold">Fb</a>}
                                {company.instagram && <a href={company.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition flex items-center justify-center text-sm font-bold">Ig</a>}
                                {company.linkedin && <a href={company.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition flex items-center justify-center text-sm font-bold">In</a>}
                            </div>
                        )}
                    </div>
                    
                    {/* Industries/Categories CTA */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white text-center">
                        <h3 className="font-black text-xl mb-2">¿Buscas otro rubro?</h3>
                        <p className="text-orange-100 text-sm mb-6">Encuentra más empresas verificadas en nuestra plataforma.</p>
                        <Link href={route('companies.index')} className="inline-block px-6 py-2.5 bg-[#0b132b] text-white rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition">
                            Volver al Directorio
                        </Link>
                    </div>

                </div>
            </main>

            {/* --- FOOTER SIMPLIFICADO --- */}
            <footer className="bg-[#050914] text-slate-400 py-10 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="font-black text-2xl tracking-tighter text-white">
                            LDR<span className="text-orange-500">.</span>
                        </div>
                    </div>
                    <div className="text-xs text-center md:text-right text-slate-500">
                        <p className="font-bold text-slate-300 mb-1">{company.name} © {new Date().getFullYear()}</p>
                        <p>Perfil comercial verificado en LDR Comercial. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

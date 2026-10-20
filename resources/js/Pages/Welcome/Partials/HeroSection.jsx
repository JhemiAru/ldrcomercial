import { Link } from '@inertiajs/react';
import { fallbackImage, getPromoWhatsAppUrl, SmallProductRow } from './WelcomeUtils';

export default function HeroSection({ categories, featuredProducts, promotionalProducts }) {
    // Producto Estrella para el Banner Dinámico
    const heroProduct = featuredProducts.length > 0 
        ? featuredProducts[0] 
        : (promotionalProducts.length > 0 ? promotionalProducts[0] : null);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
            {/* LADO IZQUIERDO: SIDEBAR */}
            <aside className="hidden lg:block w-[260px] shrink-0">
                {/* CATEGORY MENU */}
                <div className="border border-gray-200 rounded-xl bg-white mb-8">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase">Categorías</h3>
                    </div>
                    <ul className="py-2">
                        {categories.slice(0, 8).map(cat => (
                            <li key={cat.id}>
                                <button className="w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:text-rose-500 hover:bg-rose-50/50 transition flex items-center justify-between">
                                    <span className="flex items-center gap-3">
                                        <span className="text-gray-400">{cat.icon || '👕'}</span>
                                        {cat.name}
                                    </span>
                                    <span className="text-gray-300 text-xs">+</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BEST SELLERS WIDGET */}
                <div className="border border-gray-200 rounded-xl bg-white mb-8">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase">Destacados</h3>
                    </div>
                    <div className="p-5 flex flex-col gap-5">
                        {featuredProducts.slice(0, 4).map(prod => (
                            <SmallProductRow key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            </aside>

            {/* LADO DERECHO: MAIN CONTENT */}
            <div className="flex-1 min-w-0">
                {/* HERO BANNER DINÁMICO */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-[380px] mb-8 flex items-center">
                    <img 
                        src={heroProduct ? heroProduct.main_image : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80"} 
                        alt={heroProduct ? heroProduct.name : "Banner Principal"} 
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
                    
                    <div className="relative z-10 px-8 md:px-14 max-w-xl">
                        {heroProduct ? (
                            <>
                                <h4 className="text-rose-400 font-bold text-xs md:text-sm mb-3 tracking-widest uppercase">
                                    {heroProduct.category?.name || 'Producto Destacado'}
                                </h4>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 line-clamp-2">
                                    {heroProduct.name}
                                </h2>
                                {heroProduct.short_description && (
                                    <p className="text-gray-300 text-sm md:text-base mb-5 line-clamp-2">
                                        {heroProduct.short_description}
                                    </p>
                                )}
                                <p className="text-gray-300 text-base mb-6 flex items-baseline gap-2">
                                    desde <span className="font-black text-white text-3xl">{heroProduct.currency} {heroProduct.price}</span>
                                </p>
                                <a 
                                    href={getPromoWhatsAppUrl(heroProduct.company, heroProduct)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-lg font-black uppercase tracking-wider text-xs transition shadow-lg shadow-rose-500/30"
                                >
                                    Contactar Empresa
                                </a>
                            </>
                        ) : (
                            <>
                                <h4 className="text-rose-400 font-bold text-xs md:text-sm mb-3 tracking-widest uppercase">
                                    LDR Comercial
                                </h4>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                                    EL HUB B2B Y B2C<br/>DE BOLIVIA
                                </h2>
                                <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2">
                                    Encuentra precios reales, promociones y contacta directamente con las empresas sin intermediarios.
                                </p>
                                <Link 
                                    href={route('register')} 
                                    className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-lg font-black uppercase tracking-wider text-xs transition shadow-lg shadow-rose-500/30"
                                >
                                    Publicar mi Empresa
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* CATEGORY PILLS */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.slice(0, 4).map(cat => (
                        <div key={cat.id} className="min-w-[180px] border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white hover:border-rose-200 hover:shadow-md transition cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg group-hover:bg-rose-50 transition">
                                    {cat.icon || '👕'}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-800 uppercase">{cat.name}</h4>
                                    <p className="text-[10px] text-rose-500 font-semibold mt-0.5">Ver Todo</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}


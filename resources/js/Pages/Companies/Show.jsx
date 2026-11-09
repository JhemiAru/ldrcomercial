import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';
import { fallbackImage } from '../Welcome/Partials/WelcomeUtils';

const VerifiedBadge = ({ size = 'sm' }) => {
    const dims = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    return (
        <svg className={`${dims} text-blue-500 shrink-0 inline-block`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
};

export default function Show({ company, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'has_discount'
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'price_asc' | 'price_desc' | 'name'
    const [copied, setCopied] = useState(false);

    // Interacciones Sociales B2B: Me Gusta, Seguir, Compartir y Mensaje
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(() => {
        return company.likes_count || (Math.abs((company.id * 17) % 65) + 38);
    });

    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(() => {
        return company.followers_count || (Math.abs((company.id * 29) % 95) + 54);
    });

    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedBannerKey, setSelectedBannerKey] = useState('1'); // '1' | '2' | '3' | 'logo' | 'card'
    const [sharingProduct, setSharingProduct] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [quickMessageText, setQuickMessageText] = useState(`Hola ${company.name}, te contacto a través de LDR Comercial Bolivia. Quisiera solicitar información y cotización sobre sus productos.`);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleToggleLike = () => {
        if (liked) {
            setLiked(false);
            setLikesCount(prev => Math.max(0, prev - 1));
            triggerToast(`Ya no te gusta ${company.name}`);
        } else {
            setLiked(true);
            setLikesCount(prev => prev + 1);
            triggerToast(`❤️ ¡Te gusta ${company.name}!`);
        }
    };

    const handleToggleFollow = () => {
        if (isFollowing) {
            setIsFollowing(false);
            setFollowersCount(prev => Math.max(0, prev - 1));
            triggerToast(`Dejaste de seguir a ${company.name}`);
        } else {
            setIsFollowing(true);
            setFollowersCount(prev => prev + 1);
            triggerToast(`🔔 ¡Ahora sigues a ${company.name}! Te avisaremos de novedades.`);
        }
    };

    const getShareUrl = (bannerKey = selectedBannerKey) => {
        if (typeof window === 'undefined') return `http://localhost:8000/empresas/${company.id}`;
        const base = `${window.location.origin}/empresas/${company.id}`;
        return bannerKey === '1' ? base : `${base}?banner=${bannerKey}`;
    };

    const handleCopyPageUrl = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(getShareUrl(selectedBannerKey));
            setCopied(true);
            triggerToast('🔗 ¡Enlace del flyer copiado al portapapeles!');
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const getProductShareUrl = (prod) => {
        if (!prod) return '';
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/productos/${prod.id}`;
        }
        return `http://localhost:8000/productos/${prod.id}`;
    };

    const handleCopyProductUrl = (prod) => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(getProductShareUrl(prod));
            setCopied(true);
            triggerToast(`🔗 ¡Enlace de "${prod.name}" copiado!`);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    // Diapositivas para el carrusel de 3 imágenes personalizadas
    const carouselSlides = [
        {
            image: company.banner || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1600&q=80',
            badge: 'INSTALACIONES & SHOWROOM',
            title: `Infraestructura & Stock de ${company.name}`,
            description: 'Capacidad de suministro continuo, exhibición y almacenamiento para despachos inmediatos en Bolivia.',
        },
        {
            image: company.banner_2 || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80',
            badge: 'LÍNEAS DE PRODUCTOS',
            title: 'Suministros Técnicos & Comerciales de Confianza',
            description: 'Gama de productos con garantía de fábrica y asesoría técnica personalizada para tu empresa.',
        },
        {
            image: company.banner_3 || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
            badge: 'COBERTURA & ATENCIÓN',
            title: 'Envíos Nacionales & Trato Directo',
            description: 'Cotizaciones ágiles sin intermediarios con facturación legal en los 9 departamentos.',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);

    useEffect(() => {
        if (isCarouselHovered) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isCarouselHovered, carouselSlides.length]);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const cleanPhone = (company.whatsapp || company.phone || '').replace(/[^0-9]/g, '');
    const contactWhatsApp = cleanPhone
        ? `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(`Hola ${company.name}, te contacto desde LDR Comercial Bolivia para solicitar cotización y catálogo.`)}`
        : null;

    const getProductQuoteWhatsAppUrl = (prod) => {
        if (!cleanPhone) return '#';
        const msg = `Hola ${company.name}, vi su producto "${prod.name}" en LDR Comercial y deseo solicitar cotización técnica y disponibilidad.`;
        return `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(msg)}`;
    };

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address || ''} ${company.city || ''} Bolivia`)}`;

    const handleShare = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const formatSocialUrl = (url, platform) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (platform === 'facebook') return `https://facebook.com/${url.replace('@', '')}`;
        if (platform === 'instagram') return `https://instagram.com/${url.replace('@', '')}`;
        if (platform === 'tiktok') return `https://tiktok.com/@${url.replace('@', '')}`;
        if (platform === 'linkedin') return `https://linkedin.com/in/${url.replace('@', '')}`;
        return `https://${url}`;
    };

    const fbUrl = formatSocialUrl(company.facebook, 'facebook');
    const igUrl = formatSocialUrl(company.instagram, 'instagram');
    const ttUrl = formatSocialUrl(company.tiktok, 'tiktok');
    const inUrl = formatSocialUrl(company.linkedin, 'linkedin');
    const webUrl = company.website ? (company.website.startsWith('http') ? company.website : `https://${company.website}`) : null;

    const hasDigitalChannels = !!(webUrl || contactWhatsApp || fbUrl || igUrl || ttUrl || inUrl);

    // Productos de la empresa y categorías internas
    const products = company.products || [];

    const companyCategories = React.useMemo(() => {
        const catsMap = new Map();
        products.forEach((p) => {
            if (p.category) {
                catsMap.set(String(p.category.id), p.category.name);
            }
        });
        return Array.from(catsMap.entries()).map(([id, name]) => ({ id, name }));
    }, [products]);

    // Filtrado y ordenamiento dinámico
    const filteredProducts = React.useMemo(() => {
        let list = [...products];

        // Filtro por texto
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            list = list.filter((p) => {
                const matchName = (p.name || '').toLowerCase().includes(term);
                const matchDesc = (p.short_description || '').toLowerCase().includes(term);
                const matchSku = (p.sku || '').toLowerCase().includes(term);
                const matchCat = (p.category?.name || '').toLowerCase().includes(term);
                return matchName || matchDesc || matchSku || matchCat;
            });
        }

        // Filtro por categoría de producto
        if (selectedCategory !== 'all') {
            list = list.filter((p) => String(p.category_id) === String(selectedCategory) || String(p.category?.id) === String(selectedCategory));
        }

        // Filtro por stock o descuento
        if (stockFilter === 'in_stock') {
            list = list.filter((p) => p.in_stock !== false);
        } else if (stockFilter === 'has_discount') {
            list = list.filter((p) => p.original_price && Number(p.original_price) > Number(p.price));
        }

        // Ordenamiento
        if (sortBy === 'price_asc') {
            list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (sortBy === 'price_desc') {
            list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        } else if (sortBy === 'name') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return list;
    }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

    const events = company.events || [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            <Head>
                <title>{`${company.name} - Proveedor Verificado B2B | LDR Comercial`}</title>
                <meta property="og:title" content={`${company.name} - Catálogo Oficial en LDR Comercial`} />
                <meta property="og:description" content={company.short_description || company.description?.slice(0, 150) || `Explora el catálogo de productos y contacto directo de ${company.name} en Bolivia.`} />
                <meta property="og:image" content={route('companies.og-image', company.id)} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${company.name} - Catálogo Oficial en LDR Comercial`} />
                <meta name="twitter:description" content={company.short_description || company.description?.slice(0, 150) || `Explora el catálogo de productos y contacto directo de ${company.name} en Bolivia.`} />
                <meta name="twitter:image" content={route('companies.og-image', company.id)} />
            </Head>
            <Header 
                categories={categories}
                companyScope={company}
                onCompanySearch={(val) => setSearchTerm(val)}
                companySearchTerm={searchTerm}
            />

            {/* ═══════════════════════════════════════════════
                HERO SECTION (BANNER & CABECERA DE LA EMPRESA)
               ═══════════════════════════════════════════════ */}
            <div className="relative bg-[#0b132b] text-white pt-16 sm:pt-20 pb-0 overflow-hidden">
                
                {/* Imagen de Fondo con Overlay Gradiente */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={company.banner || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80'} 
                        alt={company.name} 
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b] via-[#0b132b]/95 to-slate-900/60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl pb-12 sm:pb-16">
                        
                        {/* Categoría & Badges */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-6">
                            <span className="w-8 h-[2px] bg-blue-500"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                                {company.category?.name || 'ECOSISTEMA EMPRESARIAL B2B'}
                            </span>
                            {company.is_verified && (
                                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-xs">
                                    <VerifiedBadge size="sm" />
                                    <span>Verificada Presencialmente</span>
                                </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                                📍 {company.city || 'Bolivia'}
                            </span>
                        </div>
                        
                        {/* Nombre de la Empresa y Logo */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                            <div className="w-24 h-24 shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-1.5 shadow-2xl overflow-hidden border-2 border-white/20">
                                {company.logo ? (
                                    <img 
                                        src={company.logo} 
                                        alt={company.name} 
                                        className="w-full h-full object-cover rounded-2xl"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white">
                                        {company.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight flex items-center gap-3">
                                    <span>{company.name}</span>
                                </h1>
                                {company.legal_name && company.legal_name !== company.name && (
                                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                                        {company.legal_name} {company.tax_id ? `• NIT: ${company.tax_id}` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Descripción breve */}
                        <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                            {company.short_description || 'Proveedor comercial verificado. Catálogo de productos y soluciones industriales, técnicas y comerciales con trato directo y sin intermediarios.'}
                        </p>
                    </div>
                </div>

                {/* Cinta Inferior de Garantía B2B & Suite de Interacción */}
                <div className="bg-[#050914] relative z-10 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                            
                            {/* Insignias de Confianza B2B */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg shrink-0">📍</div>
                                    <div>
                                        <p className="text-white font-bold text-xs">Sede / Ciudad</p>
                                        <p className="text-slate-400 text-[11px] truncate">{company.city || 'Bolivia'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg shrink-0">🛡️</div>
                                    <div>
                                        <p className="text-white font-bold text-xs">Seguridad B2B</p>
                                        <p className="text-slate-400 text-[11px]">100% Verificada</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg shrink-0">📦</div>
                                    <div>
                                        <p className="text-white font-bold text-xs">Catálogo Oficial</p>
                                        <p className="text-slate-400 text-[11px]">{products.length} productos publicados</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg shrink-0">🤝</div>
                                    <div>
                                        <p className="text-white font-bold text-xs">Trato Comercial</p>
                                        <p className="text-slate-400 text-[11px]">Directo con la empresa</p>
                                    </div>
                                </div>
                            </div>

                            {/* Separador vertical en desktop */}
                            <div className="hidden xl:block h-10 w-[1px] bg-white/10"></div>

                            {/* Suite de Botones de Interacción Social & B2B */}
                            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full xl:w-auto pt-3 xl:pt-0 border-t xl:border-t-0 border-white/10">
                                
                                {/* 1. Botón Me Gusta */}
                                <button
                                    type="button"
                                    onClick={handleToggleLike}
                                    className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer select-none ${
                                        liked
                                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 hover:bg-rose-500/25 shadow-xs shadow-rose-500/10'
                                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
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
                                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${liked ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-slate-300'}`}>
                                        {likesCount}
                                    </span>
                                </button>

                                {/* 2. Botón Seguir */}
                                <button
                                    type="button"
                                    onClick={handleToggleFollow}
                                    className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer select-none ${
                                        isFollowing
                                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 hover:bg-blue-500/30 shadow-xs shadow-blue-500/10'
                                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                                    }`}
                                    title="Seguir novedades de la empresa"
                                >
                                    {isFollowing ? (
                                        <>
                                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Siguiendo</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Seguir</span>
                                        </>
                                    )}
                                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${isFollowing ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-slate-300'}`}>
                                        {followersCount}
                                    </span>
                                </button>

                                {/* 3. Botón Compartir */}
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(true)}
                                    className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
                                    title="Compartir perfil de la empresa"
                                >
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    <span>Compartir</span>
                                </button>

                                {/* 4. Botón Mandar Mensaje */}
                                <button
                                    type="button"
                                    onClick={() => setShowMessageModal(true)}
                                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
                                    title="Mandar mensaje a la empresa"
                                >
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                                    </svg>
                                    <span>Mandar Mensaje</span>
                                </button>

                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* ═══════════════════════════════════════════════
                CONTENIDO PRINCIPAL (2 COLUMNAS)
               ═══════════════════════════════════════════════ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col lg:flex-row gap-10">
                
                {/* ───────────────────────────────────────────────
                    COLUMNA IZQUIERDA: CARRUSEL & CATÁLOGO (2/3)
                   ─────────────────────────────────────────────── */}
                <div className="lg:w-2/3 space-y-10" id="catalogo">
                    
                    {/* ═══════════════════════════════════════════════
                        CARRUSEL PERSONALIZADO DE 3 IMÁGENES
                       ═══════════════════════════════════════════════ */}
                    <div 
                        className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 bg-slate-900 group"
                        onMouseEnter={() => setIsCarouselHovered(true)}
                        onMouseLeave={() => setIsCarouselHovered(false)}
                    >
                        {/* Contenedor de Altura del Carrusel */}
                        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
                            {carouselSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-7000 ease-out"
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    />
                                    
                                    {/* Botón flotante para compartir este flyer específico en WhatsApp */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBannerKey(String(idx + 1));
                                            setShowShareModal(true);
                                        }}
                                        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/75 hover:bg-emerald-600 text-white backdrop-blur-md text-[11px] font-bold border border-white/20 shadow-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                        title="Compartir este flyer en WhatsApp"
                                    >
                                        <span>📲 Compartir Flyer</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Flechas de Navegación del Carrusel */}
                        <button
                            type="button"
                            onClick={handlePrevSlide}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-xs flex items-center justify-center transition z-20 opacity-0 group-hover:opacity-100 shadow-md font-bold text-sm"
                            title="Imagen anterior"
                        >
                            ❮
                        </button>

                        <button
                            type="button"
                            onClick={handleNextSlide}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-xs flex items-center justify-center transition z-20 opacity-0 group-hover:opacity-100 shadow-md font-bold text-sm"
                            title="Siguiente imagen"
                        >
                            ❯
                        </button>

                        {/* Indicadores / Puntos Inferiores */}
                        <div className="absolute bottom-5 right-6 sm:right-8 flex items-center gap-2 z-20">
                            {carouselSlides.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => setCurrentSlide(dotIdx)}
                                    className={`transition-all duration-300 rounded-full ${
                                        dotIdx === currentSlide
                                            ? 'w-7 h-2.5 bg-blue-500 shadow-md'
                                            : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                                    }`}
                                    title={`Ir a imagen ${dotIdx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Encabezado del Catálogo & Barra de Herramientas B2B */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="w-6 h-[2px] bg-blue-600"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                                CATÁLOGO COMERCIAL
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <span>Catálogo de Productos</span>
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {products.length} {products.length === 1 ? 'ítem' : 'ítems'}
                                    </span>
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Consulta precios referenciales y cotiza directamente por WhatsApp sin intermediarios
                                </p>
                            </div>

                            {/* Selector de Modo de Visualización: Cuadrícula Compacta vs Lista Rápida */}
                            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-white text-blue-600 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Vista Cuadrícula Compacta (más productos por pantalla)"
                                >
                                    <span>▦</span>
                                    <span className="hidden sm:inline">Cuadrícula</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                        viewMode === 'list'
                                            ? 'bg-white text-blue-600 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Vista Lista B2B (alta densidad para pedidos rápidos)"
                                >
                                    <span>☰</span>
                                    <span className="hidden sm:inline">Lista</span>
                                </button>
                            </div>
                        </div>

                        {/* Barra de Filtros, Búsqueda y Ordenamiento */}
                        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                
                                {/* Buscador Interno Rápido */}
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder={`Buscar producto por nombre, SKU o descripción en ${company.name}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full text-xs pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    />
                                    <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 p-0.5"
                                            title="Limpiar búsqueda"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Filtro de Stock y Ordenador */}
                                <div className="flex items-center gap-2 flex-wrap shrink-0">
                                    {/* Filtro por Stock / Descuento */}
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="in_stock">Solo En Stock</option>
                                        <option value="has_discount">En Oferta / Descuento</option>
                                    </select>

                                    {/* Ordenar Por */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="latest">Más recientes</option>
                                        <option value="price_asc">Precio: Menor a Mayor</option>
                                        <option value="price_desc">Precio: Mayor a Menor</option>
                                        <option value="name">Nombre: A - Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Categorías internas de la empresa (Pills) */}
                            {companyCategories.length > 1 && (
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                                        Líneas:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                                            selectedCategory === 'all'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Todas ({products.length})
                                    </button>
                                    {companyCategories.map((cat) => {
                                        const count = products.filter((p) => String(p.category_id) === String(cat.id) || String(p.category?.id) === String(cat.id)).length;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(String(cat.id))}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                                                    selectedCategory === String(cat.id)
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {cat.name} ({count})
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Resumen de Resultados y Botón de Limpieza */}
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                <span>
                                    Mostrando <strong>{filteredProducts.length}</strong> de {products.length} productos
                                    {searchTerm && <span> para "{searchTerm}"</span>}
                                </span>

                                {(searchTerm || selectedCategory !== 'all' || stockFilter !== 'all' || sortBy !== 'latest') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('all');
                                            setStockFilter('all');
                                            setSortBy('latest');
                                        }}
                                        className="text-blue-600 hover:underline font-bold"
                                    >
                                        Limpiar todos los filtros ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* LISTADO DE PRODUCTOS: MODO CUADRÍCULA COMPACTA */}
                        {filteredProducts.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                                    {filteredProducts.map((prod) => {
                                        const hasDiscount = prod.original_price && Number(prod.original_price) > Number(prod.price);
                                        const discountPercent = hasDiscount
                                            ? Math.round(((Number(prod.original_price) - Number(prod.price)) / Number(prod.original_price)) * 100)
                                            : 0;

                                        return (
                                            <div 
                                                key={prod.id} 
                                                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-400/50 transition-all duration-300 overflow-hidden flex flex-col group"
                                            >
                                                {/* Imagen Compacta del Producto */}
                                                <a 
                                                    href={route('products.show', prod.id)}
                                                    className="h-36 sm:h-40 relative overflow-hidden bg-slate-100 block cursor-pointer"
                                                >
                                                    <img 
                                                        src={prod.main_image || fallbackImage} 
                                                        alt={prod.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                                    />
                                                    
                                                    {/* Badge de Categoría / Unidad */}
                                                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                                                        <span>{prod.unit || 'Pza'}</span>
                                                    </div>

                                                    {/* Badge de Descuento si aplica */}
                                                    {hasDiscount && (
                                                        <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                                                            -{discountPercent}%
                                                        </div>
                                                    )}

                                                    {/* Badge de Stock en miniatura */}
                                                    <div className="absolute bottom-2 right-2">
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs shadow-xs ${
                                                            prod.in_stock !== false 
                                                                ? 'bg-emerald-500/90 text-white' 
                                                                : 'bg-amber-500/90 text-white'
                                                        }`}>
                                                            {prod.in_stock !== false ? '● Stock' : '● Pedido'}
                                                        </span>
                                                    </div>
                                                </a>

                                                {/* Información Compacta */}
                                                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
                                                    <div>
                                                        {prod.sku && (
                                                            <span className="font-mono text-[9px] text-slate-400 font-semibold block mb-0.5">
                                                                SKU: {prod.sku}
                                                            </span>
                                                        )}
                                                        <a 
                                                            href={route('products.show', prod.id)}
                                                            className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug min-h-[2.2rem] block"
                                                            title={prod.name}
                                                        >
                                                            {prod.name}
                                                        </a>
                                                    </div>

                                                    {/* Precios y Botones */}
                                                    <div className="border-t border-slate-100 pt-2.5 mt-2.5">
                                                        <div className="mb-2">
                                                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                                                <span className="font-black text-sm sm:text-base text-slate-900 font-mono">
                                                                    {prod.currency || 'Bs.'} {Number(prod.price).toFixed(2)}
                                                                </span>
                                                                {hasDiscount && (
                                                                    <span className="text-[11px] text-slate-400 line-through">
                                                                        {prod.currency || 'Bs.'} {Number(prod.original_price).toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {prod.wholesale_price && (
                                                                <span className="text-[10px] font-bold text-blue-600 block mt-0.5">
                                                                    Mayor: {prod.currency || 'Bs.'} {Number(prod.wholesale_price).toFixed(2)}
                                                                    {prod.min_wholesale_qty ? ` (min ${prod.min_wholesale_qty})` : ''}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Doble Botón Compacto */}
                                                        <div className="flex items-center gap-1.5">
                                                            <a
                                                                href={getProductQuoteWhatsAppUrl(prod)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1"
                                                                title="Cotizar este producto por WhatsApp"
                                                            >
                                                                <span>💬</span>
                                                                <span>Cotizar</span>
                                                            </a>

                                                            <button
                                                                type="button"
                                                                onClick={() => setSharingProduct(prod)}
                                                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 hover:border-blue-200 text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
                                                                title="Compartir este producto en WhatsApp y redes"
                                                                aria-label={`Compartir ${prod.name}`}
                                                            >
                                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="18" cy="5" r="3"></circle>
                                                                    <circle cx="6" cy="12" r="3"></circle>
                                                                    <circle cx="18" cy="19" r="3"></circle>
                                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* LISTADO DE PRODUCTOS: MODO LISTA RÁPIDA B2B */
                                <div className="space-y-2.5">
                                    {filteredProducts.map((prod) => {
                                        const hasDiscount = prod.original_price && Number(prod.original_price) > Number(prod.price);

                                        return (
                                            <div 
                                                key={prod.id}
                                                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs hover:shadow-md transition"
                                            >
                                                {/* Miniatura y Título */}
                                                <div className="flex items-center gap-3 w-full sm:w-auto min-w-0 flex-1">
                                                    <a 
                                                        href={route('products.show', prod.id)}
                                                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70"
                                                    >
                                                        <img 
                                                            src={prod.main_image || fallbackImage} 
                                                            alt={prod.name} 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                                        />
                                                    </a>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {prod.sku && (
                                                                <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                                                    SKU: {prod.sku}
                                                                </span>
                                                            )}
                                                            {prod.category && (
                                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                                    {prod.category.name}
                                                                </span>
                                                            )}
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                                                prod.in_stock !== false 
                                                                    ? 'bg-emerald-50 text-emerald-700' 
                                                                    : 'bg-amber-50 text-amber-700'
                                                            }`}>
                                                                {prod.in_stock !== false ? 'En Stock' : 'Bajo Pedido'}
                                                            </span>
                                                        </div>

                                                        <a 
                                                            href={route('products.show', prod.id)}
                                                            className="font-bold text-sm text-slate-900 hover:text-blue-600 truncate block mt-0.5"
                                                            title={prod.name}
                                                        >
                                                            {prod.name}
                                                        </a>

                                                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                            {prod.short_description || 'Haz clic para consultar especificaciones técnicas y disponibilidad.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Precios y Botones */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                                                    <div className="text-left sm:text-right">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="font-black text-base text-slate-900 font-mono">
                                                                {prod.currency || 'Bs.'} {Number(prod.price).toFixed(2)}
                                                            </span>
                                                            {hasDiscount && (
                                                                <span className="text-[11px] text-slate-400 line-through">
                                                                    {prod.currency || 'Bs.'} {Number(prod.original_price).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {prod.wholesale_price && (
                                                            <div className="text-[10px] font-bold text-blue-600">
                                                                Mayor: {prod.currency || 'Bs.'} {Number(prod.wholesale_price).toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSharingProduct(prod)}
                                                            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 hover:border-blue-200 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                                                            title="Compartir este producto en WhatsApp y redes"
                                                            aria-label={`Compartir ${prod.name}`}
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="18" cy="5" r="3"></circle>
                                                                <circle cx="6" cy="12" r="3"></circle>
                                                                <circle cx="18" cy="19" r="3"></circle>
                                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                            </svg>
                                                        </button>

                                                        <a
                                                            href={getProductQuoteWhatsAppUrl(prod)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                                                            title="Cotizar por WhatsApp"
                                                        >
                                                            <span>💬</span>
                                                            <span>Cotizar</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            /* ESTADO VACÍO / NO COINCIDENCIAS CON ACCIÓN DE BÚSQUEDA GLOBAL */
                            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-200 shadow-xs">
                                <span className="text-4xl block mb-2">🔍</span>
                                <h3 className="font-bold text-base text-slate-900">
                                    {searchTerm 
                                        ? `No se encontraron productos coincidentes en ${company.name}` 
                                        : 'Catálogo en preparación'}
                                </h3>
                                <p className="text-slate-500 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                                    {searchTerm 
                                        ? `No hay productos en esta empresa que coincidan con "${searchTerm}". Puedes limpiar los filtros o buscar en todo el portal comercial.`
                                        : 'Esta empresa está actualizando su lista de productos en plataforma.'}
                                </p>

                                {searchTerm && (
                                    <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('all');
                                                setStockFilter('all');
                                            }}
                                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                                        >
                                            ✕ Limpiar búsqueda en {company.name}
                                        </button>

                                        <Link
                                            href={route('companies.index', { search: searchTerm })}
                                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                                        >
                                            <span>🌐 Buscar "{searchTerm}" en todo LDR Comercial →</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ───────────────────────────────────────────────
                        SECCIÓN: FERIAS & EVENTOS DE LA EMPRESA
                       ─────────────────────────────────────────────── */}
                    {events.length > 0 && (
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

                {/* ───────────────────────────────────────────────
                    COLUMNA DERECHA: SIDEBAR DE CANALES Y CONEXIÓN (1/3)
                   ─────────────────────────────────────────────── */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    
                    {/* ═══════════════════════════════════════════════
                        TARJETA: CANALES OFICIALES & REDES SOCIALES
                       ═══════════════════════════════════════════════ */}
                    {hasDigitalChannels && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-4 h-[2px] bg-blue-600"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                        CANALES DIGITALES
                                    </span>
                                </div>
                                <h3 className="font-black text-base text-slate-900">
                                    Redes & Plataformas Oficiales
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Conéctate directamente con la empresa a través de sus canales verificados:
                                </p>
                            </div>

                            <div className="space-y-2.5 pt-1">
                                
                                {/* 1. Sitio Web Oficial */}
                                {webUrl && (
                                    <a
                                        href={webUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 text-slate-800 hover:text-blue-700 transition flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 text-lg">
                                                🌐
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                                    Sitio Web Corporativo
                                                </span>
                                                <span className="text-xs font-bold truncate block group-hover:underline">
                                                    {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-blue-600 text-xs font-bold shrink-0">
                                            Visitar ↗
                                        </span>
                                    </a>
                                )}

                                {/* 2. WhatsApp Comercial */}
                                {contactWhatsApp && (
                                    <a
                                        href={contactWhatsApp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 hover:border-emerald-400 text-emerald-900 transition flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                                                    WhatsApp Oficial
                                                </span>
                                                <span className="text-xs font-bold text-emerald-950 truncate block">
                                                    +591 {cleanPhone}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform text-xs font-bold shrink-0">
                                            Chatear ↗
                                        </span>
                                    </a>
                                )}

                                {/* Redes Sociales Oficiales */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {/* Facebook */}
                                    {fbUrl && (
                                        <a
                                            href={fbUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 text-blue-800 transition flex items-center gap-2"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold truncate">Facebook</span>
                                        </a>
                                    )}

                                    {/* Instagram */}
                                    {igUrl && (
                                        <a
                                            href={igUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-pink-50/70 hover:bg-pink-100 border border-pink-200/80 text-pink-900 transition flex items-center gap-2"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold truncate">Instagram</span>
                                        </a>
                                    )}

                                    {/* TikTok */}
                                    {ttUrl && (
                                        <a
                                            href={ttUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white transition flex items-center gap-2"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold truncate">TikTok</span>
                                        </a>
                                    )}

                                    {/* LinkedIn */}
                                    {inUrl && (
                                        <a
                                            href={inUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 text-sky-900 transition flex items-center gap-2"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold truncate">LinkedIn</span>
                                        </a>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════
                        TARJETA DE VERIFICACIÓN PRESENCIAL LDR COMERCIAL
                       ═══════════════════════════════════════════════ */}
                    {company.is_verified && (
                        <div className="bg-gradient-to-br from-blue-900 to-[#0b132b] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-8 -mt-8"></div>
                            
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-lg shrink-0 border border-blue-400/30">
                                        🛡️
                                    </span>
                                    <div>
                                        <h4 className="font-black text-sm text-white">
                                            Proveedor Verificado B2B
                                        </h4>
                                        <p className="text-[10px] text-blue-300">Auditoría Presencial LDR</p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Esta empresa ha sido verificada presencialmente por el equipo comercial de LDR Comercial Bolivia:
                                </p>

                                <ul className="space-y-1.5 text-xs text-slate-200 pt-1">
                                    <li className="flex items-center gap-2">
                                        <span className="text-blue-400 font-bold">✓</span>
                                        <span>Local comercial inspeccionado</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-blue-400 font-bold">✓</span>
                                        <span>NIT e identidad legal validados</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-blue-400 font-bold">✓</span>
                                        <span>Trato directo sin comisiones ocultas</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════
                        TARJETA DE CONTACTO & UBICACIÓN FÍSICA
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 space-y-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-4 h-[2px] bg-slate-400"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    DATOS DE CONTACTO
                                </span>
                            </div>
                            <h3 className="font-black text-base text-slate-900">
                                Atención & Ubicación
                            </h3>
                        </div>

                        <ul className="space-y-4 text-xs">
                            {company.address && (
                                <li className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 text-base">
                                        📍
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Dirección Física</p>
                                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{company.address}</p>
                                        <p className="text-[11px] text-slate-400">{company.city || 'Bolivia'}</p>
                                        
                                        {/* Botón Google Maps */}
                                        <a
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition"
                                        >
                                            <span>🗺️</span>
                                            <span>Ver en Google Maps ↗</span>
                                        </a>
                                    </div>
                                </li>
                            )}

                            {company.phone && (
                                <li className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 text-base">
                                        📞
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teléfono Central</p>
                                        <a 
                                            href={`tel:${company.phone}`} 
                                            className="text-xs font-bold text-slate-800 hover:text-blue-600 transition block mt-0.5"
                                        >
                                            {company.phone}
                                        </a>
                                    </div>
                                </li>
                            )}

                            {company.email && (
                                <li className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 text-base">
                                        ✉️
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Correo Electrónico</p>
                                        <a 
                                            href={`mailto:${company.email}`} 
                                            className="text-xs font-bold text-slate-800 hover:text-blue-600 transition block mt-0.5 truncate"
                                        >
                                            {company.email}
                                        </a>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        TARJETA: VOLVER AL DIRECTORIO B2B
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-slate-100 rounded-3xl p-6 text-center border border-slate-200/80 space-y-3">
                        <span className="text-3xl block">🏢</span>
                        <h4 className="font-black text-sm text-slate-900">
                            ¿Buscas más empresas o proveedores?
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Explora todo nuestro ecosistema de empresas y fabricantes verificados en Bolivia.
                        </p>
                        <Link 
                            href={route('companies.index')}
                            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                            Ver Directorio B2B Completo →
                        </Link>
                    </div>

                </div>

            </main>

            {/* ═══════════════════════════════════════════════
                FOOTER CORPORATIVO
               ═══════════════════════════════════════════════ */}
            <footer className="bg-[#050914] text-slate-400 py-10 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="font-black text-2xl tracking-tighter text-white">
                            LDR<span className="text-blue-500">.</span>
                        </div>
                        <span className="text-xs text-slate-500">Comercial Bolivia</span>
                    </div>
                    <div className="text-xs text-center md:text-right text-slate-500">
                        <p className="font-bold text-slate-300 mb-1">{company.name} © {new Date().getFullYear()}</p>
                        <p>Perfil comercial verificado por LDR Comercial. Catálogo B2B directo.</p>
                    </div>
                </div>
            </footer>

            {/* ═══════════════════════════════════════════════
                MODAL: COMPARTIR EMPRESA
               ═══════════════════════════════════════════════ */}
            {showShareModal && (
                <div 
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setShowShareModal(false)}
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
                                onClick={() => setShowShareModal(false)}
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
                                    href={route('companies.og-image', { id: company.id, banner: selectedBannerKey })} 
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
                                    src={route('companies.og-image', { id: company.id, banner: selectedBannerKey })} 
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
                                    onClick={handleCopyPageUrl}
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
            )}

            {/* ═══════════════════════════════════════════════
                MODAL: COMPARTIR PRODUCTO CON FOTO Y ENLACE DIRECTO
               ═══════════════════════════════════════════════ */}
            {sharingProduct && (
                <div 
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setSharingProduct(null)}
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
                                onClick={() => setSharingProduct(null)}
                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
                                aria-label="Cerrar modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Previsualización del Producto (Foto + Datos que cargará WhatsApp) */}
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
                            <div className="w-16 h-16 rounded-xl bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                                {sharingProduct.main_image ? (
                                    <img 
                                        src={sharingProduct.main_image} 
                                        alt={sharingProduct.name} 
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl">📦</span>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                                    {sharingProduct.name}
                                </h4>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="font-mono font-black text-sm text-emerald-400">
                                        {sharingProduct.currency || 'Bs.'} {Number(sharingProduct.price).toFixed(2)}
                                    </span>
                                    {sharingProduct.wholesale_price && (
                                        <span className="text-[10px] text-blue-400 font-bold">
                                            Mayor: {sharingProduct.currency || 'Bs.'} {Number(sharingProduct.wholesale_price).toFixed(2)}
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
                                    value={getProductShareUrl(sharingProduct)} 
                                    className="bg-transparent border-none text-xs text-slate-300 w-full px-2 focus:outline-hidden truncate font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleCopyProductUrl(sharingProduct)}
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
                                        `📦 *${sharingProduct.name}*\n` +
                                        `💰 *Precio:* ${sharingProduct.currency || 'Bs.'} ${Number(sharingProduct.price).toFixed(2)}\n\n` +
                                        `👉 Ver foto y detalles completos aquí:\n${getProductShareUrl(sharingProduct)}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                                >
                                    <span>WhatsApp ↗</span>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl(sharingProduct))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition"
                                >
                                    <span>Facebook ↗</span>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getProductShareUrl(sharingProduct))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-bold transition"
                                >
                                    <span>LinkedIn ↗</span>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira ${sharingProduct.name} de ${company.name} en LDR Comercial Bolivia:`)}&url=${encodeURIComponent(getProductShareUrl(sharingProduct))}`}
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
                                href={route('products.show', sharingProduct.id)}
                                className="text-xs text-blue-400 hover:text-blue-300 font-bold hover:underline"
                            >
                                Abrir ficha técnica completa de este producto &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                MODAL: MANDAR MENSAJE A LA EMPRESA
               ═══════════════════════════════════════════════ */}
            {showMessageModal && (
                <div 
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setShowMessageModal(false)}
                >
                    <div 
                        className="bg-[#0b132b] border border-white/20 text-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white p-1 shrink-0 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl rounded-xl">
                                            {company.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base text-white truncate">{company.name}</h3>
                                    <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Canal Comercial Verificado LDR
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowMessageModal(false)}
                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Campo de redacción rápida del mensaje */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                <span>Mensaje o Consulta Comercial</span>
                                <span className="text-[10px] text-slate-400 normal-case font-normal">Personaliza tu texto</span>
                            </label>
                            <textarea
                                rows="3"
                                value={quickMessageText}
                                onChange={(e) => setQuickMessageText(e.target.value)}
                                className="w-full rounded-2xl bg-[#050914] border border-white/15 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 resize-none"
                                placeholder="Escribe tu consulta aquí..."
                            />
                        </div>

                        {/* Opciones directas de contacto */}
                        <div className="space-y-2.5 pt-1">
                            {cleanPhone && (
                                <a
                                    href={`https://wa.me/591${cleanPhone}?text=${encodeURIComponent(quickMessageText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition text-xs sm:text-sm group"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                    </svg>
                                    <span>Enviar directamente por WhatsApp</span>
                                </a>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {company.email && (
                                    <a
                                        href={`mailto:${company.email}?subject=${encodeURIComponent(`Consulta Comercial para ${company.name} - LDR Comercial`)}&body=${encodeURIComponent(quickMessageText)}`}
                                        className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition"
                                    >
                                        <span>✉️ Por Correo</span>
                                    </a>
                                )}
                                {company.phone && (
                                    <a
                                        href={`tel:${company.phone}`}
                                        className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition"
                                    >
                                        <span>📞 Llamar</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                NOTIFICACIÓN TOAST FLOTANTE
               ═══════════════════════════════════════════════ */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#0b132b]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3">
                    <span className="text-base">✨</span>
                    <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

        </div>
    );
}

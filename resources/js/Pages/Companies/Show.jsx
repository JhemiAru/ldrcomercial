import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';
import CompanyHeroBanner from './Partials/CompanyHeroBanner';
import CompanyProfileCard from './Partials/CompanyProfileCard';
import CompanyCatalog from './Partials/CompanyCatalog';
import CompanyEvents from './Partials/CompanyEvents';
import CompanySidebar from './Partials/CompanySidebar';
import ShareCompanyModal from './Partials/ShareCompanyModal';
import ShareProductModal from './Partials/ShareProductModal';
import QuickMessageModal from './Partials/QuickMessageModal';
import CompanyChatbot from './Partials/CompanyChatbot';

export default function Show({ company, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'has_discount'
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'price_asc' | 'price_desc' | 'name'
    const [copied, setCopied] = useState(false);

    // Interacciones Sociales B2B
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(() => {
        return company.likes_count || (Math.abs((company.id * 17) % 65) + 38);
    });

    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(() => {
        return company.followers_count || (Math.abs((company.id * 29) % 95) + 54);
    });

    // Modales
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
        const identifier = company.slug || company.id;
        if (typeof window === 'undefined') return `http://localhost:8000/empresas/${identifier}`;
        const base = `${window.location.origin}/empresas/${identifier}`;
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

    const cleanPhone = (company.whatsapp || company.phone || '').replace(/[^0-9]/g, '');
    const contactWhatsApp = cleanPhone
        ? `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(`Hola ${company.name}, te contacto desde LDR Comercial Bolivia para solicitar cotización y catálogo.`)}`
        : null;

    const getProductQuoteWhatsAppUrl = (prod) => {
        if (!cleanPhone) return '#';
        const msg = `Hola ${company.name}, vi su producto "${prod.name}" en LDR Comercial y deseo solicitar cotización técnica y disponibilidad.`;
        return `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(msg)}`;
    };

    const googleMapsUrl = company.google_maps_link
        ? (company.google_maps_link.startsWith('http') ? company.google_maps_link : `https://${company.google_maps_link}`)
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address || ''} ${company.city || ''} Bolivia`)}`;

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

    // Productos y filtros
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
                const matchBrand = (p.brand?.name || '').toLowerCase().includes(term);
                const matchTags = (p.tags || '').toLowerCase().includes(term);
                return matchName || matchDesc || matchSku || matchCat || matchBrand || matchTags;
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

            {/* 1. HERO STOREFRONT: BANNER DE PORTADA & LIGHTBOX */}
            <CompanyHeroBanner company={company} />

            {/* 2. TARJETA DE PERFIL DEL NEGOCIO */}
            <CompanyProfileCard 
                company={company}
                productsCount={products.length}
                liked={liked}
                likesCount={likesCount}
                onToggleLike={handleToggleLike}
                isFollowing={isFollowing}
                followersCount={followersCount}
                onToggleFollow={handleToggleFollow}
                onOpenShareModal={() => setShowShareModal(true)}
                onOpenMessageModal={() => setShowMessageModal(true)}
                contactWhatsApp={contactWhatsApp}
                fbUrl={fbUrl}
                igUrl={igUrl}
                ttUrl={ttUrl}
                webUrl={webUrl}
                googleMapsUrl={googleMapsUrl}
            />

            {/* 3. CONTENIDO PRINCIPAL (2 COLUMNAS) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col lg:flex-row gap-10">
                {/* Columna Izquierda: Catálogo y Eventos */}
                <div className="lg:w-2/3 space-y-10">
                    <CompanyCatalog 
                        company={company}
                        products={products}
                        filteredProducts={filteredProducts}
                        companyCategories={companyCategories}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        stockFilter={stockFilter}
                        setStockFilter={setStockFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        getProductQuoteWhatsAppUrl={getProductQuoteWhatsAppUrl}
                        onShareProduct={(prod) => setSharingProduct(prod)}
                    />

                    <CompanyEvents 
                        company={company}
                        events={events}
                        contactWhatsApp={contactWhatsApp}
                    />
                </div>

                {/* Columna Derecha: Sidebar de Canales y Contacto */}
                <CompanySidebar 
                    company={company}
                    hasDigitalChannels={hasDigitalChannels}
                    webUrl={webUrl}
                    contactWhatsApp={contactWhatsApp}
                    cleanPhone={cleanPhone}
                    fbUrl={fbUrl}
                    igUrl={igUrl}
                    ttUrl={ttUrl}
                    inUrl={inUrl}
                    googleMapsUrl={googleMapsUrl}
                />
            </main>

            {/* 4. FOOTER CORPORATIVO */}
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

            {/* 5. MODALES */}
            <ShareCompanyModal 
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                company={company}
                selectedBannerKey={selectedBannerKey}
                setSelectedBannerKey={setSelectedBannerKey}
                getShareUrl={getShareUrl}
                onCopyPageUrl={handleCopyPageUrl}
                copied={copied}
            />

            <ShareProductModal 
                product={sharingProduct}
                onClose={() => setSharingProduct(null)}
                company={company}
                getProductShareUrl={getProductShareUrl}
                onCopyProductUrl={handleCopyProductUrl}
                copied={copied}
            />

            <QuickMessageModal 
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                company={company}
                quickMessageText={quickMessageText}
                setQuickMessageText={setQuickMessageText}
                cleanPhone={cleanPhone}
            />

            {/* 6. TOAST NOTIFICACIÓN */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#0b132b]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3">
                    <span className="text-base">✨</span>
                    <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* 7. CHATBOT ASISTENTE VIRTUAL */}
            <CompanyChatbot company={company} />
        </div>
    );
}

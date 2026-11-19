import React, { useState, useEffect } from 'react';
import { fallbackImage } from '../../Welcome/Partials/WelcomeUtils';

export default function CompanyHeroBanner({ company }) {
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
    const [lightboxImage, setLightboxImage] = useState(null);

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

    return (
        <>
            {/* ═══════════════════════════════════════════════
                HERO STOREFRONT: BANNER DE PORTADA (ESTILO MODERNO)
               ═══════════════════════════════════════════════ */}
            <div className="relative w-full bg-slate-950 overflow-hidden">
                {/* Portada / Banner Panorámico en Alta Calidad y 100% Despejado */}
                <div 
                    className="relative w-full h-64 sm:h-80 md:h-[380px] lg:h-[440px] xl:h-[480px] overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setIsCarouselHovered(true)}
                    onMouseLeave={() => setIsCarouselHovered(false)}
                    onClick={() => setLightboxImage(carouselSlides[currentSlide]?.image)}
                    title="Haz clic para ver el flyer en pantalla completa"
                >
                    {carouselSlides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                        >
                            <img 
                                src={slide.image} 
                                alt={slide.title || company.name} 
                                className="w-full h-full object-cover object-center" 
                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                            />
                            {/* Gradiente muy sutil sólo en el borde inferior para no tapar el flyer */}
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            
                            {/* Badge Flotante del Banner & Botón para Ver Flyer Completo */}
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-sm">
                                    {slide.badge || 'STOREFRONT OFICIAL'}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImage(slide.image);
                                    }}
                                    className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md text-[10px] font-bold border border-white/20 transition flex items-center gap-1 shadow-sm cursor-pointer"
                                    title="Ver flyer en tamaño completo"
                                >
                                    <span>🔍 Ver Flyer</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Controles de Navegación del Banner si hay más de 1 imagen */}
                    {carouselSlides.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevSlide();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
                                title="Anterior"
                            >
                                ❮
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextSlide();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
                                title="Siguiente"
                            >
                                ❯
                            </button>
                            <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                                {carouselSlides.map((_, dotIdx) => (
                                    <button
                                        key={dotIdx}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide(dotIdx);
                                        }}
                                        className={`transition-all duration-300 rounded-full ${
                                            dotIdx === currentSlide
                                                ? 'w-6 h-2 bg-blue-500 shadow-md'
                                                : 'w-2 h-2 bg-white/60 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                MODAL LIGHTBOX: VER FLYER / BANNER EN PANTALLA COMPLETA
               ═══════════════════════════════════════════════ */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setLightboxImage(null)}
                            className="absolute -top-12 right-0 sm:right-2 text-white hover:text-rose-400 text-3xl font-bold p-2 cursor-pointer z-50 transition"
                            title="Cerrar vista"
                        >
                            ✕
                        </button>
                        <img 
                            src={lightboxImage} 
                            alt="Flyer promocional"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                        />
                        <p className="text-white/70 text-xs mt-3 text-center">
                            Toca fuera de la imagen o en la cruz para cerrar
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

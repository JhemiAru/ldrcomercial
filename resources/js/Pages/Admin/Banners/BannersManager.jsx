import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import BannerModal from './BannerModal';

export default function BannersManager({ banners = [] }) {
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado del carrusel interactivo en vivo dentro del panel
    const [previewIndex, setPreviewIndex] = useState(0);
    const activeBanners = banners.filter((b) => b.is_active);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const timer = setInterval(() => {
            setPreviewIndex((prev) => (prev + 1) % activeBanners.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [activeBanners.length]);

    const handleCreate = () => {
        setSelectedBanner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setIsModalOpen(true);
    };

    const handleDelete = (banner) => {
        if (confirm(`¿Estás seguro de eliminar el banner "${banner.title}"? Esta acción no se puede deshacer.`)) {
            router.delete(route('admin.banners.destroy', banner.id), {
                preserveScroll: true,
            });
        }
    };

    const handleToggleActive = (banner) => {
        router.post(route('admin.banners.toggle-active', banner.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            
            {/* Header de la Sección */}
            <div className="bg-white dark:bg-[#0b132b] p-5 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs font-bold">
                            🖼️
                        </span>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                            Carrusel de Banners de la Portada Principal
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Administra, cambia imágenes, ordena y enlaza los banners que ven todos los visitantes al entrar a LDR Comercial
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>+</span>
                        <span>Agregar Nuevo Banner</span>
                    </button>
                </div>
            </div>

            {/* VISTA PREVIA EN VIVO DEL CARRUSEL (CÓMO LO VEN LOS CLIENTES) */}
            {activeBanners.length > 0 && (
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative group">
                    <div className="p-3 bg-slate-950/90 text-[11px] font-bold text-slate-300 flex items-center justify-between border-b border-white/10 px-5">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Vista Previa en Vivo de la Portada ({previewIndex + 1} de {activeBanners.length})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                            Auto-avance cada 4.5s
                        </span>
                    </div>

                    <div className="relative h-44 sm:h-64 md:h-72 w-full overflow-hidden">
                        {activeBanners.map((banner, idx) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                    idx === previewIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                                    <div className="max-w-2xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                                            Posición #{banner.order}
                                        </span>
                                        <h3 className="text-base sm:text-xl font-black mt-1 text-white">
                                            {banner.title}
                                        </h3>
                                        {banner.subtitle && (
                                            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        {banner.link && (
                                            <span className="text-[10px] text-blue-300 underline font-mono mt-1 block">
                                                Enlace: {banner.link}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controles de Vista Previa */}
                    <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                        {activeBanners.map((_, dotIdx) => (
                            <button
                                key={dotIdx}
                                type="button"
                                onClick={() => setPreviewIndex(dotIdx)}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    dotIdx === previewIndex
                                        ? 'w-6 h-2 bg-blue-500 shadow-md'
                                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                }`}
                                title={`Ver banner ${dotIdx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* LISTADO Y ADMINISTRACIÓN DE BANNERS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
                    <span>Todos los Banners ({banners.length})</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                        Arrastra o edita el orden numérico para definir la secuencia
                    </span>
                </div>

                {banners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`p-4 rounded-3xl bg-white dark:bg-[#0b132b] border transition-all duration-300 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
                                    banner.is_active
                                        ? 'border-slate-200/90 dark:border-white/10'
                                        : 'border-slate-200/50 dark:border-white/5 opacity-70 bg-slate-50/50'
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* Miniatura Panorámica */}
                                    <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 group">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Badge de Orden */}
                                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/20 shadow-xs">
                                            #{banner.order}
                                        </div>

                                        {/* Badge de Estado */}
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs backdrop-blur-xs ${
                                                banner.is_active
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-amber-500 text-white'
                                            }`}>
                                                {banner.is_active ? '● Activo' : '● Pausado'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Información del Banner */}
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                            {banner.title}
                                        </h4>
                                        {banner.subtitle && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                                {banner.subtitle}
                                            </p>
                                        )}

                                        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">Enlace:</span>
                                            {banner.link ? (
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline truncate font-mono"
                                                >
                                                    {banner.link}
                                                </a>
                                            ) : (
                                                <span className="italic text-slate-400">Sin enlace configurado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Barra de Acciones del Banner */}
                                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                                    {/* Switch Activar / Pausar */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(banner)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                            banner.is_active
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                        title={banner.is_active ? 'Pausar banner (ocultar de la web)' : 'Activar banner en la web'}
                                    >
                                        <span>{banner.is_active ? '✓' : '⏸'}</span>
                                        <span>{banner.is_active ? 'Visible en Web' : 'Pausado'}</span>
                                    </button>

                                    {/* Botones Editar y Eliminar */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(banner)}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                            title="Editar imagen, título y enlace"
                                        >
                                            <span>✏️</span>
                                            <span>Editar</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(banner)}
                                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                                            title="Eliminar banner"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white dark:bg-[#0b132b] rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                        <span className="text-4xl block mb-2">🖼️</span>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            No hay banners registrados
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                            Agrega el primer banner para mostrarlo en la cabecera principal de tu plataforma.
                        </p>
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                            + Agregar Banner
                        </button>
                    </div>
                )}
            </div>

            {/* Modal para Crear y Editar */}
            <BannerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                banner={selectedBanner}
            />
        </div>
    );
}


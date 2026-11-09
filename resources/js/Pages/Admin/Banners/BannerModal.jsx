import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function BannerModal({
    isOpen,
    onClose,
    banner = null, // null para crear, objeto para editar
}) {
    if (!isOpen) return null;

    const isEdit = !!banner;

    const [title, setTitle] = useState(banner?.title || '');
    const [subtitle, setSubtitle] = useState(banner?.subtitle || '');
    const [link, setLink] = useState(banner?.link || '');
    const [order, setOrder] = useState(banner?.order ?? 1);
    const [isActive, setIsActive] = useState(banner ? banner.is_active : true);

    const [imageType, setImageType] = useState('file'); // 'file' | 'url'
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(banner?.image || '');
    const [previewUrl, setPreviewUrl] = useState(banner?.image || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (banner) {
            setTitle(banner.title || '');
            setSubtitle(banner.subtitle || '');
            setLink(banner.link || '');
            setOrder(banner.order ?? 1);
            setIsActive(banner.is_active);
            setImageUrl(banner.image || '');
            setPreviewUrl(banner.image || '');
            setImageType(banner.image && banner.image.startsWith('http') ? 'url' : 'file');
        } else {
            setTitle('');
            setSubtitle('');
            setLink('');
            setOrder(1);
            setIsActive(true);
            setImageFile(null);
            setImageUrl('');
            setPreviewUrl('');
            setImageType('file');
        }
        setErrors({});
    }, [banner, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setPreviewUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', title);
        if (subtitle) formData.append('subtitle', subtitle);
        if (link) formData.append('link', link);
        formData.append('order', order);
        formData.append('is_active', isActive ? '1' : '0');

        if (imageType === 'file' && imageFile) {
            formData.append('image_file', imageFile);
        } else if (imageUrl) {
            formData.append('image_url', imageUrl);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(route('admin.banners.update', banner.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        } else {
            router.post(route('admin.banners.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b132b] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-xl font-bold">
                            🖼️
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                                {isEdit ? 'Editar Banner del Carrusel' : 'Agregar Nuevo Banner al Carrusel'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Visible en la portada principal (Recomendado: 1920x600 o proporción panorámica)
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
                    
                    {/* Vista Previa de la Imagen */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Vista Previa del Banner
                        </label>
                        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Vista previa"
                                    className="w-full h-full object-cover"
                                    onError={() => setPreviewUrl('')}
                                />
                            ) : (
                                <div className="text-center p-6 text-slate-400">
                                    <span className="text-3xl block mb-1">🖼️</span>
                                    <span>Selecciona o ingresa una imagen para ver la vista previa</span>
                                </div>
                            )}

                            {previewUrl && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
                                    Proporción Panorámica Recomendada (16:9 o 21:9)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selector de Método: Archivo vs URL */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Origen de la Imagen *
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setImageType('file')}
                                className={`py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                                    imageType === 'file'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200'
                                }`}
                            >
                                <span>📁 Subir desde mi Computadora</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setImageType('url')}
                                className={`py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                                    imageType === 'url'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200'
                                }`}
                            >
                                <span>🔗 Enlace Web (URL)</span>
                            </button>
                        </div>

                        {imageType === 'file' ? (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/10 dark:file:text-blue-400 cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    JPG, PNG o WebP hasta 8MB. Se optimizará y convertirá automáticamente a formato <strong>WebP ultrarrápido</strong>.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={imageUrl}
                                    onChange={handleUrlChange}
                                    className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        )}
                        {errors.image_file && <p className="text-red-500 text-[11px] mt-1">{errors.image_file}</p>}
                    </div>

                    {/* Título y Subtítulo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Título del Banner *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ej. Gran Feria Ferretera 2026"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500 font-bold"
                            />
                            {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Subtítulo o Descripción (Opcional)
                            </label>
                            <input
                                type="text"
                                placeholder="Ej. Equipamiento con 20% de descuento directo"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Enlace de Destino y Posición */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Enlace al hacer clic (URL o ruta interna)
                            </label>
                            <input
                                type="text"
                                placeholder="/empresas?search=Ferretería o https://..."
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                Puedes poner una ruta interna (ej. <code>/categorias</code>) o externa.
                            </p>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Posición / Orden
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="99"
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 text-center font-bold focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                                Menor número = aparece primero
                            </p>
                        </div>
                    </div>

                    {/* Estado Activo */}
                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <span className="font-bold text-slate-800 dark:text-white block text-xs">
                                Estado en el Carrusel
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {isActive ? 'Visible para todos los clientes en la portada' : 'Pausado (no se mostrará a los clientes)'}
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <span>💾</span>
                            <span>{isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar Banner' : 'Publicar Banner')}</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}


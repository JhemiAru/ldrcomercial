import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';

export default function EditCompanyModal({
    isOpen,
    onClose,
    company,
    categories = [],
}) {
    if (!isOpen || !company) return null;

    const fileInputRef = useRef(null);
    const banner1Ref = useRef(null);
    const banner2Ref = useRef(null);
    const banner3Ref = useRef(null);

    const [previewUrl, setPreviewUrl] = useState(company.logo || null);
    const [useUrlInput, setUseUrlInput] = useState(false);

    const [bannerPreviews, setBannerPreviews] = useState({
        banner: company.banner || null,
        banner_2: company.banner_2 || null,
        banner_3: company.banner_3 || null,
    });

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'put',
        name: company.name || '',
        legal_name: company.legal_name || '',
        tax_id: company.tax_id || '',
        category_id: company.category_id || '',
        city: company.city || 'Santa Cruz',
        department: company.department || '',
        address: company.address || '',
        phone: company.phone || '',
        whatsapp: company.whatsapp || '',
        email: company.email || '',
        website: company.website || '',
        facebook: company.facebook || '',
        instagram: company.instagram || '',
        tiktok: company.tiktok || '',
        linkedin: company.linkedin || '',
        short_description: company.short_description || '',
        description: company.description || '',
        is_verified: !!company.is_verified,
        is_active: company.is_active !== undefined ? !!company.is_active : true,
        logo: null,
        remove_logo: false,
        banner: null,
        banner_2: null,
        banner_3: null,
        remove_banner: false,
        remove_banner_2: false,
        remove_banner_3: false,
    });

    useEffect(() => {
        if (isOpen && company) {
            setData({
                _method: 'put',
                name: company.name || '',
                legal_name: company.legal_name || '',
                tax_id: company.tax_id || '',
                category_id: company.category_id || (categories[0]?.id ?? ''),
                city: company.city || 'Santa Cruz',
                department: company.department || '',
                address: company.address || '',
                phone: company.phone || '',
                whatsapp: company.whatsapp || '',
                email: company.email || '',
                website: company.website || '',
                facebook: company.facebook || '',
                instagram: company.instagram || '',
                tiktok: company.tiktok || '',
                linkedin: company.linkedin || '',
                short_description: company.short_description || '',
                description: company.description || '',
                is_verified: !!company.is_verified,
                is_active: company.is_active !== undefined ? !!company.is_active : true,
                logo: null,
                remove_logo: false,
                banner: null,
                banner_2: null,
                banner_3: null,
                remove_banner: false,
                remove_banner_2: false,
                remove_banner_3: false,
            });
            setPreviewUrl(company.logo || null);
            setBannerPreviews({
                banner: company.banner || null,
                banner_2: company.banner_2 || null,
                banner_3: company.banner_3 || null,
            });
            setUseUrlInput(false);
            clearErrors();
        }
    }, [isOpen, company]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                logo: file,
                remove_logo: false,
            }));
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemovePhoto = () => {
        setData((prev) => ({
            ...prev,
            logo: null,
            remove_logo: true,
        }));
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUrlChange = (val) => {
        setData((prev) => ({
            ...prev,
            logo: val,
            remove_logo: false,
        }));
        setPreviewUrl(val || null);
    };

    const handleBannerFileChange = (field, file) => {
        if (file) {
            setData((prev) => ({
                ...prev,
                [field]: file,
                [`remove_${field}`]: false,
            }));
            const objUrl = URL.createObjectURL(file);
            setBannerPreviews((prev) => ({ ...prev, [field]: objUrl }));
        }
    };

    const handleBannerUrlChange = (field, val) => {
        setData((prev) => ({
            ...prev,
            [field]: val,
            [`remove_${field}`]: false,
        }));
        setBannerPreviews((prev) => ({ ...prev, [field]: val || null }));
    };

    const handleRemoveBanner = (field, ref) => {
        setData((prev) => ({
            ...prev,
            [field]: null,
            [`remove_${field}`]: true,
        }));
        setBannerPreviews((prev) => ({ ...prev, [field]: null }));
        if (ref?.current) {
            ref.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.companies.update', company.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const boliviaCities = [
        'Santa Cruz',
        'La Paz',
        'Cochabamba',
        'El Alto',
        'Tarija',
        'Chuquisaca / Sucre',
        'Oruro',
        'Potosí',
        'Beni',
        'Pando',
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-[#0b132b] w-full max-w-3xl rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden my-8">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>✏️</span>
                            <span>Editar Empresa & Personalización</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Modifica datos comerciales, ubicación, foto de perfil, carrusel y redes de <strong>{company.name}</strong>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    
                    {/* ═══════════════════════════════════════════════
                        MÓDULO 1: FOTO DE PERFIL / LOGOTIPO
                       ═══════════════════════════════════════════════ */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-200/70 dark:border-blue-500/20">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <span>📷</span>
                            <span>Foto de Perfil / Logotipo de la Empresa</span>
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            
                            {/* Vista previa del Logo */}
                            <div className="relative group shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-white/10 border-2 border-dashed border-blue-300 dark:border-blue-500/30 flex items-center justify-center overflow-hidden shadow-inner">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={company.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-2 text-slate-400">
                                            <span className="text-2xl block">🏢</span>
                                            <span className="text-[9px] font-bold block mt-0.5">Sin Foto</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md hover:bg-blue-700 transition"
                                    title="Subir nueva foto"
                                >
                                    📷
                                </button>
                            </div>

                            {/* Controles para cambiar la foto */}
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
                                    >
                                        <span>📁</span>
                                        <span>Subir Imagen desde PC</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setUseUrlInput(!useUrlInput)}
                                        className="px-3 py-1.5 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-xs rounded-xl transition"
                                    >
                                        {useUrlInput ? 'Ocultar URL' : '🔗 Usar Enlace URL'}
                                    </button>

                                    {previewUrl && (
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition"
                                        >
                                            🗑️ Quitar Foto
                                        </button>
                                    )}
                                </div>

                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Formatos permitidos: JPG, PNG, WEBP o SVG (máx. 4MB).
                                </p>

                                {useUrlInput && (
                                    <div className="pt-2 animate-fade-in">
                                        <input
                                            type="text"
                                            placeholder="https://ejemplo.com/logo.png"
                                            value={typeof data.logo === 'string' ? data.logo : ''}
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                            className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] text-slate-900 dark:text-white"
                                        />
                                    </div>
                                )}

                                {errors.logo && (
                                    <p className="text-[11px] text-red-500 font-bold">{errors.logo}</p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        MÓDULO 2: CARRUSEL DE 3 IMÁGENES PROMOCIONALES
                       ═══════════════════════════════════════════════ */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span>🖼️</span>
                                <span>Carrusel de 3 Imágenes de la Empresa</span>
                            </label>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                Visible en Perfil Público y Catálogo
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Personaliza las 3 imágenes que rotan en el perfil de la empresa (instalaciones, maquinaria, tienda o promociones destacadas):
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {[
                                { key: 'banner', label: 'Imagen 1 (Principal)', ref: banner1Ref },
                                { key: 'banner_2', label: 'Imagen 2 (Secundaria)', ref: banner2Ref },
                                { key: 'banner_3', label: 'Imagen 3 (Promocional)', ref: banner3Ref },
                            ].map((slot, idx) => (
                                <div key={slot.key} className="p-3 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200/80 dark:border-white/10 space-y-2 flex flex-col justify-between shadow-xs">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                {slot.label}
                                            </span>
                                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                                                Slide {idx + 1}
                                            </span>
                                        </div>
                                        
                                        <div className="h-24 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center relative border border-dashed border-slate-200 dark:border-white/10 group">
                                            {bannerPreviews[slot.key] ? (
                                                <img 
                                                    src={bannerPreviews[slot.key]} 
                                                    alt={`Banner ${idx + 1}`} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <div className="text-center p-2 text-slate-400">
                                                    <span className="text-xl block">🏞️</span>
                                                    <span className="text-[9px] font-bold block mt-0.5">Vacío</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <input
                                            type="file"
                                            ref={slot.ref}
                                            onChange={(e) => handleBannerFileChange(slot.key, e.target.files?.[0])}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => slot.ref.current?.click()}
                                                className="flex-1 py-1 px-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg transition"
                                            >
                                                📁 Subir PC
                                            </button>
                                            {bannerPreviews[slot.key] && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBanner(slot.key, slot.ref)}
                                                    className="py-1 px-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg transition"
                                                    title="Quitar imagen"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="o pegar URL..."
                                            value={typeof data[slot.key] === 'string' ? data[slot.key] : ''}
                                            onChange={(e) => handleBannerUrlChange(slot.key, e.target.value)}
                                            className="w-full text-[10px] px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        MÓDULO 3: DATOS GENERALES DE LA EMPRESA
                       ═══════════════════════════════════════════════ */}
                    {/* Fila 1: Nombre comercial y Razón social */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Nombre Comercial *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Ej. Aceros del Oriente S.R.L."
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Razón Social (Opcional)
                            </label>
                            <input
                                type="text"
                                value={data.legal_name}
                                onChange={(e) => setData('legal_name', e.target.value)}
                                placeholder="Nombre fiscal completo"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.legal_name && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.legal_name}</p>}
                        </div>
                    </div>

                    {/* Fila 2: NIT y Categoría */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                NIT / Identificación Tributaria
                            </label>
                            <input
                                type="text"
                                value={data.tax_id}
                                onChange={(e) => setData('tax_id', e.target.value)}
                                placeholder="Ej. 1028475021"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.tax_id && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.tax_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Rubro / Categoría Comercial *
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                required
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.category_id}</p>}
                        </div>
                    </div>

                    {/* Fila 3: Ciudad y Dirección */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Ciudad / Sede (Bolivia)
                            </label>
                            <select
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            >
                                {boliviaCities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {errors.city && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Dirección Física del Local
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Ej. Av. Cristo Redentor 4to Anillo #120"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.address && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.address}</p>}
                        </div>
                    </div>

                    {/* Fila 4: Teléfonos y WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Teléfono Fijo / Central
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Ej. 3-3456789"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                WhatsApp Comercial (Cotizaciones)
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                placeholder="Ej. 70012345"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.whatsapp && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.whatsapp}</p>}
                        </div>
                    </div>

                    {/* Fila 5: Correo y Sitio Web */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Correo Institucional de Contacto
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contacto@empresa.com"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Sitio Web
                            </label>
                            <input
                                type="text"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://www.empresa.com"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.website && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.website}</p>}
                        </div>
                    </div>

                    {/* Redes Sociales Oficiales */}
                    <div className="pt-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                            🌐 Canales Digitales & Redes Sociales
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <span>📘</span> Facebook (URL o usuario)
                                </label>
                                <input
                                    type="text"
                                    value={data.facebook}
                                    onChange={(e) => setData('facebook', e.target.value)}
                                    placeholder="https://facebook.com/tuempresa"
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <span>📸</span> Instagram (URL o usuario)
                                </label>
                                <input
                                    type="text"
                                    value={data.instagram}
                                    onChange={(e) => setData('instagram', e.target.value)}
                                    placeholder="https://instagram.com/tuempresa"
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <span>🎵</span> TikTok (URL o @usuario)
                                </label>
                                <input
                                    type="text"
                                    value={data.tiktok}
                                    onChange={(e) => setData('tiktok', e.target.value)}
                                    placeholder="https://tiktok.com/@tuempresa"
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                    <span>💼</span> LinkedIn (URL empresarial)
                                </label>
                                <input
                                    type="text"
                                    value={data.linkedin}
                                    onChange={(e) => setData('linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/company/tuempresa"
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Breve Reseña */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Descripción Breve (Lema / Especialidad)
                        </label>
                        <input
                            type="text"
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                            placeholder="Ej. Distribuidor mayorista de repuestos industriales y herramientas"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.short_description && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.short_description}</p>}
                    </div>

                    {/* Reseña Detallada */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Descripción Completa / Trayectoria
                        </label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Detalla la historia, experiencia y cobertura de la empresa..."
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Estados de la Empresa */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200/80 dark:border-blue-500/20 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_verified}
                                onChange={(e) => setData('is_verified', e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <div>
                                <span className="font-bold text-xs text-blue-900 dark:text-blue-200 block">
                                    Empresa Verificada ✓
                                </span>
                                <span className="text-[10px] text-blue-700/80 dark:text-blue-300/80 block">
                                    Insignia oficial de confianza presencial
                                </span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <div>
                                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                                    Ficha Comercial Activa
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                                    Visible en el directorio público y catálogo
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Botones de Envío */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Guardando cambios...</span>
                                </>
                            ) : (
                                <span>Guardar Cambios</span>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditCompany({ company, categories = [], status }) {
    const { data, setData, post, processing, errors } = useForm({
        name: company?.name || '',
        legal_name: company?.legal_name || '',
        category_id: company?.category_id || '',
        tax_id: company?.tax_id || '',
        short_description: company?.short_description || '',
        description: company?.description || '',
        phone: company?.phone || '',
        whatsapp: company?.whatsapp || '',
        email: company?.email || '',
        website: company?.website || '',
        facebook: company?.facebook || '',
        instagram: company?.instagram || '',
        tiktok: company?.tiktok || '',
        linkedin: company?.linkedin || '',
        address: company?.address || '',
        city: company?.city || '',
        department: company?.department || '',
        logo: null,
        remove_logo: false,
        banner: null,
        banner_2: null,
        banner_3: null,
        remove_banner: false,
        remove_banner_2: false,
        remove_banner_3: false,
    });

    // Estados para previsualizaciones de imágenes
    const [logoPreview, setLogoPreview] = useState(company?.logo || null);
    const [logoUseUrl, setLogoUseUrl] = useState(false);

    const [bannerPreviews, setBannerPreviews] = useState({
        banner: company?.banner || null,
        banner_2: company?.banner_2 || null,
        banner_3: company?.banner_3 || null,
    });

    const [bannerInputModes, setBannerInputModes] = useState({
        banner: 'file',
        banner_2: 'file',
        banner_3: 'file',
    });

    const logoFileRef = useRef(null);
    const banner1FileRef = useRef(null);
    const banner2FileRef = useRef(null);
    const banner3FileRef = useRef(null);

    const bannerRefs = {
        banner: banner1FileRef,
        banner_2: banner2FileRef,
        banner_3: banner3FileRef,
    };

    // Manejo de Logo
    const handleLogoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                logo: file,
                remove_logo: false,
            }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleLogoUrlChange = (val) => {
        setData((prev) => ({
            ...prev,
            logo: val,
            remove_logo: false,
        }));
        setLogoPreview(val || null);
    };

    const handleRemoveLogo = () => {
        setData((prev) => ({
            ...prev,
            logo: null,
            remove_logo: true,
        }));
        setLogoPreview(null);
        if (logoFileRef.current) logoFileRef.current.value = '';
    };

    // Manejo de Banners del Carrusel
    const handleBannerFileChange = (field, e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                [field]: file,
                [`remove_${field}`]: false,
            }));
            setBannerPreviews((prev) => ({
                ...prev,
                [field]: URL.createObjectURL(file),
            }));
        }
    };

    const handleBannerUrlChange = (field, val) => {
        setData((prev) => ({
            ...prev,
            [field]: val,
            [`remove_${field}`]: false,
        }));
        setBannerPreviews((prev) => ({
            ...prev,
            [field]: val || null,
        }));
    };

    const handleRemoveBanner = (field) => {
        setData((prev) => ({
            ...prev,
            [field]: null,
            [`remove_${field}`]: true,
        }));
        setBannerPreviews((prev) => ({
            ...prev,
            [field]: null,
        }));
        if (bannerRefs[field]?.current) {
            bannerRefs[field].current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('company.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const boliviaDepartments = [
        'Santa Cruz',
        'La Paz',
        'Cochabamba',
        'Chuquisaca',
        'Oruro',
        'Potosí',
        'Tarija',
        'Beni',
        'Pando',
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <span>🏢 Perfil Comercial de Mi Empresa</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Personaliza tu foto de perfil, carrusel publicitario, canales de contacto y redes sociales.
                        </p>
                    </div>

                    {company?.id && (
                        <Link
                            href={route('companies.show', company.id)}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition self-start sm:self-auto shrink-0"
                            title="Abre la página web que ven tus clientes"
                        >
                            <span>🏪 Ver Mi Perfil Público</span>
                            <span>↗</span>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Perfil de Mi Empresa | LDR Comercial" />

            <div className="py-6 max-w-5xl mx-auto space-y-6">
                
                {/* Mensaje de Éxito */}
                {status && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs">
                        <span className="text-xl">✅</span>
                        <span>{status}</span>
                    </div>
                )}

                {/* Banner de Estado de Verificación B2B */}
                {company && (
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl border ${
                                company.is_verified
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            }`}>
                                {company.is_verified ? '🛡️' : '⏱️'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                        Estado de Verificación:
                                    </h4>
                                    {company.is_verified ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30">
                                            ✓ Verificada Presencialmente
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30">
                                            ⏳ En Proceso de Auditoría
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                                    {company.is_verified
                                        ? 'Tu negocio exhibe la insignia azul de confianza B2B en el directorio, otorgando máxima credibilidad ante compradores comerciales.'
                                        : 'Asegúrate de registrar tu NIT, dirección física y canales oficiales para que el equipo comercial de LDR valide tu empresa.'}
                                </p>
                            </div>
                        </div>

                        {company?.id && (
                            <div className="sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-5 shrink-0">
                                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">ID de Empresa</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300">#{company.id}</span>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 1: FOTO DE PERFIL / LOGO DEL NEGOCIO
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                                IDENTIDAD DE MARCA
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Foto de Perfil & Logotipo
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Este logotipo se mostrará en el encabezado de tu vitrina pública, en cada producto que publiques y en el directorio de empresas.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Vista Previa del Logo */}
                            <div className="relative group shrink-0">
                                <div className="w-28 h-28 rounded-3xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/20 p-1.5 shadow-md overflow-hidden flex items-center justify-center">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt={data.name || 'Logo'}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white">
                                            <span className="text-3xl font-black">{data.name?.charAt(0) || '🏢'}</span>
                                            <span className="text-[9px] uppercase font-bold opacity-80 mt-1">Sin Logo</span>
                                        </div>
                                    )}
                                </div>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                                        title="Eliminar logo actual"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Opciones de Carga de Logo */}
                            <div className="flex-1 space-y-3 w-full">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setLogoUseUrl(false)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            !logoUseUrl
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        📁 Subir Archivo desde Equipo / Celular
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLogoUseUrl(true)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            logoUseUrl
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        🔗 Pegar URL de Imagen
                                    </button>
                                </div>

                                {!logoUseUrl ? (
                                    <div className="space-y-1.5">
                                        <input
                                            ref={logoFileRef}
                                            type="file"
                                            id="logo"
                                            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                                            onChange={handleLogoFileChange}
                                            className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 dark:file:bg-white/10 file:text-white hover:file:bg-slate-800 cursor-pointer"
                                        />
                                        <p className="text-[11px] text-slate-400">
                                            Formatos recomendados: PNG o JPG con fondo transparente o blanco. Máx 4MB.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <TextInput
                                            type="text"
                                            value={typeof data.logo === 'string' ? data.logo : ''}
                                            onChange={(e) => handleLogoUrlChange(e.target.value)}
                                            placeholder="https://ejemplo.com/imagenes/mi-logo.png"
                                            className="w-full text-xs"
                                        />
                                        <p className="text-[11px] text-slate-400">
                                            Ingresa un enlace directo a una imagen accesible públicamente.
                                        </p>
                                    </div>
                                )}
                                <InputError message={errors.logo} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 2: CARRUSEL DE 3 IMÁGENES DE LA EMPRESA
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                VITRINA VISUAL B2B
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Carrusel Publicitario de 3 Banners
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Estas 3 imágenes rotan de forma automática cada 5 segundos al inicio de tu catálogo público (<code className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-[11px] font-mono">#catalogo</code>). Personaliza cada slide con fotos de tus instalaciones, stock o promociones.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    id: 'banner',
                                    title: 'Slide 1: Banner Principal',
                                    subtitle: 'Portada / Instalaciones / Fachada',
                                    badge: 'SLIDE 1',
                                    defaultFallback: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80',
                                },
                                {
                                    id: 'banner_2',
                                    title: 'Slide 2: Novedades & Stock',
                                    subtitle: 'Líneas de Producto / Proveedores',
                                    badge: 'SLIDE 2',
                                    defaultFallback: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
                                },
                                {
                                    id: 'banner_3',
                                    title: 'Slide 3: Cobertura & Trato',
                                    subtitle: 'Envíos Nacionales / Garantía',
                                    badge: 'SLIDE 3',
                                    defaultFallback: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                                },
                            ].map((slide) => {
                                const field = slide.id;
                                const preview = bannerPreviews[field];
                                const isUrlMode = bannerInputModes[field] === 'url';

                                return (
                                    <div
                                        key={field}
                                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4 group"
                                    >
                                        <div className="space-y-3">
                                            {/* Cabecera del Slide */}
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-black text-[10px] rounded-md tracking-wider">
                                                    {slide.badge}
                                                </span>
                                                {preview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveBanner(field)}
                                                        className="text-[11px] font-bold text-red-500 hover:text-red-600 transition cursor-pointer"
                                                    >
                                                        ✕ Quitar imagen
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-black text-xs text-slate-800 dark:text-white">
                                                    {slide.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-400">{slide.subtitle}</p>
                                            </div>

                                            {/* Preview con proporción 16:9 */}
                                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-black/30 border border-slate-300 dark:border-white/10">
                                                <img
                                                    src={preview || slide.defaultFallback}
                                                    alt={slide.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {!preview && (
                                                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-2 text-center">
                                                        <span className="text-[10px] font-bold text-slate-200 bg-black/40 px-2 py-1 rounded-md">
                                                            (Usando imagen por defecto)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selector de modo: Archivo vs URL */}
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setBannerInputModes((prev) => ({ ...prev, [field]: 'file' }))
                                                    }
                                                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                                                        !isUrlMode
                                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                                            : 'bg-white dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-transparent'
                                                    }`}
                                                >
                                                    📁 Archivo
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setBannerInputModes((prev) => ({ ...prev, [field]: 'url' }))
                                                    }
                                                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                                                        isUrlMode
                                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                                            : 'bg-white dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-transparent'
                                                    }`}
                                                >
                                                    🔗 URL
                                                </button>
                                            </div>

                                            {/* Input según modo */}
                                            {!isUrlMode ? (
                                                <div>
                                                    <input
                                                        ref={bannerRefs[field]}
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                                        onChange={(e) => handleBannerFileChange(field, e)}
                                                        className="block w-full text-[11px] text-slate-500 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                                                    />
                                                    <p className="text-[10px] text-slate-400 mt-1">Recomendado: 1200x500px o horizontal. Máx 5MB.</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={typeof data[field] === 'string' ? data[field] : ''}
                                                        onChange={(e) => handleBannerUrlChange(field, e.target.value)}
                                                        placeholder="https://ejemplo.com/banner.jpg"
                                                        className="w-full text-xs"
                                                    />
                                                </div>
                                            )}

                                            <InputError message={errors[field]} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 3: REDES SOCIALES & CANALES DIGITALES
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                CONECTIVIDAD & MARKETING
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Redes Sociales & Canales Oficiales
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Aparecerán con sus logotipos oficiales en la barra lateral de tu vitrina pública para que los clientes te sigan y contacten directamente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* WhatsApp */}
                            <div>
                                <InputLabel htmlFor="whatsapp" value="WhatsApp Comercial Directo" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500 font-bold text-xs">
                                        🟢 +591
                                    </div>
                                    <TextInput
                                        id="whatsapp"
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="70000000"
                                        className="pl-16 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Recibirás consultas de cotizaciones de productos a este número.
                                </p>
                                <InputError message={errors.whatsapp} />
                            </div>

                            {/* Sitio Web */}
                            <div>
                                <InputLabel htmlFor="website" value="Sitio Web Corporativo / E-commerce" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                                        🌐
                                    </div>
                                    <TextInput
                                        id="website"
                                        type="text"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://tuempresa.bo"
                                        className="pl-9 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <InputError message={errors.website} />
                            </div>

                            {/* Facebook */}
                            <div>
                                <InputLabel htmlFor="facebook" value="Facebook Oficial" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1877F2] font-black text-xs">
                                        f
                                    </div>
                                    <TextInput
                                        id="facebook"
                                        type="text"
                                        value={data.facebook}
                                        onChange={(e) => setData('facebook', e.target.value)}
                                        placeholder="https://facebook.com/tuempresa o @tuempresa"
                                        className="pl-9 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <InputError message={errors.facebook} />
                            </div>

                            {/* Instagram */}
                            <div>
                                <InputLabel htmlFor="instagram" value="Instagram Oficial" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-500 font-bold text-xs">
                                        📸
                                    </div>
                                    <TextInput
                                        id="instagram"
                                        type="text"
                                        value={data.instagram}
                                        onChange={(e) => setData('instagram', e.target.value)}
                                        placeholder="https://instagram.com/tuempresa o @tuempresa"
                                        className="pl-9 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <InputError message={errors.instagram} />
                            </div>

                            {/* TikTok */}
                            <div>
                                <InputLabel htmlFor="tiktok" value="TikTok Oficial" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-900 dark:text-white font-bold text-xs">
                                        🎵
                                    </div>
                                    <TextInput
                                        id="tiktok"
                                        type="text"
                                        value={data.tiktok}
                                        onChange={(e) => setData('tiktok', e.target.value)}
                                        placeholder="https://tiktok.com/@tuempresa o @tuempresa"
                                        className="pl-9 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <InputError message={errors.tiktok} />
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <InputLabel htmlFor="linkedin" value="LinkedIn Empresarial" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0A66C2] font-black text-xs">
                                        in
                                    </div>
                                    <TextInput
                                        id="linkedin"
                                        type="text"
                                        value={data.linkedin}
                                        onChange={(e) => setData('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/company/tuempresa"
                                        className="pl-9 block w-full text-xs sm:text-sm"
                                    />
                                </div>
                                <InputError message={errors.linkedin} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 4: INFORMACIÓN COMERCIAL & FISCAL
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                DATOS LEGALES & RUBRO
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Identificación de la Empresa
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Información formal que certifica la legitimidad del negocio.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nombre Comercial del Negocio *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm font-bold"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Ej. AgroOriente Bolivia SRL"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="category_id" value="Rubro / Categoría Principal *" />
                                <select
                                    id="category_id"
                                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Selecciona un rubro comercial</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="text-slate-800">
                                            {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="legal_name" value="Razón Social (Opcional)" />
                                <TextInput
                                    id="legal_name"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.legal_name}
                                    onChange={(e) => setData('legal_name', e.target.value)}
                                    placeholder="Nombre legal o registrado en FUNDEMPRESA / SEPREC"
                                />
                                <InputError message={errors.legal_name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="tax_id" value="NIT / Identificación Tributaria" />
                                <TextInput
                                    id="tax_id"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm font-mono"
                                    value={data.tax_id}
                                    onChange={(e) => setData('tax_id', e.target.value)}
                                    placeholder="Ej. 1028473021"
                                />
                                <InputError message={errors.tax_id} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 5: UBICACIÓN & CONTACTO FÍSICO
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                UBICACIÓN & ATENCIÓN
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Ubicación Geográfica & Teléfonos
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Los compradores podrán verificar tu local comercial y abrir tu dirección en Google Maps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <InputLabel htmlFor="department" value="Departamento" />
                                <select
                                    id="department"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Selecciona departamento</option>
                                    {boliviaDepartments.map((dept) => (
                                        <option key={dept} value={dept} className="text-slate-800">
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.department} />
                            </div>

                            <div>
                                <InputLabel htmlFor="city" value="Ciudad / Localidad" />
                                <TextInput
                                    id="city"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Ej. Santa Cruz de la Sierra"
                                />
                                <InputError message={errors.city} />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Teléfono Fijo / Centralita" />
                                <TextInput
                                    id="phone"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Ej. +591 3 3456789"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="address" value="Dirección Física Completa" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Ej. Av. Banzer Km 8.5 entre 4to y 5to anillo"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico de Ventas" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="ventas@tuempresa.bo"
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 6: RESEÑA & TRAYECTORIA COMERCIAL
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                PROPUESTA DE VALOR
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Presentación Comercial & Reseña
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Cuenta a tus compradores tu historia, experiencia, marcas que distribuyes y condiciones de entrega.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <InputLabel htmlFor="short_description" value="Lema o Resumen Corto (Máx. 500 caracteres)" />
                                <TextInput
                                    id="short_description"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="Ej. Proveedor líder de soluciones y repuestos industriales con despacho inmediato a los 9 departamentos."
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Aparece en la cabecera principal de tu perfil y en las tarjetas del directorio.
                                </p>
                                <InputError message={errors.short_description} />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Acerca de la Empresa / Trayectoria / Garantías" />
                                <textarea
                                    id="description"
                                    rows="6"
                                    className="mt-1 block w-full rounded-2xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 leading-relaxed"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe detalladamente los servicios que ofreces, marcas representadas, políticas de garantía y facturación oficial..."
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    {/* BOTÓN FLOTANTE / INFERIOR DE GUARDADO */}
                    <div className="sticky bottom-4 z-20 bg-white/90 dark:bg-[#0b132b]/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                            💡 Los cambios se actualizarán al instante en tu vitrina pública de <span className="font-bold text-slate-800 dark:text-white">LDR Comercial</span>.
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            {company?.id && (
                                <Link
                                    href={route('companies.show', company.id)}
                                    target="_blank"
                                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                >
                                    Previsualizar ↗
                                </Link>
                            )}

                            <PrimaryButton
                                disabled={processing}
                                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-lg shadow-orange-500/25 transition cursor-pointer w-full sm:w-auto text-center justify-center"
                            >
                                {processing ? '💾 Guardando Cambios...' : '💾 Guardar Información de Empresa'}
                            </PrimaryButton>
                        </div>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}

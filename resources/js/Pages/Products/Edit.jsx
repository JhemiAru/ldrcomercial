import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditProduct({ product, categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        category_id: product.category_id || '',
        sku: product.sku || '',
        short_description: product.short_description || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        wholesale_price: product.wholesale_price || '',
        min_wholesale_qty: product.min_wholesale_qty || '1',
        currency: product.currency || 'BOB',
        price_type: product.price_type || 'fixed',
        unit: product.unit || 'unidad',
        main_image: null,
        remove_main_image: false,
        in_stock: Boolean(product.in_stock),
        stock_quantity: product.stock_quantity ?? '',
        is_featured: Boolean(product.is_featured),
        status: product.status || 'published',
    });

    const [imageInputMode, setImageInputMode] = useState('file');
    const [imagePreview, setImagePreview] = useState(product.main_image || null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                main_image: file,
                remove_main_image: false,
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (val) => {
        setData((prev) => ({
            ...prev,
            main_image: val,
            remove_main_image: false,
        }));
        setImagePreview(val || null);
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            main_image: null,
            remove_main_image: true,
        }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link
                                href={route('products.index')}
                                className="text-xs font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                            >
                                ← Catálogo de Productos
                            </Link>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Modificar</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <span>✏️ Editar Producto: {product.name}</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Modifica precios, disponibilidad, imágenes o especificaciones comerciales.
                        </p>
                    </div>

                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-white/10 self-start sm:self-auto"
                    >
                        <span>✕ Cancelar</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Editar ${product.name} | LDR Comercial`} />

            <div className="py-6 max-w-5xl mx-auto space-y-6">
                
                {/* Alerta de Errores Generales */}
                {hasErrors && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300 rounded-2xl text-xs sm:text-sm shadow-xs">
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <span>⚠️ Por favor revisa los siguientes campos requeridos:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-red-700 dark:text-red-300/90 pl-1">
                            {Object.entries(errors).map(([field, msg]) => (
                                <li key={field}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 1: DETALLES BÁSICOS DEL PRODUCTO
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                                IDENTIFICACIÓN
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Información Básica & Rubro
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nombre del Producto */}
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="name" value="Nombre del Producto o Servicio *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm font-bold"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Ej. Taladro Percutor Industrial 850W"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Categoría */}
                            <div>
                                <InputLabel htmlFor="category_id" value="Categoría / Rubro Comercial *" />
                                <select
                                    id="category_id"
                                    required
                                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="text-slate-800">
                                            {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            {/* Código SKU o Modelo */}
                            <div>
                                <InputLabel htmlFor="sku" value="Código SKU / Modelo (Opcional)" />
                                <TextInput
                                    id="sku"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm font-mono"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    placeholder="Ej. TPI-850-BOSCH"
                                />
                                <InputError message={errors.sku} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 2: FOTOGRAFÍA DEL PRODUCTO
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                    FOTOGRAFÍA COMERCIAL
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                                    ⚡ Optimización WebP Automática
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Imagen Principal del Producto
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Si subes una nueva foto, se optimizará automáticamente a formato WebP ligero.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Vista Previa de la Imagen */}
                            <div className="relative group shrink-0">
                                <div className="w-36 h-36 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/20 p-1.5 shadow-md overflow-hidden flex items-center justify-center">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-white/5 flex flex-col items-center justify-center text-slate-400 text-center p-2">
                                            <span className="text-3xl mb-1">📸</span>
                                            <span className="text-[10px] font-bold uppercase">Sin Fotografía</span>
                                        </div>
                                    )}
                                </div>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                                        title="Quitar imagen"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Opciones de Carga */}
                            <div className="flex-1 space-y-3 w-full">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('file')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            imageInputMode === 'file'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        📁 Subir Archivo Nuevo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('url')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            imageInputMode === 'url'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        🔗 Cambiar por URL
                                    </button>
                                </div>

                                {imageInputMode === 'file' ? (
                                    <div className="space-y-1.5">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="main_image"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleFileChange}
                                            className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 dark:file:bg-white/10 file:text-white hover:file:bg-slate-800 cursor-pointer"
                                        />
                                        <p className="text-[11px] text-slate-400">
                                            Acepta JPG, PNG, WEBP de hasta 8MB.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <TextInput
                                            type="text"
                                            value={typeof data.main_image === 'string' ? data.main_image : ''}
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                            placeholder="https://ejemplo.com/imagenes/mi-producto.jpg"
                                            className="w-full text-xs"
                                        />
                                    </div>
                                )}
                                <InputError message={errors.main_image} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 3: PRECIOS & CONDICIONES B2B
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                ESQUEMA FINANCIERO
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Precios & Escala Mayorista B2B
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {/* Moneda */}
                            <div>
                                <InputLabel htmlFor="currency" value="Moneda *" />
                                <select
                                    id="currency"
                                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                >
                                    <option value="BOB" className="text-slate-800">BOB (Bolivianos - Bs)</option>
                                    <option value="USD" className="text-slate-800">USD (Dólares Americanos - $us)</option>
                                </select>
                                <InputError message={errors.currency} />
                            </div>

                            {/* Precio Regular */}
                            <div>
                                <InputLabel htmlFor="price" value="Precio Regular / Minorista *" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                                        {data.currency === 'USD' ? '$' : 'Bs'}
                                    </div>
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="pl-9 block w-full text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <InputError message={errors.price} />
                            </div>

                            {/* Precio Anterior / Referencia */}
                            <div>
                                <InputLabel htmlFor="original_price" value="Precio Anterior (Opcional)" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                                        {data.currency === 'USD' ? '$' : 'Bs'}
                                    </div>
                                    <TextInput
                                        id="original_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="pl-9 block w-full text-xs sm:text-sm text-slate-500"
                                        value={data.original_price}
                                        onChange={(e) => setData('original_price', e.target.value)}
                                        placeholder="Para mostrar % descuento"
                                    />
                                </div>
                                <InputError message={errors.original_price} />
                            </div>

                            {/* Unidad de Medida */}
                            <div>
                                <InputLabel htmlFor="unit" value="Unidad de Medida" />
                                <TextInput
                                    id="unit"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    placeholder="unidad, metro, caja, kg, bolsa"
                                />
                                <InputError message={errors.unit} />
                            </div>

                            {/* Precio Mayorista */}
                            <div>
                                <InputLabel htmlFor="wholesale_price" value="Precio Mayorista B2B (Opcional)" />
                                <div className="mt-1 relative rounded-xl shadow-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                                        {data.currency === 'USD' ? '$' : 'Bs'}
                                    </div>
                                    <TextInput
                                        id="wholesale_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="pl-9 block w-full text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400"
                                        value={data.wholesale_price}
                                        onChange={(e) => setData('wholesale_price', e.target.value)}
                                        placeholder="Precio especial por volumen"
                                    />
                                </div>
                                <InputError message={errors.wholesale_price} />
                            </div>

                            {/* Cantidad Mínima Mayorista */}
                            <div>
                                <InputLabel htmlFor="min_wholesale_qty" value="Cantidad Mínima para Mayorista" />
                                <TextInput
                                    id="min_wholesale_qty"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.min_wholesale_qty}
                                    onChange={(e) => setData('min_wholesale_qty', e.target.value)}
                                    placeholder="Ej. 10"
                                />
                                <InputError message={errors.min_wholesale_qty} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 4: DISPONIBILIDAD & ESTADO
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                LOGÍSTICA & ESTADO
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Disponibilidad, Stock & Visibilidad
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {/* Estado del Producto */}
                            <div>
                                <InputLabel htmlFor="status" value="Estado de Publicación *" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 font-bold"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="published" className="text-slate-800">🟢 Publicado (Visible en catálogo)</option>
                                    <option value="draft" className="text-slate-800">🟡 Borrador (Solo visible para mí)</option>
                                    <option value="archived" className="text-slate-800">⚪ Archivado (Oculto temporalmente)</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            {/* Stock numérico */}
                            <div>
                                <InputLabel htmlFor="stock_quantity" value="Unidades en Stock (Opcional)" />
                                <TextInput
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
                                    className="mt-1 block w-full text-xs sm:text-sm font-mono"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', e.target.value)}
                                    placeholder="Ej. 25"
                                />
                                <InputError message={errors.stock_quantity} />
                            </div>

                            {/* Casillas de verificación */}
                            <div className="space-y-3 pt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.in_stock}
                                        onChange={(e) => setData('in_stock', e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        ✓ En Stock para entrega inmediata
                                    </span>
                                </label>

                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        ⭐ Destacar en portada de mi empresa
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        SECCIÓN 5: DESCRIPCIÓN & ESPECIFICACIONES
                       ═══════════════════════════════════════════════ */}
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                DETALLES TÉCNICOS
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Ficha Técnica & Descripción Comercial
                            </h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <InputLabel htmlFor="short_description" value="Resumen Comercial Rápido (Máx. 500 caracteres)" />
                                <TextInput
                                    id="short_description"
                                    type="text"
                                    className="mt-1 block w-full text-xs sm:text-sm"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="Ej. Equipo certificado con 2 años de garantía de fábrica y soporte técnico."
                                />
                                <InputError message={errors.short_description} />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Descripción Detallada / Especificaciones Técnicas" />
                                <textarea
                                    id="description"
                                    rows="5"
                                    className="mt-1 block w-full rounded-2xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-xs text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 leading-relaxed"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe dimensiones, peso, compatibilidad, accesorios incluidos..."
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    {/* BOTÓN FLOTANTE / INFERIOR DE GUARDADO */}
                    <div className="sticky bottom-4 z-20 bg-white/90 dark:bg-[#0b132b]/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                            💡 Los cambios se actualizarán al instante en tu catálogo comercial.
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <Link
                                href={route('products.index')}
                                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                            >
                                Cancelar
                            </Link>

                            <PrimaryButton
                                disabled={processing}
                                className="px-7 py-3 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition cursor-pointer w-full sm:w-auto text-center justify-center"
                            >
                                {processing ? '💾 Guardando Cambios...' : '💾 Guardar Cambios del Producto'}
                            </PrimaryButton>
                        </div>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}

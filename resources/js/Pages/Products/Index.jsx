import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const fallbackImage = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Sin+Imagen';

export default function ProductIndex({ 
    hasCompany = false, 
    company = null, 
    products = { data: [] }, 
    categories = [],
    filters = {} 
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    
    // Modo de vista: 'grid' (cuadrados) o 'list' (lista compacta), persistente en localStorage
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ldr_products_view_mode') || 'grid';
        }
        return 'grid';
    });

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ldr_products_view_mode', mode);
        }
    };

    // Modal para confirmación de eliminación
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newFilters = {}) => {
        const query = {
            search: newFilters.search !== undefined ? newFilters.search : search,
            category: newFilters.category !== undefined ? newFilters.category : selectedCategory,
            status: newFilters.status !== undefined ? newFilters.status : selectedStatus,
        };

        // Eliminar vacíos
        Object.keys(query).forEach(key => {
            if (!query[key]) delete query[key];
        });

        router.get(route('products.index'), query, { 
            preserveState: true, 
            replace: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        applyFilters({ category: catId });
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        applyFilters({ status });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedStatus('');
        router.get(route('products.index'), {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = Boolean(search || selectedCategory || selectedStatus);

    const openDeleteModal = (product) => {
        setDeleteModal({ isOpen: true, product });
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setDeleteModal({ isOpen: false, product: null });
        }
    };

    const confirmDelete = () => {
        if (!deleteModal.product) return;
        setIsDeleting(true);
        router.delete(route('products.destroy', deleteModal.product.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                closeDeleteModal();
            },
        });
    };

    // Si aún no tiene empresa registrada
    if (!hasCompany) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        Catálogo de Productos & Precios
                    </h2>
                }
            >
                <Head title="Productos y Precios" />
                <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-[#0b132b] p-8 sm:p-12 rounded-3xl shadow-sm text-center border border-slate-200 dark:border-white/10">
                        <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
                            🏢
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            Registra tu Empresa Primero
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                            Para publicar productos y administrar tus listas de precios mayoristas o minoristas, primero debes completar los datos de tu empresa.
                        </p>
                        <Link
                            href={route('company.edit')}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition"
                        >
                            <span>Configurar Perfil de Empresa</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const totalProducts = products.total || (products.data ? products.data.length : 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                Catálogo B2B / B2C
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {company?.name}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>📦 Mis Productos & Precios</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                                {totalProducts}
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Administra tu catálogo de productos, existencias y precios mayoristas desde tu computadora o celular.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        {/* Botón para ver el catálogo público como lo ven los clientes */}
                        {company?.id && (
                            <a
                                href={route('companies.show', company.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-white/10"
                                title="Ver cómo ven los clientes tu catálogo en el portal público"
                            >
                                <span>👁️</span>
                                <span className="hidden sm:inline">Ver Mi Catálogo Público</span>
                                <span className="sm:hidden">Ver Público</span>
                            </a>
                        )}

                        {/* Botón Principal para crear nuevo producto */}
                        <Link
                            href={route('products.create')}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition flex-1 sm:flex-none cursor-pointer"
                        >
                            <span className="text-base font-bold">+</span>
                            <span>Publicar Producto</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Mis Productos y Precios | LDR Comercial" />

            <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* ═══════════════════════════════════════════════════════════════
                    BARRA DE HERRAMIENTAS: BUSCADOR, FILTROS Y SELECTOR DE VISTA
                ═══════════════════════════════════════════════════════════════ */}
                <div className="bg-white dark:bg-[#0b132b] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3.5 transition-colors">
                    
                    {/* Fila 1: Buscador + Selector de Modo Cuadrados/Lista */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        {/* Buscador */}
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
                            <div className="relative flex items-center">
                                <span className="absolute left-3.5 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    className="w-full text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition"
                                    placeholder="Buscar producto por nombre o código SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearch(''); applyFilters({ search: '' }); }}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                                        title="Borrar búsqueda"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Selector de Vista: Cuadros (Grid) vs Lista (List) */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => handleViewModeChange('grid')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                    title="Vista en Cuadrículas / Cuadros (Ideal para fotos)"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <rect width="7" height="7" x="3" y="3" rx="1" />
                                        <rect width="7" height="7" x="14" y="3" rx="1" />
                                        <rect width="7" height="7" x="14" y="14" rx="1" />
                                        <rect width="7" height="7" x="3" y="14" rx="1" />
                                    </svg>
                                    <span>Cuadros</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleViewModeChange('list')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                    title="Vista en Lista compacta (Ideal para inventario rápido)"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <line x1="8" x2="21" y1="6" y2="6" />
                                        <line x1="8" x2="21" y1="12" y2="12" />
                                        <line x1="8" x2="21" y1="18" y2="18" />
                                        <line x1="3" x2="3.01" y1="6" y2="6" strokeWidth="3" />
                                        <line x1="3" x2="3.01" y1="12" y2="12" strokeWidth="3" />
                                        <line x1="3" x2="3.01" y1="18" y2="18" strokeWidth="3" />
                                    </svg>
                                    <span>Lista</span>
                                </button>
                            </div>

                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium sm:hidden">
                                {products.data?.length || 0} items
                            </span>
                        </div>
                    </div>

                    {/* Fila 2: Filtro por Rubro y Estado de Stock */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-white/5 text-xs">
                        {/* Selector de Rubro */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold hidden sm:inline">Rubro:</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="text-xs rounded-xl py-1.5 pl-3 pr-7 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">🏢 Todos los Rubros</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selector de Estado */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold hidden sm:inline">Estado:</span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="text-xs rounded-xl py-1.5 pl-3 pr-7 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">📦 Todos los Estados</option>
                                <option value="in_stock">● En Stock</option>
                                <option value="out_of_stock">● Agotados / Bajo Pedido</option>
                                <option value="featured">★ Destacados</option>
                            </select>
                        </div>

                        {/* Botón para Limpiar Filtros */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline py-1 px-2 rounded-lg ml-auto sm:ml-0 flex items-center gap-1"
                            >
                                <span>✕</span>
                                <span>Limpiar filtros</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    LISTADO DE PRODUCTOS (GRID vs LIST)
                ═══════════════════════════════════════════════════════════════ */}
                {products.data?.length === 0 ? (
                    /* ESTADO VACÍO (EMPTY STATE) */
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-10 sm:p-16 text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                            🏷️
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">
                                {hasActiveFilters ? 'No se encontraron productos con estos filtros' : 'Aún no tienes productos publicados'}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                                {hasActiveFilters 
                                    ? 'Prueba modificando tu término de búsqueda o limpiando los filtros seleccionados.' 
                                    : 'Empieza publicando tu primer artículo con foto, precio individual y precio mayorista para vender por catálogo.'}
                            </p>
                        </div>
                        <div className="pt-2">
                            {hasActiveFilters ? (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl transition"
                                >
                                    Restablecer Búsqueda
                                </button>
                            ) : (
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl shadow-md transition"
                                >
                                    <span>+ Publicar Mi Primer Producto</span>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* ═══════════════════════════════════════════════════════════
                       VISTA 1: CUADROS (GRID DE TARJETAS OPTIMIZADO PARA MÓVIL)
                    ═══════════════════════════════════════════════════════════ */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {products.data.map((item) => {
                            const hasDiscount = item.original_price && Number(item.original_price) > Number(item.price);
                            const discountPercent = hasDiscount 
                                ? Math.round(((Number(item.original_price) - Number(item.price)) / Number(item.original_price)) * 100)
                                : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#0b132b] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col overflow-hidden group"
                                >
                                    {/* Cabecera / Imagen Cuadrada con badges */}
                                    <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                                        <img
                                            src={item.main_image || fallbackImage}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />

                                        {/* Badges Superpuestos */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                                            {item.category && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                                                    {item.category.name}
                                                </span>
                                            )}
                                            {item.is_featured && (
                                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-amber-400 text-amber-950 shadow-xs flex items-center gap-0.5">
                                                    <span>★</span>
                                                    <span>Destacado</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                                            {hasDiscount && (
                                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                                                    -{discountPercent}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Badge de Stock en la parte inferior de la foto */}
                                        <div className="absolute bottom-2.5 right-2.5">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur-xs shadow-xs ${
                                                item.in_stock 
                                                    ? 'bg-emerald-500/90 text-white' 
                                                    : 'bg-rose-500/90 text-white'
                                            }`}>
                                                {item.in_stock ? '● En Stock' : '● Agotado'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Información del Producto */}
                                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                                        <div>
                                            {item.sku && (
                                                <div className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                                    SKU: {item.sku}
                                                </div>
                                            )}
                                            <h3 
                                                className="font-black text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
                                                title={item.name}
                                            >
                                                {item.name}
                                            </h3>

                                            {item.short_description && (
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                                                    {item.short_description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bloque de Precios */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1">
                                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                                                    {item.currency} {Number(item.price).toFixed(2)}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    / {item.unit || 'unidad'}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        {item.currency} {Number(item.original_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Precio Mayorista B2B */}
                                            {item.wholesale_price ? (
                                                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg inline-block">
                                                    Mayorista: {item.currency} {Number(item.wholesale_price).toFixed(2)} 
                                                    <span className="text-slate-400 font-normal"> (min {item.min_wholesale_qty} {item.unit}s)</span>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-slate-400">
                                                    Sin precio mayorista configurado
                                                </div>
                                            )}
                                        </div>

                                        {/* Barra de Acciones Táctiles (Móvil-friendly) */}
                                        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
                                            {/* Editar */}
                                            <Link
                                                href={route('products.edit', item.id)}
                                                className="col-span-3 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                                                title="Editar datos y precios del producto"
                                            >
                                                <span>✏️</span>
                                                <span>Editar</span>
                                            </Link>

                                            {/* Ver Ficha Pública (Blade <a>) */}
                                            <a
                                                href={route('products.show', item.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="col-span-1 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center transition"
                                                title="Ver cómo lo ve el cliente en el catálogo"
                                            >
                                                👁️
                                            </a>

                                            {/* Eliminar */}
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(item)}
                                                className="col-span-1 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center transition"
                                                title="Eliminar este producto del catálogo"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ═══════════════════════════════════════════════════════════
                       VISTA 2: LISTA COMPACTA (IDEAL PARA INVENTARIO RÁPIDO)
                    ═══════════════════════════════════════════════════════════ */
                    <div className="space-y-2.5">
                        {products.data.map((item) => {
                            const hasDiscount = item.original_price && Number(item.original_price) > Number(item.price);
                            const discountPercent = hasDiscount 
                                ? Math.round(((Number(item.original_price) - Number(item.price)) / Number(item.original_price)) * 100)
                                : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200/90 dark:border-white/10 p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                                >
                                    {/* Miniatura + Datos */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 shrink-0 border border-slate-200 dark:border-white/10 relative">
                                            <img
                                                src={item.main_image || fallbackImage}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                            />
                                            {hasDiscount && (
                                                <span className="absolute bottom-1 right-1 text-[9px] font-black bg-rose-600 text-white px-1 rounded">
                                                    -{discountPercent}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {item.sku && (
                                                    <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                                        {item.sku}
                                                    </span>
                                                )}
                                                {item.category && (
                                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.2 rounded-full">
                                                        {item.category.name}
                                                    </span>
                                                )}
                                                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                                                    item.in_stock 
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                                }`}>
                                                    {item.in_stock ? '● En Stock' : '● Agotado'}
                                                </span>
                                            </div>

                                            <h4 
                                                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block mt-0.5"
                                                title={item.name}
                                            >
                                                {item.name}
                                            </h4>

                                            {/* Precios móvil */}
                                            <div className="flex items-baseline gap-2 mt-0.5 sm:hidden">
                                                <span className="font-black text-sm text-slate-900 dark:text-white font-mono">
                                                    {item.currency} {Number(item.price).toFixed(2)}
                                                </span>
                                                {item.wholesale_price && (
                                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                                        B2B: {item.currency} {Number(item.wholesale_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Precios (Desktop) + Acciones */}
                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-white/5">
                                        {/* Precios grandes para pantallas medianas/grandes */}
                                        <div className="hidden sm:block text-right">
                                            <div className="flex items-baseline justify-end gap-1.5">
                                                <span className="font-black text-base text-slate-900 dark:text-white font-mono">
                                                    {item.currency} {Number(item.price).toFixed(2)}
                                                </span>
                                                <span className="text-[10px] text-slate-400">/ {item.unit || 'ud'}</span>
                                            </div>
                                            {item.wholesale_price && (
                                                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                    Mayorista: {item.currency} {Number(item.wholesale_price).toFixed(2)} (min {item.min_wholesale_qty})
                                                </div>
                                            )}
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                                            <Link
                                                href={route('products.edit', item.id)}
                                                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 font-bold text-xs flex items-center gap-1 transition shadow-xs"
                                                title="Editar producto"
                                            >
                                                <span>✏️</span>
                                                <span className="hidden sm:inline">Editar</span>
                                            </Link>

                                            <a
                                                href={route('products.show', item.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center transition"
                                                title="Ver ficha pública"
                                            >
                                                👁️
                                            </a>

                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(item)}
                                                className="p-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center transition"
                                                title="Eliminar producto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    PAGINACIÓN
                ═══════════════════════════════════════════════════════════════ */}
                {products.links && products.links.length > 3 && (
                    <div className="mt-8 flex justify-center flex-wrap gap-1.5">
                        {products.links.map((link, i) => (
                            <Link 
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition ${
                                    link.active 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                        : 'bg-white dark:bg-[#0b132b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500'
                                } ${!link.url ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                BOTÓN FLOTANTE (FAB) PARA SUBIR PRODUCTOS RÁPIDO DESDE CELULAR
            ═══════════════════════════════════════════════════════════════ */}
            <div className="fixed bottom-6 right-5 z-40 sm:hidden">
                <Link
                    href={route('products.create')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-4 py-3 rounded-full shadow-2xl transition transform border-2 border-white/20"
                    title="Publicar nuevo producto desde tu teléfono"
                >
                    <span className="text-base leading-none">+</span>
                    <span>Subir Producto</span>
                </Link>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
            ═══════════════════════════════════════════════════════════════ */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mx-auto">
                            🗑️
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                ¿Eliminar este producto?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Esta acción quitará <strong className="text-slate-800 dark:text-white">"{deleteModal.product?.name}"</strong> de tu catálogo público de manera permanente.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                            >
                                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

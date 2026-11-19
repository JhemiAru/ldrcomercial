import React from 'react';
import { Link } from '@inertiajs/react';
import { fallbackImage } from '../../Welcome/Partials/WelcomeUtils';

export default function CompanyCatalog({
    company,
    products,
    filteredProducts,
    companyCategories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    getProductQuoteWhatsAppUrl,
    onShareProduct,
}) {
    return (
        <div className="space-y-8" id="catalogo">
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
                                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
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
                                className="text-blue-600 hover:underline font-bold cursor-pointer"
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
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    {prod.brand && (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                                            🏷️ {prod.brand.name}
                                                        </span>
                                                    )}
                                                    {prod.weight && (
                                                        <span className="text-[9px] text-slate-500 font-semibold">
                                                            ⚖️ {prod.weight} {prod.weight_unit || 'kg'}
                                                        </span>
                                                    )}
                                                    {prod.sku && (
                                                        <span className="font-mono text-[9px] text-slate-400 font-semibold">
                                                            SKU: {prod.sku}
                                                        </span>
                                                    )}
                                                </div>
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
                                                        onClick={() => onShareProduct(prod)}
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
                                                    {prod.brand && (
                                                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                                                            🏷️ {prod.brand.name}
                                                        </span>
                                                    )}
                                                    {prod.weight && (
                                                        <span className="text-[10px] font-semibold text-slate-500">
                                                            ⚖️ {prod.weight} {prod.weight_unit || 'kg'}
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
                                                    onClick={() => onShareProduct(prod)}
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
        </div>
    );
}

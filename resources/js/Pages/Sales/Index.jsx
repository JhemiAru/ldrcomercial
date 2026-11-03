import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DocumentPreviewModal from './Partials/DocumentPreviewModal';
import NewDocumentModal from './Partials/NewDocumentModal';
import {
    formatMoneyBs,
    getStatusBadge,
    calculateDocumentTotals,
    generateWhatsAppShareUrl,
} from './Partials/salesUtils';

export default function SalesIndex({
    hasCompany = true,
    company = null,
    catalogProducts = [],
    initialQuotes = [],
    initialSales = [],
}) {
    const { flash } = usePage().props;

    const [quotes, setQuotes] = useState(initialQuotes);
    const [sales, setSales] = useState(initialSales);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'quotes' | 'sales'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sincronizar estado local cuando las props de Inertia se actualicen desde MySQL
    useEffect(() => {
        setQuotes(initialQuotes);
    }, [initialQuotes]);

    useEffect(() => {
        setSales(initialSales);
    }, [initialSales]);

    // Estado del Modal de Vista Previa Oficial
    const [previewDoc, setPreviewDoc] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Estado del Modal de Nuevo Documento
    const [isNewDocOpen, setIsNewDocOpen] = useState(false);

    // Si la empresa no está configurada, mostrar banner informativo
    if (!hasCompany) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        Ventas y Cotizaciones
                    </h2>
                }
            >
                <Head title="Ventas y Cotizaciones" />
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-[#0b132b] p-8 rounded-3xl shadow-sm text-center border border-slate-200 dark:border-white/10">
                            <div className="text-5xl mb-4">🏢</div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Configura tu Empresa Primero
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                                Para emitir cotizaciones membretadas, notas de venta y vistas previas comerciales con NIT y datos oficiales, primero debes completar el perfil de tu empresa.
                            </p>
                            <Link
                                href={route('company.edit')}
                                className="mt-6 inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/20 transition"
                            >
                                Configurar Perfil de Empresa →
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Unir lista de documentos según la pestaña activa
    const allDocuments = [
        ...quotes.map((q) => ({ ...q, doc_type: 'quotation' })),
        ...sales.map((s) => ({ ...s, doc_type: 'sale' })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const displayedDocs = allDocuments.filter((doc) => {
        // Filtro por pestaña
        if (activeTab === 'quotes' && doc.doc_type !== 'quotation') return false;
        if (activeTab === 'sales' && doc.doc_type !== 'sale') return false;

        // Filtro por estado
        if (statusFilter !== 'all' && doc.status !== statusFilter) return false;

        // Filtro por texto
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchId = (doc.doc_number || doc.id || '').toLowerCase().includes(query);
            const matchClient = (doc.client_name || '').toLowerCase().includes(query);
            const matchNit = (doc.client_nit || '').includes(query);
            const matchCity = (doc.client_city || '').toLowerCase().includes(query);
            const matchItem = doc.items.some((it) => (it.name || '').toLowerCase().includes(query));
            return matchId || matchClient || matchNit || matchCity || matchItem;
        }

        return true;
    });

    // Cálculos de KPIs financieros
    const totalSalesAmount = sales.reduce((acc, s) => {
        const { grandTotal } = calculateDocumentTotals(s.items, false);
        return acc + grandTotal;
    }, 0);

    const totalQuotesAmount = quotes.reduce((acc, q) => {
        const { grandTotal } = calculateDocumentTotals(q.items, false);
        return acc + grandTotal;
    }, 0);

    const approvedQuotesCount = quotes.filter((q) => q.status === 'approved' || q.status === 'converted').length;
    const approvalRate = quotes.length > 0 ? Math.round((approvedQuotesCount / quotes.length) * 100) : 0;

    // Manejador para abrir vista previa
    const handleOpenPreview = (doc) => {
        setPreviewDoc(doc);
        setIsPreviewOpen(true);
    };

    // Manejador para convertir cotización a venta persistente en MySQL
    const handleConvertToSale = (quoteIdentifier) => {
        if (!confirm(`¿Deseas convertir la cotización ${quoteIdentifier} en una venta oficial concretada? Se creará una nota de venta en MySQL.`)) {
            return;
        }

        router.post(
            route('sales.convert', quoteIdentifier),
            {},
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Si el modal de vista previa estaba abierto, actualizarlo
                    if (previewDoc && (previewDoc.id === quoteIdentifier || previewDoc.doc_number === quoteIdentifier)) {
                        setPreviewDoc((prev) => ({
                            ...prev,
                            doc_type: 'sale',
                            status: 'completed',
                            id: prev.id.replace('COT', 'VEN'),
                        }));
                    }
                },
                onError: () => {
                    alert('No se pudo convertir la cotización a venta.');
                },
            }
        );
    };

    // Manejador para crear un nuevo documento en la base de datos
    const handleCreateDocument = (payload, openPreviewImmediately = false) => {
        setIsSubmitting(true);
        router.post(route('sales.store'), payload, {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsSubmitting(false);
                setIsNewDocOpen(false);

                if (openPreviewImmediately) {
                    const isQuote = payload.doc_type === 'quotation';
                    const list = isQuote ? page.props.initialQuotes : page.props.initialSales;
                    if (list && list.length > 0) {
                        handleOpenPreview(list[0]);
                    }
                }
            },
            onError: (errors) => {
                setIsSubmitting(false);
                const errStr = Object.values(errors).join('\n');
                alert(`Error al registrar documento:\n${errStr}`);
            },
        });
    };

    // Eliminar documento de MySQL
    const handleDeleteDocument = (identifier) => {
        if (confirm(`¿Estás seguro de eliminar el registro #${identifier} de la base de datos? Esta acción eliminará permanentemente el documento y sus partidas.`)) {
            router.delete(route('sales.destroy', identifier), {
                preserveScroll: true,
                onError: () => {
                    alert('No se pudo eliminar el documento de la base de datos.');
                },
            });
        }
    };

    // Actualizar estado del documento
    const handleStatusChange = (identifier, newStatus) => {
        router.patch(
            route('sales.status', identifier),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Ventas y Cotizaciones
                            </h1>
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                                Sistema Financiero MySQL
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Gestión comercial, proformas B2B, notas de venta y flujo de caja para <strong className="text-slate-700 dark:text-slate-200">{company?.name || 'tu negocio'}</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Botón Vista Previa Rápida del primer documento disponible */}
                        {allDocuments.length > 0 && (
                            <button
                                type="button"
                                onClick={() => handleOpenPreview(allDocuments[0])}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition shadow-xs"
                                title="Ver vista previa oficial del último documento"
                            >
                                <span>👁️</span>
                                <span>Vista Previa Reciente</span>
                            </button>
                        )}

                        {/* Botón Crear Nuevo Documento */}
                        <button
                            type="button"
                            onClick={() => setIsNewDocOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition"
                        >
                            <span>+</span>
                            <span>Nueva Cotización / Venta</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Ventas y Cotizaciones - LDR Comercial" />

            <div className="py-8 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mensaje Flash de Notificación */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    METRICS & KPIS COMERCIALES (BOLIVIA)
                   ═══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1: Ventas Concretadas */}
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Ventas Concretadas</span>
                            <span className="text-xl">💰</span>
                        </div>
                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {formatMoneyBs(totalSalesAmount)}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>✓</span>
                            <span>{sales.length} órdenes facturadas / entregadas</span>
                        </div>
                    </div>

                    {/* KPI 2: Cotizaciones Activas */}
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">En Negociación</span>
                            <span className="text-xl">📋</span>
                        </div>
                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {formatMoneyBs(totalQuotesAmount)}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                            <span>⚡</span>
                            <span>{quotes.length} cotizaciones / proformas abiertas</span>
                        </div>
                    </div>

                    {/* KPI 3: Tasa de Aprobación */}
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Efectividad de Cierre</span>
                            <span className="text-xl">📈</span>
                        </div>
                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {approvalRate}%
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-orange-600 dark:text-orange-400 font-bold">
                            <span>🎯</span>
                            <span>{approvedQuotesCount} cotizaciones ganadas</span>
                        </div>
                    </div>

                    {/* KPI 4: Catálogo Vinculado */}
                    <div className="bg-white dark:bg-[#0b132b] p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Catálogo Activo</span>
                            <span className="text-xl">📦</span>
                        </div>
                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {catalogProducts.length} Ítems
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Link href={route('products.index')} className="text-orange-500 hover:underline font-bold">
                                Gestionar precios y stock →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    PESTAÑAS DE NAVEGACIÓN Y BARRA DE BÚSQUEDA
                   ═══════════════════════════════════════════════ */}
                <div className="bg-white dark:bg-[#0b132b] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-white/5 shadow-xs transition-colors space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                                    activeTab === 'all'
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Todas ({allDocuments.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('quotes')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeTab === 'quotes'
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>📋</span>
                                <span>Cotizaciones ({quotes.length})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('sales')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeTab === 'sales'
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>🧾</span>
                                <span>Ventas Directas ({sales.length})</span>
                            </button>
                        </div>

                        {/* Buscador y Filtro por Estado */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Buscar por cliente, folio o NIT..."
                                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                            </div>

                            <select
                                className="text-xs py-2 px-3 rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Todos los estados</option>
                                <option value="approved">Aprobada</option>
                                <option value="sent">Enviada</option>
                                <option value="draft">Borrador</option>
                                <option value="completed">Venta Concretada</option>
                                <option value="pending_payment">Pendiente de Pago</option>
                            </select>

                            {(searchQuery || statusFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                    }}
                                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white underline px-1"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        TABLA DE DOCUMENTOS COMERCIALES
                       ═══════════════════════════════════════════════ */}
                    {displayedDocs.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-white/5">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/90 dark:border-white/5">
                                    <tr>
                                        <th className="px-5 py-3">Documento & Tipo</th>
                                        <th className="px-5 py-3">Cliente / Razón Social</th>
                                        <th className="px-5 py-3">Fecha & Validez</th>
                                        <th className="px-5 py-3">Ítems</th>
                                        <th className="px-5 py-3">Total (Bs.)</th>
                                        <th className="px-5 py-3">Estado</th>
                                        <th className="px-5 py-3 text-right">Acción Oficial</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                                    {displayedDocs.map((doc) => {
                                        const isQuotation = doc.doc_type === 'quotation';
                                        const { grandTotal } = calculateDocumentTotals(doc.items, false);
                                        const badge = getStatusBadge(doc.status, doc.doc_type);
                                        const docIdentifier = doc.doc_number || doc.id;

                                        return (
                                            <tr
                                                key={docIdentifier}
                                                className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition"
                                            >
                                                {/* Folio y Tipo */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base shrink-0">
                                                            {isQuotation ? '📋' : '🧾'}
                                                        </span>
                                                        <div>
                                                            <div className="font-mono font-black text-slate-900 dark:text-white">
                                                                {docIdentifier}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold">
                                                                {isQuotation ? 'Cotización B2B' : 'Nota de Venta'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Cliente */}
                                                <td className="px-5 py-3.5">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {doc.client_name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                        {doc.client_nit && <span>NIT: {doc.client_nit}</span>}
                                                        {doc.client_city && <span>• 📍 {doc.client_city}</span>}
                                                    </div>
                                                </td>

                                                {/* Fechas */}
                                                <td className="px-5 py-3.5">
                                                    <div className="text-slate-900 dark:text-white font-mono text-[11px]">
                                                        {doc.date}
                                                    </div>
                                                    {isQuotation && doc.due_date && (
                                                        <div className="text-[10px] text-orange-600 dark:text-orange-400">
                                                            Vence: {doc.due_date}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Ítems */}
                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-white/10 font-bold text-slate-700 dark:text-slate-300">
                                                        {doc.items.length} {doc.items.length === 1 ? 'ítem' : 'ítems'}
                                                    </span>
                                                </td>

                                                {/* Total */}
                                                <td className="px-5 py-3.5">
                                                    <div className="font-mono font-black text-slate-900 dark:text-white text-sm">
                                                        Bs. {grandTotal.toFixed(2)}
                                                    </div>
                                                </td>

                                                {/* Estado con Selector Rápido */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Botones de Acción */}
                                                <td className="px-5 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* CONVERTIR A VENTA DIRECTA (Si es cotización pendiente) */}
                                                        {isQuotation && doc.status !== 'approved' && doc.status !== 'converted' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleConvertToSale(docIdentifier)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                                                                title="Convertir esta cotización en una venta oficial cerrada"
                                                            >
                                                                <span>⚡</span>
                                                                <span>Vender</span>
                                                            </button>
                                                        )}

                                                        {/* BOTÓN PROMINENTE DE VISTA PREVIA */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenPreview(doc)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-xs transition"
                                                            title="Abrir vista previa oficial, membretada y lista para imprimir o exportar"
                                                        >
                                                            <span>👁️</span>
                                                            <span>Vista Previa</span>
                                                        </button>

                                                        {/* WhatsApp */}
                                                        <a
                                                            href={generateWhatsAppShareUrl(doc, company)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                                                            title="Compartir por WhatsApp"
                                                        >
                                                            💬
                                                        </a>

                                                        {/* Eliminar de MySQL */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteDocument(docIdentifier)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                                            title="Eliminar de la base de datos"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                            <span className="text-4xl">🔍</span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-3">
                                No se encontraron documentos
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                No hay cotizaciones o ventas que coincidan con los filtros aplicados en la base de datos.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsNewDocOpen(true)}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition"
                            >
                                + Crear Nuevo Documento
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                MODAL DE VISTA PREVIA OFICIAL MEMBRETADA
               ═══════════════════════════════════════════════ */}
            <DocumentPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                document={previewDoc}
                company={company}
                onConvertToSale={handleConvertToSale}
            />

            {/* ═══════════════════════════════════════════════
                MODAL DE NUEVO DOCUMENTO (CREADOR INTERACTIVO)
               ═══════════════════════════════════════════════ */}
            <NewDocumentModal
                isOpen={isNewDocOpen}
                onClose={() => setIsNewDocOpen(false)}
                catalogProducts={catalogProducts}
                company={company}
                onCreateDocument={handleCreateDocument}
                isSubmitting={isSubmitting}
            />
        </AuthenticatedLayout>
    );
}

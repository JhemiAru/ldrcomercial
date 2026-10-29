import React, { useState } from 'react';
import { calculateDocumentTotals } from './salesUtils';

const BOLIVIAN_CITIES = [
    'La Paz',
    'Santa Cruz de la Sierra',
    'Cochabamba',
    'El Alto',
    'Oruro',
    'Sucre',
    'Tarija',
    'Potosí',
    'Trinidad (Beni)',
    'Cobija (Pando)',
];

export default function NewDocumentModal({
    isOpen,
    onClose,
    catalogProducts = [],
    company,
    onCreateDocument,
}) {
    if (!isOpen) return null;

    const [docType, setDocType] = useState('quotation'); // 'quotation' | 'sale'
    const [clientName, setClientName] = useState('');
    const [clientNit, setClientNit] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientCity, setClientCity] = useState(company?.city || 'La Paz');
    const [clientAddress, setClientAddress] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('Pago al Contado / QR Simple');
    const [deliveryTime, setDeliveryTime] = useState('Inmediata / En 24 horas');
    const [notes, setNotes] = useState('Precios en Bolivianos (Bs.). Sujeto a stock disponible.');

    // Líneas de productos
    const [items, setItems] = useState([
        {
            id: Date.now(),
            name: catalogProducts[0]?.name || 'Producto / Servicio Comercial',
            sku: catalogProducts[0]?.sku || 'PROD-01',
            unit: catalogProducts[0]?.unit || 'Pza',
            quantity: 1,
            price: Number(catalogProducts[0]?.price) || 150.0,
            discount: 0,
        },
    ]);

    // Agregar nueva fila de producto
    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: Date.now() + Math.random(),
                name: '',
                sku: '',
                unit: 'Pza',
                quantity: 1,
                price: 0,
                discount: 0,
            },
        ]);
    };

    // Modificar fila
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    // Selección desde catálogo
    const handleSelectCatalogProduct = (index, productId) => {
        const prod = catalogProducts.find((p) => String(p.id) === String(productId));
        if (prod) {
            const newItems = [...items];
            newItems[index] = {
                ...newItems[index],
                name: prod.name,
                sku: prod.sku || '',
                unit: prod.unit || 'Pza',
                price: Number(prod.price) || 0,
            };
            setItems(newItems);
        }
    };

    // Eliminar fila
    const handleRemoveItem = (index) => {
        if (items.length === 1) {
            alert('El documento debe contener al menos 1 producto o servicio.');
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const totals = calculateDocumentTotals(items, false);

    // Enviar y generar
    const handleSubmit = (openPreviewImmediately = false) => {
        if (!clientName.trim()) {
            alert('Por favor introduce el nombre o razón social del cliente.');
            return;
        }

        const prefix = docType === 'quotation' ? 'COT' : 'VEN';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const currentYear = new Date().getFullYear();
        const docId = `${prefix}-${currentYear}-${randomNum}`;

        const today = new Date().toISOString().split('T')[0];
        const due = new Date();
        due.setDate(due.getDate() + 15);
        const dueDate = due.toISOString().split('T')[0];

        const newDoc = {
            id: docId,
            doc_type: docType,
            title: docType === 'quotation' ? `Cotización para ${clientName}` : `Nota de Venta para ${clientName}`,
            client_name: clientName,
            client_nit: clientNit,
            client_phone: clientPhone,
            client_email: clientEmail,
            client_city: clientCity,
            client_address: clientAddress,
            date: today,
            due_date: docType === 'quotation' ? dueDate : today,
            status: docType === 'quotation' ? 'sent' : 'completed',
            payment_terms: paymentTerms,
            delivery_time: deliveryTime,
            validity_days: 15,
            notes: notes,
            items: items.map((it) => ({
                id: it.id,
                name: it.name || 'Ítem General',
                sku: it.sku || '',
                unit: it.unit || 'Pza',
                quantity: Number(it.quantity) || 1,
                price: Number(it.price) || 0,
                discount: Number(it.discount) || 0,
            })),
        };

        onCreateDocument(newDoc, openPreviewImmediately);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-3xl bg-white dark:bg-[#0b132b] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header Modal */}
                <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
                            <span>⚡</span>
                            <span>Crear Nuevo Documento Comercial</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Elige el tipo de documento, añade cliente e ítems y genera la vista previa oficial
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center justify-center font-bold text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
                    {/* TIPO DE DOCUMENTO */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Tipo de Operación Comercial:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setDocType('quotation')}
                                className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition ${
                                    docType === 'quotation'
                                        ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/20'
                                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <span className="text-2xl">📋</span>
                                <div>
                                    <div className="font-black text-slate-900 dark:text-white text-sm">
                                        Cotización / Proforma
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        Propuesta económica con validez de días, ideal para clientes y compras B2B
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDocType('sale')}
                                className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition ${
                                    docType === 'sale'
                                        ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/20'
                                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <span className="text-2xl">🧾</span>
                                <div>
                                    <div className="font-black text-slate-900 dark:text-white text-sm">
                                        Nota de Venta Directa
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        Registro de venta cerrada, orden de despacho o recibo para entrega
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* DATOS DEL CLIENTE */}
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                        <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span>👤</span> Información del Cliente
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    Cliente / Razón Social *
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Ej. Distribuidora Santa Cruz S.R.L."
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    NIT / CI
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Ej. 1029384019"
                                    value={clientNit}
                                    onChange={(e) => setClientNit(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    Teléfono / WhatsApp
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Ej. 71234567"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    Ciudad (Bolivia)
                                </label>
                                <select
                                    className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500"
                                    value={clientCity}
                                    onChange={(e) => setClientCity(e.target.value)}
                                >
                                    {BOLIVIAN_CITIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCTOS E ÍTEMS */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                                <span>📦</span> Productos y Servicios ({items.length})
                            </div>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-500/20 transition flex items-center gap-1"
                            >
                                <span>+</span> Añadir Ítem
                            </button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => {
                                const lineSubtotal = (Number(item.quantity) || 0) * (Number(item.price) || 0) * (1 - (Number(item.discount) || 0) / 100);

                                return (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-3"
                                    >
                                        <div className="w-full md:flex-1 space-y-1">
                                            {/* Selector rápido desde catálogo si hay productos */}
                                            {catalogProducts.length > 0 && (
                                                <div className="mb-1">
                                                    <select
                                                        className="w-full text-[11px] py-1 px-2 rounded-lg border-slate-300 bg-white text-slate-900"
                                                        onChange={(e) => handleSelectCatalogProduct(index, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Seleccionar de mi catálogo...</option>
                                                        {catalogProducts.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} - Bs. {Number(p.price).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                className="w-full text-xs font-bold rounded-lg border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                                                placeholder="Nombre o descripción del producto"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 w-full md:w-auto shrink-0">
                                            <div>
                                                <label className="text-[10px] text-slate-500 block mb-0.5">Cant.</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-16 text-xs text-center font-bold rounded-lg border-slate-300 bg-white text-slate-900"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-slate-500 block mb-0.5">Precio (Bs.)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="w-24 text-xs font-bold rounded-lg border-slate-300 bg-white text-slate-900"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-slate-500 block mb-0.5">Desc. %</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-16 text-xs text-center rounded-lg border-slate-300 bg-white text-slate-900"
                                                    value={item.discount}
                                                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                                />
                                            </div>

                                            <div className="text-right">
                                                <label className="text-[10px] text-slate-500 block mb-0.5">Subtotal</label>
                                                <div className="text-xs font-black font-mono pt-1 text-slate-900 dark:text-white">
                                                    Bs. {lineSubtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="w-7 h-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                                            title="Eliminar ítem"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TOTAL PREVIEW */}
                        <div className="p-3.5 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-200 dark:border-orange-500/20 flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-white">
                                Total Calculado:
                            </span>
                            <span className="font-black font-mono text-base text-orange-600 dark:text-orange-400">
                                Bs. {totals.grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* CONDICIONES DE PAGO Y NOTAS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Términos / Forma de Pago
                            </label>
                            <input
                                type="text"
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500"
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Tiempo de Entrega
                            </label>
                            <input
                                type="text"
                                className="w-full text-xs rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500"
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition"
                    >
                        Cancelar
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            className="px-4 py-2 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                        >
                            Guardar en Lista
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSubmit(true)}
                            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
                        >
                            <span>👁️</span>
                            <span>Guardar y Ver Vista Previa Oficial</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


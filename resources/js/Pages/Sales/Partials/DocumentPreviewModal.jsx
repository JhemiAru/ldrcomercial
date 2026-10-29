import React, { useState, useRef } from 'react';
import {
    formatMoneyBs,
    numberToBolivianosWords,
    calculateDocumentTotals,
    getStatusBadge,
    generateWhatsAppShareUrl,
} from './salesUtils';

export default function DocumentPreviewModal({
    isOpen,
    onClose,
    document: initialDoc,
    company,
    onConvertToSale,
}) {
    if (!isOpen || !initialDoc) return null;

    const [doc, setDoc] = useState(initialDoc);
    const [withTax, setWithTax] = useState(false); // 13% IVA Bolivia
    const [templateTheme, setTemplateTheme] = useState('modern'); // 'modern' | 'classic' | 'receipt'
    const [copiedNotification, setCopiedNotification] = useState(false);

    const totals = calculateDocumentTotals(doc.items, withTax);
    const badge = getStatusBadge(doc.status, doc.doc_type);
    const isQuotation = doc.doc_type === 'quotation';

    // Manejador de Impresión
    const handlePrint = () => {
        window.print();
    };

    // Copiar resumen de la cotización/venta
    const handleCopySummary = () => {
        const text = `DOCUMENTO: ${isQuotation ? 'COTIZACIÓN' : 'NOTA DE VENTA'} #${doc.id}\nCLIENTE: ${doc.client_name} (NIT/CI: ${doc.client_nit || 'S/N'})\nTOTAL: Bs. ${totals.grandTotal.toFixed(2)}\nFECHA: ${doc.date}`;
        navigator.clipboard.writeText(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
    };

    // Compartir por WhatsApp
    const handleWhatsAppShare = () => {
        const url = generateWhatsAppShareUrl({ ...doc, with_tax: withTax }, company);
        window.open(url, '_blank');
    };

    // Convertir de Cotización a Venta
    const handleConvert = () => {
        if (onConvertToSale) {
            onConvertToSale(doc.id);
            setDoc((prev) => ({
                ...prev,
                doc_type: 'sale',
                id: prev.id.replace('COT', 'VEN'),
                status: 'completed',
            }));
        }
    };

    const companyName = company?.name || 'Mi Negocio Comercial';
    const companyLegal = company?.legal_name || companyName;
    const companyNit = company?.tax_id || '1029384029';
    const companyCity = company?.city || 'La Paz';
    const companyAddress = company?.address || 'Av. Principal #100, Zona Central';
    const companyPhone = company?.phone || company?.whatsapp || '+591 2 2440000';
    const companyEmail = company?.email || 'contacto@empresa.bo';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto">
            {/* ESTILOS CSS EXCLUSIVOS PARA IMPRESIÓN Y PDF */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-document-sheet, #printable-document-sheet * {
                        visibility: visible;
                    }
                    #printable-document-sheet {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 20mm !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: white !important;
                        color: #000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="relative w-full max-w-4xl bg-white dark:bg-[#0b132b] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
                {/* ═══════════════════════════════════════════════
                    BARRA SUPERIOR DE ACCIONES Y CONTROLES (NO PRINT)
                   ═══════════════════════════════════════════════ */}
                <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl shrink-0">
                            {isQuotation ? '📋' : '🧾'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-900 dark:text-white text-base">
                                    Vista Previa de {isQuotation ? 'Cotización' : 'Nota de Venta'}
                                </h3>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                                    {badge.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Folio: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{doc.id}</span> • Formato oficial listo para PDF o impresión
                            </p>
                        </div>
                    </div>

                    {/* Controles de Configuración Rápida */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Selector de Impuesto / IVA Bolivia */}
                        <button
                            type="button"
                            onClick={() => setWithTax(!withTax)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                                withTax
                                    ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-100'
                            }`}
                            title="Desglosar el 13% de IVA oficial boliviano en la factura/proforma"
                        >
                            {withTax ? '✓ Con Factura (IVA 13%)' : '+ Aplicar IVA (13%)'}
                        </button>

                        {/* Botón WhatsApp */}
                        <button
                            type="button"
                            onClick={handleWhatsAppShare}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                        >
                            <span>💬</span>
                            <span>WhatsApp</span>
                        </button>

                        {/* Botón Imprimir / PDF */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg shadow-sm transition"
                        >
                            <span>🖨️</span>
                            <span>Imprimir / PDF</span>
                        </button>

                        {/* Convertir a Venta (si es cotización) */}
                        {isQuotation && (
                            <button
                                type="button"
                                onClick={handleConvert}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
                            >
                                <span>⚡</span>
                                <span>Convertir a Venta</span>
                            </button>
                        )}

                        {/* Botón Cerrar */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center justify-center font-bold text-sm transition"
                            aria-label="Cerrar modal"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    CUERPO DEL DOCUMENTO (HOJA MEMBRETADA A4 / CARTA)
                   ═══════════════════════════════════════════════ */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-[#060a16] flex justify-center print:bg-white print:p-0 print:overflow-visible">
                    <div
                        id="printable-document-sheet"
                        className="w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200/80 print:shadow-none print:border-none print:p-0 print:rounded-none transition-all duration-150"
                        style={{ minHeight: '1050px' }}
                    >
                        {/* ENCABEZADO: DATOS DE LA EMPRESA & FOLIO */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
                            <div className="flex items-start gap-4">
                                {company?.logo ? (
                                    <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                                        <img src={company.logo} alt={companyName} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-orange-500 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        {companyName.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                                        {companyName}
                                    </h1>
                                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                        {companyLegal}
                                    </p>
                                    <div className="mt-2 text-[11px] text-slate-500 space-y-0.5 leading-tight">
                                        <p><strong className="text-slate-700">NIT:</strong> {companyNit} • Bolivia</p>
                                        <p><strong className="text-slate-700">Dirección:</strong> {companyAddress}, {companyCity}</p>
                                        <p><strong className="text-slate-700">Teléfono:</strong> {companyPhone} • <strong className="text-slate-700">Email:</strong> {companyEmail}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CAJA DEL DOCUMENTO */}
                            <div className="w-full sm:w-64 bg-slate-50 border-2 border-slate-900 rounded-xl p-4 text-center shrink-0">
                                <div className="text-[10px] font-black tracking-widest text-orange-600 uppercase">
                                    DOCUMENTO COMERCIAL
                                </div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-0.5">
                                    {isQuotation ? 'Proforma / Cotización' : 'Nota de Venta'}
                                </h2>
                                <div className="font-mono text-base font-black text-slate-800 bg-white border border-slate-200 py-1 px-2 rounded-lg mt-2">
                                    {doc.id}
                                </div>
                                <div className="mt-2.5 text-left text-[11px] space-y-1 text-slate-600 border-t border-slate-200 pt-2">
                                    <div className="flex justify-between">
                                        <span>Fecha Emisión:</span>
                                        <strong className="text-slate-800 font-mono">{doc.date}</strong>
                                    </div>
                                    {isQuotation && (
                                        <div className="flex justify-between">
                                            <span>Válido Hasta:</span>
                                            <strong className="text-orange-600 font-mono">{doc.due_date || '15 días'}</strong>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Moneda:</span>
                                        <strong className="text-slate-800">Bolivianos (Bs.)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN CLIENTE Y CONDICIONES COMERCIALES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                                    SEÑOR(ES) / DATOS DEL CLIENTE:
                                </h4>
                                <div className="space-y-1 text-slate-700">
                                    <p className="text-sm font-black text-slate-900">{doc.client_name}</p>
                                    <p><strong className="text-slate-600">NIT / C.I.:</strong> {doc.client_nit || 'Sin Número / Consumidor Final'}</p>
                                    <p><strong className="text-slate-600">Teléfono / WhatsApp:</strong> {doc.client_phone || 'N/D'}</p>
                                    <p><strong className="text-slate-600">Email:</strong> {doc.client_email || 'N/D'}</p>
                                    <p><strong className="text-slate-600">Ciudad:</strong> {doc.client_city || companyCity}</p>
                                </div>
                            </div>

                            <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                                    CONDICIONES DE LA OPERACIÓN:
                                </h4>
                                <div className="space-y-1 text-slate-700">
                                    <p><strong className="text-slate-600">Forma de Pago:</strong> {doc.payment_terms || 'Contado / QR'}</p>
                                    <p><strong className="text-slate-600">Tiempo de Entrega:</strong> {doc.delivery_time || 'Inmediata'}</p>
                                    <p><strong className="text-slate-600">Lugar de Entrega:</strong> {doc.client_address || 'Almacén central / Destino convenido'}</p>
                                    <p><strong className="text-slate-600">Estado:</strong> <span className="font-bold uppercase text-slate-900">{badge.label}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* TABLA DE ÍTEMS Y PRODUCTOS */}
                        <div className="mb-6 overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                                        <th className="py-2.5 px-3 text-center w-10">#</th>
                                        <th className="py-2.5 px-3">Descripción del Producto / Servicio</th>
                                        <th className="py-2.5 px-3 text-center w-16">Unidad</th>
                                        <th className="py-2.5 px-3 text-center w-16">Cant.</th>
                                        <th className="py-2.5 px-3 text-right w-24">P. Unit.</th>
                                        <th className="py-2.5 px-3 text-center w-16">Desc.</th>
                                        <th className="py-2.5 px-3 text-right w-28">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                                    {doc.items.map((item, index) => {
                                        const qty = Number(item.quantity) || 0;
                                        const price = Number(item.price) || 0;
                                        const discount = Number(item.discount) || 0;
                                        const lineBase = qty * price;
                                        const lineDiscount = lineBase * (discount / 100);
                                        const lineTotal = lineBase - lineDiscount;

                                        return (
                                            <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                                                    {index + 1}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-slate-900">{item.name}</div>
                                                    {item.sku && (
                                                        <div className="text-[10px] text-slate-400 font-mono">
                                                            SKU: {item.sku}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-center text-slate-600">
                                                    {item.unit || 'Pza'}
                                                </td>
                                                <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">
                                                    {qty}
                                                </td>
                                                <td className="py-3 px-3 text-right font-mono text-slate-700">
                                                    {price.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                                                    {discount > 0 ? `${discount}%` : '-'}
                                                </td>
                                                <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                                                    {lineTotal.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* SECCIÓN INFERIOR: TOTALES, LITERAL Y QR DE PAGO */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-200">
                            {/* Lado Izquierdo: Importe en palabras y formas de pago */}
                            <div className="sm:col-span-7 space-y-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                        SON EN LETRAS:
                                    </div>
                                    <div className="text-xs font-bold text-slate-800 uppercase mt-0.5 leading-snug">
                                        {numberToBolivianosWords(totals.grandTotal)}
                                    </div>
                                </div>

                                {/* Métodos de Pago y QR Simple Bolivia */}
                                <div className="flex items-center gap-4 p-3 bg-orange-50/60 rounded-xl border border-orange-200/80">
                                    {/* Gráfico SVG de Código QR Simulado */}
                                    <div className="w-20 h-20 bg-white p-1 rounded-lg border border-orange-300 shadow-xs shrink-0 flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                                            {/* Representación visual de código QR */}
                                            <rect x="5" y="5" width="25" height="25" rx="3" fill="#000" />
                                            <rect x="10" y="10" width="15" height="15" fill="#fff" />
                                            <rect x="13" y="13" width="9" height="9" fill="#000" />

                                            <rect x="70" y="5" width="25" height="25" rx="3" fill="#000" />
                                            <rect x="75" y="10" width="15" height="15" fill="#fff" />
                                            <rect x="78" y="13" width="9" height="9" fill="#000" />

                                            <rect x="5" y="70" width="25" height="25" rx="3" fill="#000" />
                                            <rect x="10" y="75" width="15" height="15" fill="#fff" />
                                            <rect x="13" y="78" width="9" height="9" fill="#000" />

                                            <rect x="35" y="10" width="8" height="8" fill="#000" />
                                            <rect x="50" y="10" width="12" height="6" fill="#000" />
                                            <rect x="40" y="25" width="20" height="8" fill="#000" />
                                            <rect x="10" y="40" width="8" height="20" fill="#000" />
                                            <rect x="25" y="45" width="15" height="15" fill="#ea580c" />
                                            <rect x="48" y="40" width="10" height="10" fill="#000" />
                                            <rect x="65" y="40" width="8" height="18" fill="#000" />
                                            <rect x="80" y="45" width="12" height="12" fill="#000" />
                                            <rect x="38" y="65" width="22" height="8" fill="#000" />
                                            <rect x="45" y="80" width="15" height="12" fill="#000" />
                                            <rect x="70" y="70" width="22" height="22" fill="#000" />
                                            <rect x="75" y="75" width="12" height="12" fill="#fff" />
                                        </svg>
                                    </div>
                                    <div className="text-xs text-slate-700 leading-tight">
                                        <div className="font-black text-slate-900 text-[11px] uppercase tracking-wide flex items-center gap-1">
                                            <span>🇧🇴</span> Pago con QR Simple Bolivia
                                        </div>
                                        <p className="text-[11px] text-slate-600 mt-1">
                                            Aceptamos transferencias interbancarias inmediatas sin costo adicional.
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                                            Banco Unión / Banco BCP / Banco Mercantil
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Lado Derecho: Totales numéricos */}
                            <div className="sm:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal Bruto:</span>
                                    <span className="font-mono font-bold text-slate-800">
                                        Bs. {totals.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {totals.totalDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Descuentos Aplicados:</span>
                                        <span className="font-mono font-bold">
                                            - Bs. {totals.totalDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {withTax && (
                                    <div className="flex justify-between text-blue-600">
                                        <span>IVA Oficial (13%):</span>
                                        <span className="font-mono font-bold">
                                            + Bs. {totals.tax.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-center text-slate-900">
                                    <span className="font-black text-sm uppercase">TOTAL A PAGAR:</span>
                                    <span className="font-mono font-black text-xl text-orange-600">
                                        Bs. {totals.grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CLÁUSULAS, NOTAS Y FIRMAS */}
                        <div className="mt-6 space-y-4 text-[11px] text-slate-600">
                            <div>
                                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                                    Observaciones y Términos Comerciales:
                                </h4>
                                <p className="leading-relaxed text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                                    {doc.notes || '1. Esta cotización tiene una validez estricta de 15 días calendario a partir de su emisión. 2. Los precios incluyen impuestos de ley en caso de emisión con factura fiscal. 3. Toda entrega en territorio boliviano se coordina previa confirmación de pago o anticipo pactado.'}
                                </p>
                            </div>

                            {/* FIRMAS */}
                            <div className="grid grid-cols-2 gap-8 pt-12 mt-6 text-center text-xs">
                                <div>
                                    <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                                    <p className="font-bold text-slate-800">{companyName}</p>
                                    <p className="text-[10px] text-slate-500">Firma y Sello Autorizado</p>
                                </div>
                                <div>
                                    <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                                    <p className="font-bold text-slate-800">{doc.client_name}</p>
                                    <p className="text-[10px] text-slate-500">Conforme y Aceptación de Compra</p>
                                </div>
                            </div>

                            {/* PIE DE PÁGINA */}
                            <div className="text-center pt-8 text-[10px] text-slate-400 border-t border-slate-100">
                                Documento emitido por la plataforma LDR Comercial • Bolivia • {new Date().getFullYear()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOTIFICACIÓN COPIADO */}
                {copiedNotification && (
                    <div className="no-print absolute bottom-5 right-5 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-white/20 animate-bounce">
                        ✓ Resumen copiado al portapapeles
                    </div>
                )}
            </div>
        </div>
    );
}


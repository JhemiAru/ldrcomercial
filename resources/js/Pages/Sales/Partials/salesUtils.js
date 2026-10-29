/**
 * Utilidades para el módulo de Ventas y Cotizaciones de LDR Comercial (Bolivia)
 */

export const formatMoneyBs = (amount) => {
    const num = Number(amount) || 0;
    return `Bs. ${num.toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

/**
 * Convierte un número a su representación en letras en español con formato boliviano (00/100 Bolivianos)
 */
export const numberToBolivianosWords = (amount) => {
    const num = Math.abs(Number(amount) || 0);
    const integerPart = Math.floor(num);
    const centsPart = Math.round((num - integerPart) * 100);
    const centsStr = centsPart.toString().padStart(2, '0');

    if (integerPart === 0) {
        return `CERO ${centsStr}/100 BOLIVIANOS`;
    }

    const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const specials = {
        11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE',
        16: 'DIECISÉIS', 17: 'DIECISIETE', 18: 'DIECIOCHO', 19: 'DIECINUEVE',
        21: 'VEINTIÚN', 22: 'VEINTIDÓS', 23: 'VEINTITRÉS', 24: 'VEINTICUATRO',
        25: 'VEINTICINCO', 26: 'VEINTISÉIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE'
    };
    const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    function convertGroup(n) {
        let output = '';
        if (n === 100) return 'CIEN';

        const h = Math.floor(n / 100);
        const t = Math.floor((n % 100) / 10);
        const u = n % 10;
        const remainder = n % 100;

        if (h > 0) output += hundreds[h] + ' ';

        if (specials[remainder]) {
            output += specials[remainder] + ' ';
        } else {
            if (t > 0) {
                output += tens[t];
                if (u > 0) output += ' Y ';
            }
            if (u > 0 && t !== 2) {
                output += units[u] + ' ';
            }
        }
        return output.trim();
    }

    let words = '';
    const millions = Math.floor(integerPart / 1000000);
    const thousands = Math.floor((integerPart % 1000000) / 1000);
    const remainder = integerPart % 1000;

    if (millions > 0) {
        words += (millions === 1 ? 'UN MILLÓN ' : `${convertGroup(millions)} MILLONES `);
    }
    if (thousands > 0) {
        words += (thousands === 1 ? 'MIL ' : `${convertGroup(thousands)} MIL `);
    }
    if (remainder > 0 || words === '') {
        words += convertGroup(remainder);
    }

    return `${words.trim()} ${centsStr}/100 BOLIVIANOS`;
};

/**
 * Retorna estilos y etiquetas para el estado de una cotización o venta
 */
export const getStatusBadge = (status, docType = 'quotation') => {
    switch (status) {
        case 'approved':
            return {
                label: 'Aprobada',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                text: 'text-emerald-700 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                dot: 'bg-emerald-500',
            };
        case 'sent':
            return {
                label: 'Enviada al Cliente',
                bg: 'bg-blue-50 dark:bg-blue-500/10',
                text: 'text-blue-700 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-500/20',
                dot: 'bg-blue-500',
            };
        case 'draft':
            return {
                label: 'Borrador',
                bg: 'bg-slate-100 dark:bg-white/5',
                text: 'text-slate-600 dark:text-slate-400',
                border: 'border-slate-200 dark:border-white/10',
                dot: 'bg-slate-400',
            };
        case 'rejected':
            return {
                label: 'Rechazada / Vencida',
                bg: 'bg-red-50 dark:bg-red-500/10',
                text: 'text-red-700 dark:text-red-400',
                border: 'border-red-200 dark:border-red-500/20',
                dot: 'bg-red-500',
            };
        case 'completed':
            return {
                label: 'Venta Concretada',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                text: 'text-emerald-700 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                dot: 'bg-emerald-500',
            };
        case 'pending_payment':
            return {
                label: 'Pendiente de Pago',
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                text: 'text-amber-700 dark:text-amber-400',
                border: 'border-amber-200 dark:border-amber-500/20',
                dot: 'bg-amber-500',
            };
        default:
            return {
                label: status,
                bg: 'bg-slate-100 dark:bg-white/5',
                text: 'text-slate-600 dark:text-slate-400',
                border: 'border-slate-200 dark:border-white/10',
                dot: 'bg-slate-400',
            };
    }
};

/**
 * Calcula los totales de un documento
 */
export const calculateDocumentTotals = (items = [], withTax = false, taxRate = 0.13) => {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const discountPct = Number(item.discount) || 0;

        const lineBase = qty * price;
        const lineDiscount = lineBase * (discountPct / 100);
        const lineTotal = lineBase - lineDiscount;

        subtotal += lineBase;
        totalDiscount += lineDiscount;
    });

    const netSubtotal = subtotal - totalDiscount;
    const tax = withTax ? netSubtotal * taxRate : 0;
    const grandTotal = netSubtotal + tax;

    return {
        subtotal,
        totalDiscount,
        netSubtotal,
        tax,
        grandTotal,
    };
};

/**
 * Genera el enlace de WhatsApp formateado para enviar una cotización o nota de venta
 */
export const generateWhatsAppShareUrl = (doc, company) => {
    const phone = (doc.client_phone || '').replace(/[^0-9]/g, '');
    const isQuotation = doc.doc_type === 'quotation';
    const typeTitle = isQuotation ? 'COTIZACIÓN FORMAL' : 'NOTA DE VENTA';

    const totals = calculateDocumentTotals(doc.items, doc.with_tax);

    let message = `*${typeTitle} #${doc.id}*\n`;
    message += `*De:* ${company?.name || 'LDR Comercial'}\n`;
    message += `*Para:* ${doc.client_name}\n`;
    message += `*Fecha:* ${doc.date}\n`;
    if (isQuotation && doc.due_date) {
        message += `*Vigencia hasta:* ${doc.due_date}\n`;
    }
    message += `\n*DETALLE DE PRODUCTOS:*\n`;

    doc.items.forEach((it, idx) => {
        const lineTotal = (Number(it.quantity) || 1) * (Number(it.price) || 0) * (1 - (Number(it.discount) || 0) / 100);
        message += `▫️ ${it.quantity} ${it.unit || 'unid.'} - *${it.name}*: Bs. ${lineTotal.toFixed(2)}\n`;
    });

    message += `\n*TOTAL A PAGAR:* Bs. ${totals.grandTotal.toFixed(2)}\n`;
    message += `*Condición de Pago:* ${doc.payment_terms || 'Al Contado / QR'}\n`;
    message += `*Tiempo de Entrega:* ${doc.delivery_time || 'A coordinar'}\n\n`;
    message += `_Generado a través del Sistema Comercial LDR Bolivia._`;

    const encoded = encodeURIComponent(message);
    return phone ? `https://wa.me/591${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
};


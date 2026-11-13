import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function CompanyChatbot({ company }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const cleanPhone = (company.whatsapp || company.phone || '').replace(/[^0-9]/g, '');
    const products = company.products || [];

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address || ''} ${company.city || ''} Bolivia`)}`;

    const getWhatsAppUrl = (customText) => {
        if (!cleanPhone) return '#';
        const text = customText || `Hola ${company.name}, te contacto desde su perfil en LDR Comercial para solicitar información comercial.`;
        return `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    const getProductQuoteUrl = (prod) => {
        if (!cleanPhone) return '#';
        const msg = `Hola ${company.name}, vi su producto "${prod.name}" en LDR Comercial y deseo solicitar cotización técnica y disponibilidad.`;
        return `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(msg)}`;
    };

    // Preguntas frecuentes estándar
    const FAQ_OPTIONS = [
        {
            id: 'location',
            label: '📍 Ubicación y Envíos',
            keywords: ['donde', 'ubicacion', 'direccion', 'llegar', 'envio', 'envios', 'ciudad', 'mapa', 'departamento'],
            answer: (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        📍 <strong>Ubicación física:</strong> {company.address ? company.address : 'Dirección registrada en el perfil'} {company.city ? `(${company.city}${company.department ? `, ${company.department}` : ''})` : 'Bolivia'}.
                    </p>
                    <p>
                        🚚 <strong>Cobertura de Envíos:</strong> Realizamos entregas locales y despachos a nivel nacional hacia los principales departamentos de Bolivia mediante transporte coordinado o courier.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2">
                        {company.address && (
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition shadow-xs"
                            >
                                <span>🗺️ Abrir en Google Maps</span>
                            </a>
                        )}
                        {cleanPhone && (
                            <a
                                href={getWhatsAppUrl(`Hola ${company.name}, deseo consultar el costo y tiempo de envío a mi ciudad.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition shadow-xs"
                            >
                                <span>📲 Coordinar Envío</span>
                            </a>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 'hours',
            label: '⏰ Horarios de Atención',
            keywords: ['horario', 'horarios', 'abierto', 'hora', 'atienden', 'sabado', 'domingo', 'atencion'],
            answer: (
                <div className="space-y-1.5 text-xs leading-relaxed">
                    <p>
                        ⏰ <strong>Horario de Atención Comercial:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        <li><strong>Lunes a Viernes:</strong> 08:30 a 18:30</li>
                        <li><strong>Sábados:</strong> 09:00 a 13:00</li>
                        <li><strong>Domingos y feriados:</strong> Mediante consulta previa por WhatsApp</li>
                    </ul>
                    <p className="text-[11px] text-slate-400 pt-1">
                        ⚡ Las consultas enviadas por WhatsApp se atienden con prontitud en orden de llegada.
                    </p>
                </div>
            )
        },
        {
            id: 'payments',
            label: '💳 Métodos de Pago',
            keywords: ['pago', 'pagos', 'qr', 'transferencia', 'banco', 'efectivo', 'factura', 'nit', 'tarjeta'],
            answer: (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        Aceptamos múltiples métodos de pago seguros en Bolivia:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <strong>📲 QR Simple</strong>
                            <span className="block text-slate-400 text-[10px]">Cero comisiones, acreditación al instante</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <strong>🏦 Transferencia</strong>
                            <span className="block text-slate-400 text-[10px]">Cuentas empresariales en principales bancos</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <strong>🧾 Facturación</strong>
                            <span className="block text-slate-400 text-[10px]">Factura oficial computarizada con NIT</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <strong>💵 Efectivo</strong>
                            <span className="block text-slate-400 text-[10px]">Contra entrega en almacén o local físico</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'catalog',
            label: '📦 Catálogo y Stock',
            keywords: ['catalogo', 'productos', 'stock', 'disponibilidad', 'precios', 'lista'],
            answer: (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        Actualmente tenemos <strong>{products.length} productos publicados</strong> en nuestra vitrina oficial de LDR Comercial.
                    </p>
                    {products.length > 0 ? (
                        <div>
                            <p className="text-slate-400 text-[11px] mb-2">
                                Puedes escribir el nombre de cualquier producto en la barra inferior para buscarlo directamente, o ver los más destacados aquí:
                            </p>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {products.slice(0, 4).map((p) => (
                                    <div key={p.id} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {p.main_image ? (
                                                <img src={p.main_image} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center text-xs shrink-0">📦</div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-[11px] truncate text-white">{p.name}</p>
                                                <p className="text-[10px] text-emerald-400 font-semibold">{p.price ? `${p.price} Bs.` : 'A cotizar'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {cleanPhone && (
                                                <a
                                                    href={getProductQuoteUrl(p)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold"
                                                    title="Cotizar por WhatsApp"
                                                >
                                                    📲
                                                </a>
                                            )}
                                            <Link
                                                href={route('products.show', p.id)}
                                                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold"
                                            >
                                                Ver
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-[11px]">
                            Consúltanos por WhatsApp para enviarte nuestro PDF de catálogo completo y disponibilidad inmediata de suministros.
                        </p>
                    )}
                </div>
            )
        },
        {
            id: 'verification',
            label: '🛡️ Verificación y Garantía',
            keywords: ['garantia', 'confianza', 'seguro', 'seguridad', 'estafa', 'verificado', 'verificada', 'nit'],
            answer: (
                <div className="space-y-1.5 text-xs leading-relaxed">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <span>🛡️</span>
                        <span>Empresa Verificada por LDR Comercial</span>
                    </div>
                    <p>
                        Para tu total seguridad, <strong>{company.name}</strong> cuenta con inspección física de establecimiento y respaldo legal validado (NIT y personería en Bolivia) para prevenir empresas fantasmas y fraudes comerciales.
                    </p>
                    <p className="text-[11px] text-slate-400">
                        ✓ Datos fiscales comprobados · ✓ Establecimiento activo · ✓ Canal comercial seguro
                    </p>
                </div>
            )
        },
        {
            id: 'whatsapp_human',
            label: '📲 Hablar con un Asesor Humano',
            keywords: ['humano', 'persona', 'asesor', 'ejecutivo', 'vendedor', 'llamar', 'whatsapp', 'telefono', 'hablar'],
            answer: (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        ¡Con gusto! Nuestro equipo de asesores comerciales está listo para atenderte de forma personalizada por WhatsApp o llamada directa:
                    </p>
                    {cleanPhone ? (
                        <div className="space-y-2 pt-1">
                            <a
                                href={getWhatsAppUrl(`Hola equipo comercial de ${company.name}, deseo hablar con un asesor para realizar una consulta comercial.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Abrir Chat de WhatsApp (+591 {company.whatsapp || company.phone})</span>
                            </a>
                            {company.phone && (
                                <a
                                    href={`tel:${company.phone}`}
                                    className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition"
                                >
                                    <span>📞 Llamar por teléfono directo</span>
                                </a>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-xs">
                            Actualmente puedes contactarnos a través de los canales listados en nuestro perfil.
                        </p>
                    )}
                </div>
            )
        }
    ];

    // Estado inicial de los mensajes del chat
    const initialMessages = [
        {
            id: 'welcome_1',
            sender: 'bot',
            time: 'Ahora',
            content: (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        ¡Hola! 👋 Soy el asistente virtual de <strong>{company.name}</strong>.
                    </p>
                    <p className="text-slate-300">
                        ¿Tienes alguna duda o buscas algún producto en particular? Puedes presionar cualquiera de las preguntas frecuentes o escribir lo que necesitas en la barra inferior.
                    </p>
                </div>
            )
        }
    ];

    const [messages, setMessages] = useState(initialMessages);

    // Auto scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            if (!hasInteracted) setHasInteracted(true);
        }
    }, [isOpen, messages, isTyping]);

    // Manejador cuando el usuario selecciona una FAQ
    const handleSelectFaq = (faq) => {
        const userMsg = {
            id: 'user_' + Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: faq.label
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            const botMsg = {
                id: 'bot_' + Date.now(),
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: faq.answer
            };
            setIsTyping(false);
            setMessages((prev) => [...prev, botMsg]);
        }, 400);
    };

    // Buscador híbrido de productos y respuestas conversacionales
    const processUserQuery = (queryText) => {
        const text = queryText.toLowerCase().trim();
        if (!text) return;

        // 1. Revisar si coincide con alguna FAQ mediante keywords
        const matchedFaq = FAQ_OPTIONS.find((f) => 
            f.keywords.some((kw) => text.includes(kw))
        );

        if (matchedFaq && !text.includes('precio') && !text.includes('venden') && !text.includes('tienen')) {
            return matchedFaq.answer;
        }

        // 2. Buscar en los productos de la empresa
        const matchedProducts = products.filter((p) => {
            const nameMatch = (p.name || '').toLowerCase().includes(text);
            const descMatch = (p.short_description || '').toLowerCase().includes(text);
            const tagMatch = (p.tags || '').toLowerCase().includes(text);
            const catMatch = (p.category?.name || '').toLowerCase().includes(text);
            const brandMatch = (p.brand?.name || '').toLowerCase().includes(text);
            return nameMatch || descMatch || tagMatch || catMatch || brandMatch;
        });

        if (matchedProducts.length > 0) {
            return (
                <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                        🔍 ¡Encontré <strong>{matchedProducts.length} producto{matchedProducts.length > 1 ? 's' : ''}</strong> en nuestro catálogo que coinciden con "<em>{queryText}</em>":
                    </p>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {matchedProducts.slice(0, 5).map((prod) => (
                            <div key={prod.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2.5 hover:bg-white/10 transition">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    {prod.main_image ? (
                                        <img src={prod.main_image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center text-sm shrink-0">📦</div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-xs truncate text-white">{prod.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] font-black text-emerald-400">
                                                {prod.price ? `${prod.price} Bs.` : 'A cotizar'}
                                            </span>
                                            {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                                                <span className="text-[10px] text-slate-400 line-through">
                                                    {prod.original_price} Bs.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {cleanPhone && (
                                        <a
                                            href={getProductQuoteUrl(prod)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
                                            title="Cotizar en WhatsApp"
                                        >
                                            📲 Cotizar
                                        </a>
                                    )}
                                    <Link
                                        href={route('products.show', prod.id)}
                                        className="px-2 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition"
                                    >
                                        Ver
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {matchedProducts.length > 5 && (
                        <p className="text-[10px] text-slate-400 text-center">
                            Mostrando 5 de {matchedProducts.length} productos coincidentes.
                        </p>
                    )}
                </div>
            );
        }

        // 3. Saludos o fórmulas cordiales
        if (text.startsWith('hola') || text.startsWith('buen') || text === 'buenas' || text === 'saludos') {
            return (
                <div className="space-y-1.5 text-xs leading-relaxed">
                    <p>
                        ¡Hola! Qué gusto saludarte. 😊
                    </p>
                    <p className="text-slate-300">
                        ¿Qué producto o suministro estás buscando hoy para tu negocio o proyecto? Puedes escribir su nombre o seleccionar alguna opción rápida de arriba.
                    </p>
                </div>
            );
        }

        // 4. Fallback inteligente con derivación a WhatsApp
        return (
            <div className="space-y-2 text-xs leading-relaxed">
                <p>
                    No encontré productos o respuestas exactas en la plataforma para "<em>{queryText}</em>".
                </p>
                <p className="text-slate-300 text-[11px]">
                    Sin embargo, nuestro equipo comercial puede revisar stock en bodega o cotizártelo directamente:
                </p>
                {cleanPhone && (
                    <div className="pt-1">
                        <a
                            href={getWhatsAppUrl(`Hola equipo comercial de ${company.name}, estuve consultando en su página web y deseo saber si tienen disponible o pueden cotizarme: "${queryText}".`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            <span>Consultar "{queryText}" en WhatsApp</span>
                        </a>
                    </div>
                )}
            </div>
        );
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const text = inputText.trim();
        if (!text) return;

        const userMsg = {
            id: 'user_' + Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: text
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const botAnswer = processUserQuery(text);
            const botMsg = {
                id: 'bot_' + Date.now(),
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: botAnswer
            };
            setIsTyping(false);
            setMessages((prev) => [...prev, botMsg]);
        }, 450);
    };

    const handleReset = () => {
        setMessages(initialMessages);
    };

    return (
        <>
            {/* ══════════════════════════════════════════════════════════
                BOTÓN FLOTANTE ACTIVADOR (LAUNCHER WIDGET)
               ══════════════════════════════════════════════════════════ */}
            <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
                {/* Tooltip / Globo de invitación cuando está cerrado */}
                {!isOpen && !hasInteracted && (
                    <div 
                        onClick={() => setIsOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#0b132b] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-xl cursor-pointer hover:scale-105 transition animate-bounce"
                    >
                        <span className="text-sm">🤖</span>
                        <div className="text-left">
                            <p className="text-[11px] font-black leading-none">¿Tienes dudas?</p>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">Pregúntale a nuestro bot</p>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer ${
                        isOpen 
                            ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 rotate-90 scale-95' 
                            : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 hover:scale-110 shadow-blue-500/30'
                    }`}
                    aria-label="Abrir asistente virtual"
                >
                    {isOpen ? (
                        <span className="text-xl font-bold">✕</span>
                    ) : (
                        <>
                            <span className="text-2xl">🤖</span>
                            {/* Anillo de pulso activo */}
                            <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></span>
                            {/* Punto verde de 'En línea' */}
                            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080e1e]"></span>
                        </>
                    )}
                </button>
            </div>

            {/* ══════════════════════════════════════════════════════════
                VENTANA PRINCIPAL DEL CHATBOT
               ══════════════════════════════════════════════════════════ */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] rounded-3xl bg-[#080e1e] text-white border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
                    
                    {/* CABECERA (HEADER) */}
                    <div className="px-4 py-3.5 bg-gradient-to-r from-blue-950 via-[#0b132b] to-indigo-950 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-2xl bg-white p-0.5 shrink-0 overflow-hidden shadow-xs">
                                {company.logo ? (
                                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-sm rounded-xl">
                                        {company.name.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center text-white border border-white">
                                    🤖
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs font-black text-white truncate flex items-center gap-1.5">
                                    <span>Asistente de {company.name}</span>
                                    {company.is_verified && (
                                        <span className="text-emerald-400 text-[10px]" title="Verificado">✓</span>
                                    )}
                                </h3>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    En línea · Respuestas automáticas 24/7
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={handleReset}
                                title="Reiniciar conversación"
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
                            >
                                🔄
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                title="Cerrar"
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* CUERPO DEL CHAT (MENSAJES) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#050914]/80">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        🤖
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                                            : 'bg-[#0f172a] border border-white/10 text-slate-200 rounded-tl-xs'
                                    }`}
                                >
                                    {msg.text ? <p>{msg.text}</p> : msg.content}
                                    <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Indicador de escribiendo... */}
                        {isTyping && (
                            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                                <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-300 flex items-center justify-center text-xs shrink-0">
                                    🤖
                                </div>
                                <div className="bg-[#0f172a] border border-white/10 rounded-2xl px-3.5 py-2 rounded-tl-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* BARRA DE PREGUNTAS FRECUENTES RÁPIDAS (CHIPS) */}
                    <div className="px-3 py-2 bg-[#090f20] border-t border-white/10 shrink-0">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {FAQ_OPTIONS.map((faq) => (
                                <button
                                    key={faq.id}
                                    type="button"
                                    onClick={() => handleSelectFaq(faq)}
                                    className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-semibold text-slate-200 hover:text-white transition cursor-pointer"
                                >
                                    {faq.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* BARRA DE ESCRITURA Y BÚSQUEDA HÍBRIDA */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-3 bg-[#0b132b] border-t border-white/10 flex items-center gap-2 shrink-0"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Pregunta o busca un producto..."
                            className="flex-1 bg-[#050914] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-md"
                            title="Enviar"
                        >
                            ➤
                        </button>
                    </form>

                </div>
            )}
        </>
    );
}

import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateCompanyModal({
    isOpen,
    onClose,
    categories = [],
}) {
    if (!isOpen) return null;

    const [showPassword, setShowPassword] = useState(true);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '', // Nombre del titular / representante
        email: '',
        password: '',
        phone: '',
        company_name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        tax_id: '',
        city: 'La Paz',
        address: '',
    });

    const generateSecurePassword = () => {
        const words = ['Ldr', 'Bolivia', 'Comercial', 'Empresa', 'B2B', 'Segura'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomNum = Math.floor(100 + Math.random() * 900);
        const specials = ['@', '#', '$', '!'];
        const randomSpecial = specials[Math.floor(Math.random() * specials.length)];
        const generated = `${randomWord}${new Date().getFullYear()}${randomSpecial}${randomNum}`;
        setData('password', generated);
    };

    useEffect(() => {
        if (isOpen) {
            generateSecurePassword();
            setCopied(false);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.companies.store'), {
            preserveScroll: true,
            onSuccess: () => {
                // Éxito: mantener para que el admin pueda enviar WhatsApp o cerrar
            },
        });
    };

    const handleCopy = () => {
        const text = `Credenciales Oficiales LDR Comercial:\nPortal: ${window.location.origin}/login\nUsuario: ${data.email}\nContraseña: ${data.password}\nEmpresa: ${data.company_name} (Verificada ✓)`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSendWhatsApp = () => {
        const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '');
        const message = `*LDR Comercial - Alta Oficial de Empresa Verificada*\n\nEstimado(a) *${data.name}*,\nLe informamos que tras la verificación presencial y documental de *${data.company_name}*, su cuenta de acceso ha sido habilitada oficialmente:\n\n🌐 *Portal:* ${window.location.origin}/login\n📧 *Usuario:* ${data.email}\n🔑 *Contraseña:* ${data.password}\n\nYa puede ingresar y comenzar a publicar su catálogo y suministros con la insignia de Empresa Verificada ✓.`;
        const encoded = encodeURIComponent(message);
        const url = cleanPhone ? `https://wa.me/591${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b132b] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
                
                {/* Header Modal */}
                <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                            🏢
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base">
                                Registrar Nueva Empresa Verificada
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Alta oficial tras verificación física y de documentación en Bolivia
                            </p>
                        </div>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300 max-h-[80vh] overflow-y-auto">
                    
                    {recentlySuccessful && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-2xl font-bold space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span>✓</span>
                                <span>¡Empresa y cuenta creadas exitosamente como VERIFICADA!</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-lg border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition"
                                >
                                    {copied ? '✓ ¡Credenciales Copiadas!' : '📋 Copiar Credenciales'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendWhatsApp}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                                >
                                    <span>📲 Enviar Credenciales por WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-blue-800 dark:text-blue-300">
                        🛡️ <strong>Verificación Comercial Aprobada:</strong> Al registrar la empresa desde este panel, se le asigna de inmediato la insignia oficial de <strong>Empresa Verificada ✓</strong> con plena vigencia comercial.
                    </div>

                    {/* Datos de la Empresa */}
                    <div className="space-y-3 pt-2">
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                            1. Datos de la Empresa
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Comercial de la Empresa *</label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    placeholder="Ej. Ferretería Industrial Andina"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.company_name && <p className="text-red-500 text-[10px] mt-1">{errors.company_name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rubro / Categoría *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="dark:bg-[#0b132b]">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-[10px] mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NIT / Matrícula</label>
                                <input
                                    type="text"
                                    value={data.tax_id}
                                    onChange={(e) => setData('tax_id', e.target.value)}
                                    placeholder="Ej. 1029384756"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ciudad Sede</label>
                                <select
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="La Paz" className="dark:bg-[#0b132b]">La Paz</option>
                                    <option value="Santa Cruz" className="dark:bg-[#0b132b]">Santa Cruz</option>
                                    <option value="Cochabamba" className="dark:bg-[#0b132b]">Cochabamba</option>
                                    <option value="El Alto" className="dark:bg-[#0b132b]">El Alto</option>
                                    <option value="Oruro" className="dark:bg-[#0b132b]">Oruro</option>
                                    <option value="Chuquisaca" className="dark:bg-[#0b132b]">Chuquisaca</option>
                                    <option value="Potosí" className="dark:bg-[#0b132b]">Potosí</option>
                                    <option value="Tarija" className="dark:bg-[#0b132b]">Tarija</option>
                                    <option value="Beni" className="dark:bg-[#0b132b]">Beni</option>
                                    <option value="Pando" className="dark:bg-[#0b132b]">Pando</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dirección Física Verificada</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Av. Principal #123, Zona Industrial"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Datos del Usuario y Acceso */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                            2. Cuenta de Acceso & Representante
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Titular / Contacto *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Ej. 70012345"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico (Login) *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="correo@empresa.com"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Contraseña Asignada *</label>
                                    <button
                                        type="button"
                                        onClick={generateSecurePassword}
                                        className="text-[10px] font-bold text-blue-600 hover:underline"
                                    >
                                        🔄 Generar Otra
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 pr-16"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? 'Ocultar' : 'Ver'}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                        >
                            <span>✓</span>
                            <span>{processing ? 'Registrando...' : 'Dar de Alta Empresa Verificada'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}


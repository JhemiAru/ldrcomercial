import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ResetPasswordModal({
    isOpen,
    onClose,
    targetCompany,
    targetUser,
}) {
    if (!isOpen || !targetUser) return null;

    const [showPassword, setShowPassword] = useState(true);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        password: '',
    });

    // Generador de contraseñas seguras y fáciles de comunicar
    const generateSecurePassword = () => {
        const words = ['Ldr', 'Bolivia', 'Comercial', 'Empresa', 'Segura', 'Acceso', 'Clave'];
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
    }, [isOpen, targetUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.reset-password', targetUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Mantener modal un momento para que el admin pueda copiar o enviar por whatsapp
            },
        });
    };

    // Copiar credenciales
    const handleCopy = () => {
        const text = `Credenciales de Acceso LDR Comercial:\nPortal: ${window.location.origin}/login\nUsuario: ${targetUser.email}\nNueva Contraseña: ${data.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Enviar credenciales por WhatsApp a la empresa
    const handleSendWhatsApp = () => {
        const phone = (targetCompany?.whatsapp || targetCompany?.phone || targetUser?.phone || '').replace(/[^0-9]/g, '');
        const message = `*LDR Comercial - Restablecimiento de Contraseña*\n\nEstimado(a) *${targetCompany?.name || targetUser.name}*,\nSe ha generado una nueva contraseña para su cuenta de acceso:\n\n🌐 *Portal:* ${window.location.origin}/login\n📧 *Usuario:* ${targetUser.email}\n🔑 *Nueva Contraseña:* ${data.password}\n\nPor seguridad, le recomendamos cambiarla tras ingresar a su perfil.`;
        const encoded = encodeURIComponent(message);
        const url = phone ? `https://wa.me/591${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0b132b] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
                {/* Header Modal */}
                <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1633] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl shrink-0">
                            🔑
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base">
                                Restablecer Contraseña de Cuenta
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Panel de Administrador Maestro
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

                {/* Contenido */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
                    {/* Alerta de éxito */}
                    {recentlySuccessful && (
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                            <span>✓</span>
                            <span>¡Contraseña actualizada en el sistema exitosamente!</span>
                        </div>
                    )}

                    {/* Ficha de la cuenta a modificar */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            CUENTA DE LA EMPRESA SELECCIONADA:
                        </div>
                        <div className="flex items-center gap-3">
                            {targetCompany?.logo ? (
                                <img
                                    src={targetCompany.logo}
                                    alt={targetCompany.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 bg-white"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-base flex items-center justify-center shrink-0">
                                    {(targetCompany?.name || targetUser.name).charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                                    {targetCompany?.name || targetUser.name}
                                </h4>
                                <p className="font-mono text-slate-600 dark:text-slate-300 font-bold text-xs mt-0.5">
                                    📧 {targetUser.email}
                                </p>
                                {targetCompany?.city && (
                                    <p className="text-[10px] text-slate-400">
                                        📍 {targetCompany.city} {targetCompany.phone ? `• 📞 ${targetCompany.phone}` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Input de Nueva Contraseña */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Nueva Contraseña *
                            </label>
                            <button
                                type="button"
                                onClick={generateSecurePassword}
                                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition flex items-center gap-1"
                            >
                                <span>🎲</span> Generar otra clave
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full text-sm font-mono font-bold rounded-xl border-slate-300 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500 pr-10 py-2.5"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Escribe o genera la nueva clave..."
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                                title={showPassword ? 'Ocultar' : 'Mostrar'}
                            >
                                {showPassword ? '👁️' : '🙈'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">
                                {errors.password}
                            </p>
                        )}
                        <p className="text-[10px] text-slate-500">
                            Mínimo 6 caracteres. El usuario podrá ingresar inmediatamente con esta contraseña.
                        </p>
                    </div>

                    {/* Acciones para Compartir Credenciales */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                        >
                            <span>📋</span>
                            <span>{copied ? '¡Copiado!' : 'Copiar Credenciales'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSendWhatsApp}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                            <span>💬</span>
                            <span>Enviar por WhatsApp</span>
                        </button>
                    </div>

                    {/* Botones de acción */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition"
                        >
                            Cerrar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
                        >
                            <span>💾</span>
                            <span>{processing ? 'Guardando...' : 'Guardar Nueva Contraseña'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateUserModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [showPassword, setShowPassword] = useState(true);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'company',
        password: '',
    });

    const generateSecurePassword = () => {
        const words = ['Ldr', 'Bolivia', 'Comercial', 'Segura', 'Acceso', 'Clave'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomNum = Math.floor(100 + Math.random() * 900);
        const specials = ['@', '#', '$', '!'];
        const randomSpecial = specials[Math.floor(Math.random() * specials.length)];
        const generated = `${randomWord}${new Date().getFullYear()}${randomSpecial}${randomNum}`;
        setData('password', generated);
    };

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            generateSecurePassword();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-[#0b132b] w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden my-8">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>👤</span>
                            <span>Registrar Nuevo Usuario</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Crea una cuenta para un comprador, representante de empresa o administrador
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Nombre Completo */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Ej. Roberto Arce Mendoza"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Correo Electrónico (Login) *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="usuario@dominio.com"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Teléfono / WhatsApp (Opcional)
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Ej. 78000000"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Tipo de Cuenta (Rol) *
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="company">🏢 Empresa / Proveedor B2B (Publica productos)</option>
                            <option value="buyer">🛒 Comprador / Cliente General</option>
                            <option value="admin">👑 Super Administrador (Control Total)</option>
                        </select>
                        {errors.role && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.role}</p>}
                    </div>

                    {/* Contraseña Inicial */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Contraseña Inicial *
                            </label>
                            <button
                                type="button"
                                onClick={generateSecurePassword}
                                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <span>⚡</span>
                                <span>Generar clave segura</span>
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="Contraseña de acceso"
                                className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.password}</p>}
                    </div>

                    {/* Botones de Envío */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Registrando...</span>
                                </>
                            ) : (
                                <>
                                    <span>+</span>
                                    <span>Registrar Usuario</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}


import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
                <p className="text-sm text-slate-500 mt-2">Inicia sesión para gestionar tu negocio.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 font-bold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 font-bold" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-orange-600 hover:text-orange-500 transition"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <span className="ms-2 text-sm font-medium text-slate-600">
                            Recordarme en este equipo
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-[#0b132b] hover:bg-[#132043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b132b] transition disabled:opacity-70"
                    >
                        {processing ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <span className="text-sm text-slate-500">¿No tienes una cuenta? </span>
                    <Link
                        href={route('register')}
                        className="text-sm font-bold text-orange-600 hover:text-orange-500 transition"
                    >
                        Regístrate aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

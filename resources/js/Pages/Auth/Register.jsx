import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crear una cuenta</h2>
                <p className="text-sm text-slate-500 mt-2">Únete a la red comercial B2B y B2C más efectiva.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nombre Completo" className="text-slate-700 font-bold" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 font-bold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 font-bold" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-slate-700 font-bold" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5 block w-full bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-xs transition"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-[#0b132b] hover:bg-[#132043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b132b] transition disabled:opacity-70"
                    >
                        {processing ? 'Registrando...' : 'Registrarse'}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <span className="text-sm text-slate-500">¿Ya tienes una cuenta? </span>
                    <Link
                        href={route('login')}
                        className="text-sm font-bold text-orange-600 hover:text-orange-500 transition"
                    >
                        Inicia Sesión aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

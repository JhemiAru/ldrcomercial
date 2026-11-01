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
        phone: '',
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
            <Head title="Crear Cuenta de Usuario" />

            <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-2 border border-blue-200">
                    <span>🛡️</span>
                    <span>Cuenta de Usuario / Comprador</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crear una cuenta</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sigue a empresas verificadas, guarda suministros favoritos y solicita cotizaciones directas en Bolivia.
                </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 mb-5 leading-relaxed">
                💡 <strong>¿Eres dueño de un negocio?</strong> Podrás afiliar y administrar una o varias empresas desde tu perfil una vez verificadas presencialmente por el equipo comercial de LDR.
            </div>

            <form onSubmit={submit} className="space-y-4 text-xs">
                <div>
                    <InputLabel htmlFor="name" value="Nombre Completo" className="text-slate-700 font-bold" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl text-xs transition"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 font-bold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl text-xs transition"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@correo.com"
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Teléfono / WhatsApp" className="text-slate-700 font-bold" />
                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl text-xs transition"
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Ej. 70012345"
                    />
                    <InputError message={errors.phone} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 font-bold" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl text-xs transition"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-slate-700 font-bold" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl text-xs transition"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Repite la contraseña"
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-xs font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition disabled:opacity-70"
                    >
                        {processing ? 'Creando Cuenta...' : 'Registrar mi Cuenta'}
                    </button>
                </div>

                <div className="text-center mt-4">
                    <span className="text-xs text-slate-500">¿Ya tienes una cuenta? </span>
                    <Link
                        href={route('login')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                        Inicia Sesión aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

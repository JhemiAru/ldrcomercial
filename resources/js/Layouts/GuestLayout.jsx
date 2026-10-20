import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Panel Izquierdo - Branding (Oculto en móviles) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0b132b] relative overflow-hidden flex-col justify-center px-12 xl:px-24">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white mb-12">
                        <span className="font-black text-4xl tracking-tight">LDR<span className="text-orange-500">.</span></span>
                    </Link>

                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
                        Impulsa tu alcance comercial en toda Bolivia.
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg mb-12 leading-relaxed">
                        Publica tu catálogo, administra tus precios mayoristas y minoristas, y gestiona reservas de canchas deportivas o eventos desde un solo lugar.
                    </p>

                    <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span> B2B & B2C
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span> Eventos
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span> Sin comisiones ocultas
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel Derecho - Formulario */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white relative">
                {/* Logo móvil */}
                <div className="lg:hidden absolute top-8 left-6 sm:left-12">
                    <Link href="/" className="font-black text-3xl tracking-tight text-slate-900">
                        LDR<span className="text-orange-500">.</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

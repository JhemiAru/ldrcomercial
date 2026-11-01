<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Proceso de afiliación y verificación presencial de empresas en LDR Comercial. Seguridad B2B y prevención de fraudes en Bolivia.">

    <title>Afiliación de Empresas | LDR Comercial</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Styles -->
    @vite(['resources/css/app.css'])

    <style>
        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
    </style>

    <!-- Theme Detection -->
    <script>
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    </script>
</head>
<body class="bg-slate-50 dark:bg-[#080e1e] text-slate-800 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors">

    <!-- ========================================================================= -->
    <!-- 1. TOP NAVBAR MODULAR -->
    <!-- ========================================================================= -->
    @include('partials.navbar')

    <!-- ========================================================================= -->
    <!-- 2. BANNER PRINCIPAL: INFORMACIÓN DE AFILIACIÓN Y VERIFICACIÓN -->
    <!-- ========================================================================= -->
    <main class="py-12 sm:py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- TARJETA CABECERA: AVISO INSTITUCIONAL -->
            <div class="bg-white dark:bg-[#0b132b] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-12 shadow-sm text-center relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-3xl mb-6 shadow-xs border border-blue-100 dark:border-blue-500/20">
                    🛡️
                </div>

                <div class="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-500/30">
                    Ecosistema B2B Seguro · Prevención de Fraudes
                </div>

                <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug max-w-2xl mx-auto">
                    Afiliación y Registro Verificado de Empresas
                </h1>

                <p class="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    Para proteger a compradores y proveedores frente a posibles estafas y empresas fantasmas, 
                    <strong>LDR Comercial no permite el autoregistro público</strong>. 
                    El equipo comercial se encarga de <strong>verificar personalmente cada negocio</strong> (inspección de ubicación física y documentación al día) antes de habilitar su cuenta oficial.
                </p>

                <!-- ALERTA INFORMATIVA -->
                <div class="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-left flex items-start gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    <span class="text-lg">⚠️</span>
                    <div>
                        <strong class="font-bold">Política estricta de seguridad:</strong> Ningún usuario anónimo puede registrarse solo en el portal. Todo negocio afiliado cuenta con respaldo legal, dirección verificada y personería en Bolivia.
                    </div>
                </div>

                <!-- 3 PASOS DEL PROCESO DE AFILIACIÓN -->
                <div class="mt-12 text-left space-y-6">
                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        ¿Cómo publicar tu empresa en LDR Comercial?
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-3">
                                1
                            </div>
                            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                                Contacto Comercial
                            </h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Comunícate con nuestros ejecutivos comerciales para presentar tu rubro, catálogo de suministros y ubicación.
                            </p>
                        </div>

                        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-3">
                                2
                            </div>
                            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                                Verificación Física
                            </h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Verificamos personalmente tu establecimiento o almacén, validando NIT, licencia de funcionamiento y stock real.
                            </p>
                        </div>

                        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center mb-3">
                                3
                            </div>
                            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                                Alta & Credenciales
                            </h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                LDR Comercial crea oficialmente tu cuenta con la insignia de <strong>Empresa Verificada ✓</strong> y te entrega tus accesos.
                            </p>
                        </div>

                    </div>
                </div>

                <!-- CANALES DIRECTOS DE CONTACTO CON EL EQUIPO COMERCIAL -->
                <div class="mt-10 pt-8 border-t border-slate-100 dark:border-white/10">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-4">
                        Inicia tu proceso de afiliación comunicándote directamente con el equipo comercial:
                    </span>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a 
                            href="https://wa.me/59170000000?text={{ urlencode('Hola equipo comercial de LDR Comercial, deseo iniciar el proceso de verificación y afiliación de mi empresa para publicar en la plataforma.') }}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.48 1.332 5.003L2 22l5.161-1.354a9.948 9.948 0 004.87 1.258h.004c5.507 0 9.985-4.478 9.985-9.985 0-2.668-1.04-5.176-2.928-7.064A9.92 9.92 0 0012.031 2zm0 18.23c-1.499 0-2.969-.404-4.254-1.168l-.305-.181-3.16.828.843-3.08-.198-.315a8.21 8.21 0 01-1.258-4.329c0-4.542 3.696-8.238 8.24-8.238 2.2 0 4.269.858 5.824 2.414a8.19 8.19 0 012.41 5.824c0 4.543-3.696 8.243-8.246 8.243zm4.518-6.173c-.248-.124-1.464-.723-1.691-.805-.227-.083-.393-.124-.558.124-.165.248-.641.805-.786.971-.144.165-.289.186-.537.062-.248-.124-1.047-.386-1.995-1.232-.738-.658-1.237-1.472-1.382-1.72-.144-.248-.015-.382.109-.505.111-.111.248-.289.372-.434.124-.144.165-.248.248-.413.083-.165.041-.31-.021-.434-.062-.124-.558-1.344-.765-1.84-.2-.485-.404-.419-.558-.427l-.475-.008c-.165 0-.434.062-.661.31-.227.248-.868.848-.868 2.068 0 1.22.888 2.399 1.012 2.564.124.165 1.748 2.668 4.234 3.743.592.256 1.054.409 1.414.523.594.19 1.135.163 1.562.099.477-.071 1.464-.599 1.671-1.177.207-.579.207-1.075.144-1.177-.062-.103-.227-.165-.475-.289z"/>
                            </svg>
                            <span>Contactar por WhatsApp</span>
                        </a>

                        <a 
                            href="{{ route('login') }}" 
                            class="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                            <span>¿Ya estás registrado? Iniciar Sesión</span>
                            <span>→</span>
                        </a>
                    </div>
                </div>

            </div>

        </div>
    </main>

    <!-- ========================================================================= -->
    <!-- 3. FOOTER -->
    <!-- ========================================================================= -->
    <footer class="bg-white dark:bg-[#060a16] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm transition-colors py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
            <div class="flex items-center justify-center sm:justify-start gap-1 font-bold text-slate-900 dark:text-white">
                <span>LDR<span class="text-blue-600">.</span> COMERCIAL</span>
                <span class="text-slate-400 font-normal">· Plataforma B2B Segura en Bolivia</span>
            </div>
            <div class="mt-4 sm:mt-0 text-slate-400">
                La Paz · Santa Cruz · Cochabamba · Oruro · Chuquisaca
            </div>
        </div>
    </footer>

</body>
</html>


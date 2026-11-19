<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="index, follow, max-image-preview:large">
        <meta name="geo.region" content="BO">
        <meta name="geo.placename" content="Bolivia">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/png" href="/favicon.png">

        <!-- Open Graph / WhatsApp / Facebook Meta Tags Dinámicos -->
        @php
            $currentUrl = url()->current();
            $ogTitle = config('app.name', 'LDR Comercial') . ' - Red Comercial y Catálogos en Bolivia';
            $ogDescription = 'Encuentra empresas, mayoristas, fabricantes y productos en toda Bolivia con precios y cotizaciones directas.';
            $ogImage = asset('favicon.png');
            $companyJsonLd = null;

            if (isset($page['props']['company'])) {
                $c = $page['props']['company'];
                $cName = is_array($c) ? ($c['name'] ?? '') : ($c->name ?? '');
                $cDesc = is_array($c) ? ($c['short_description'] ?? $c['description'] ?? '') : ($c->short_description ?? $c->description ?? '');
                $cCity = is_array($c) ? ($c['city'] ?? 'Bolivia') : ($c->city ?? 'Bolivia');
                $cId = is_array($c) ? ($c['id'] ?? 0) : ($c->id ?? 0);
                $cAddress = is_array($c) ? ($c['address'] ?? '') : ($c->address ?? '');
                $cPhone = is_array($c) ? ($c['phone'] ?? $c['whatsapp'] ?? '') : ($c->phone ?? $c->whatsapp ?? '');
                $cEmail = is_array($c) ? ($c['email'] ?? '') : ($c->email ?? '');
                $selectedBanner = request('banner', request('flyer'));

                $ogTitle = "{$cName} - Catálogo Oficial en LDR Comercial";
                $cleanDesc = trim(strip_tags($cDesc));
                $ogDescription = $cleanDesc ? \Illuminate\Support\Str::limit($cleanDesc, 150) : "Explora el catálogo de productos, precios y contacto directo de {$cName} en {$cCity}.";
                
                $imgParams = ['id' => $cId];
                if (!empty($selectedBanner)) {
                    $imgParams['banner'] = $selectedBanner;
                }
                $ogImage = route('companies.og-image', $imgParams);

                $companyJsonLd = [
                    '@context' => 'https://schema.org',
                    '@type' => 'LocalBusiness',
                    'name' => $cName,
                    'description' => $ogDescription,
                    'image' => $ogImage,
                    'url' => $currentUrl,
                    'telephone' => $cPhone,
                    'email' => $cEmail,
                    'address' => [
                        '@type' => 'PostalAddress',
                        'streetAddress' => $cAddress,
                        'addressLocality' => $cCity,
                        'addressCountry' => 'BO'
                    ]
                ];
            }
        @endphp
        <link rel="canonical" href="{{ $currentUrl }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $currentUrl }}">
        <meta property="og:site_name" content="LDR Comercial">
        <meta property="og:locale" content="es_BO">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDescription }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:secure_url" content="{{ $ogImage }}">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $ogTitle }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $ogTitle }}">
        <meta name="twitter:description" content="{{ $ogDescription }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        @if(!empty($companyJsonLd))
        <!-- Datos Estructurados JSON-LD Schema.org para Empresa (Google Local Business) -->
        <script type="application/ld+json">
        {!! json_encode($companyJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
        </script>
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Theme Detection (Evita parpadeo de modo oscuro) -->
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

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

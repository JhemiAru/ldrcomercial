import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const company = user?.company;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Tema Oscuro / Claro
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const isBuyer = user?.role === 'buyer';
    const isAdmin = user?.role === 'admin';
    const isCompany = !isBuyer && !isAdmin;

    const navItems = isAdmin
        ? [
              {
                  name: 'Panel Maestro',
                  href: route('admin.dashboard'),
                  active: route().current('admin.dashboard'),
                  badge: 'MASTER',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" />
                          <rect width="7" height="5" x="14" y="3" rx="1" />
                          <rect width="7" height="9" x="14" y="12" rx="1" />
                          <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                  ),
              },
              {
                  name: 'Administrar Empresas',
                  href: route('admin.companies.index'),
                  active: route().current('admin.companies.*'),
                  badge: 'ADMIN',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                          <path d="M9 18v.01" />
                      </svg>
                  ),
              },
              {
                  name: 'Gestión de Usuarios',
                  href: route('admin.users.index'),
                  active: route().current('admin.users.*'),
                  badge: 'ADMIN',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                  ),
              },
          ]
        : isBuyer
        ? [
              {
                  name: 'Mi Panel de Comprador',
                  href: route('dashboard'),
                  active: route().current('dashboard'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" />
                          <rect width="7" height="5" x="14" y="3" rx="1" />
                          <rect width="7" height="9" x="14" y="12" rx="1" />
                          <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                  ),
              },
              {
                  name: 'Explorar Empresas',
                  href: route('companies.index'),
                  active: route().current('companies.*'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                      </svg>
                  ),
              },
              {
                  name: 'Ofertas & Promociones',
                  href: route('offers.index'),
                  active: route().current('offers.*'),
                  badge: 'OFERTAS',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                  ),
              },
              {
                  name: 'Agenda & Eventos',
                  href: route('events.public'),
                  active: route().current('events.public'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                  ),
              },
              {
                  name: 'Empresas que Sigo',
                  href: route('dashboard') + '?tab=following',
                  active: false,
                  badge: 'FAV',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <polyline points="16 11 18 13 22 9" />
                      </svg>
                  ),
              },
              {
                  name: 'Productos con Me Gusta',
                  href: route('dashboard') + '?tab=likes',
                  active: false,
                  badge: 'LIKE',
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                  ),
              },
          ]
        : [
              {
                  name: 'Dashboard',
                  href: route('dashboard'),
                  active: route().current('dashboard'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" />
                          <rect width="7" height="5" x="14" y="3" rx="1" />
                          <rect width="7" height="9" x="14" y="12" rx="1" />
                          <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                  ),
              },
              {
                  name: 'Mi Empresa',
                  href: route('company.edit'),
                  active: route().current('company.*'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                          <path d="M9 18v.01" />
                      </svg>
                  ),
              },
              {
                  name: 'Catálogo & Precios',
                  href: route('products.index'),
                  active: route().current('products.*'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m7.5 4.27 9 5.15" />
                          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                          <path d="m3.3 7 8.7 5 8.7-5" />
                          <path d="M12 22V12" />
                      </svg>
                  ),
              },
              {
                  name: 'Agenda de Eventos',
                  href: route('events.index'),
                  active: route().current('events.*'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M3 10h18" />
                      </svg>
                  ),
              },
              {
                  name: 'Ventas y Cotizaciones',
                  href: route('sales.index'),
                  active: route().current('sales.*'),
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                      </svg>
                  ),
              },
              {
                  name: 'CRM y Clientes',
                  href: '#',
                  active: false,
                  comingSoon: true,
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                  ),
              },
              {
                  name: 'Inventario y Stock',
                  href: '#',
                  active: false,
                  comingSoon: true,
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                          <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                          <path d="M12 22.08V12" />
                      </svg>
                  ),
              },
              {
                  name: 'Facturación & Finanzas',
                  href: '#',
                  active: false,
                  comingSoon: true,
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M7 15h0M2 9.5h20" />
                      </svg>
                  ),
              },
              {
                  name: 'Reportes ERP',
                  href: '#',
                  active: false,
                  comingSoon: true,
                  icon: (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                  ),
              },
          ];

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const SidebarContent = () => (
        <>
            <div className="flex h-16 shrink-0 items-center px-6 gap-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] transition-colors">
                <div className="font-black text-xl text-slate-900 dark:text-white tracking-tight flex items-center transition-colors">
                    LDR<span className="text-orange-500">.</span>
                    <span className="ml-2 text-xs font-bold text-slate-400 border-l border-slate-200 dark:border-white/20 pl-2 uppercase tracking-widest hidden sm:inline-block">Panel</span>
                </div>
            </div>
            
            <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6 bg-white dark:bg-[#0b132b] transition-colors">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isComingSoon = item.comingSoon;
                        const Component = isComingSoon ? 'div' : Link;

                        return (
                            <Component
                                key={item.name}
                                href={!isComingSoon ? item.href : undefined}
                                onClick={!isComingSoon ? () => setIsSidebarOpen(false) : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                    item.active
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                        : isComingSoon 
                                            ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-80'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title={isComingSoon ? 'Próximamente' : ''}
                            >
                                <span className={`${item.active ? 'text-white' : isComingSoon ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400 group-hover:text-orange-500'}`}>
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                                        {item.badge}
                                    </span>
                                )}
                                {isComingSoon && (
                                    <span className="text-[9px] font-black uppercase tracking-wider text-orange-500/80 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-500/20">
                                        PROX
                                    </span>
                                )}
                            </Component>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-1">
                    <Link
                        href={route('profile.edit')}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition group"
                    >
                        <span className="text-slate-400 group-hover:text-orange-500">👤</span>
                        Cuenta de Usuario
                    </Link>
                    {isBuyer ? (
                        <>
                            <a
                                href={route('home')}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-slate-400 group-hover:text-blue-500">🌐</span>
                                    <span>Ir al Portal LDR</span>
                                </div>
                                <span className="text-xs text-slate-400">↗</span>
                            </a>

                            <div className="pt-2">
                                <a
                                    href={route('afiliacion')}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="block p-3 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-left hover:border-blue-500/40 transition group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-base">🏢</span>
                                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 group-hover:underline">¿Tienes un Negocio?</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                        Afiliate para publicar catálogo y vender al por mayor o menor.
                                    </p>
                                </a>
                            </div>
                        </>
                    ) : company?.id ? (
                        <>
                            <Link
                                href={route('companies.show', company.id)}
                                target="_blank"
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200/80 dark:border-blue-500/20 transition group"
                                title="Ver el perfil público de tu empresa tal como lo ven tus clientes"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-base shrink-0">🏪</span>
                                    <span className="truncate">Ver Perfil Público</span>
                                </div>
                                <span className="text-xs text-blue-500 shrink-0">↗</span>
                            </Link>

                            <a
                                href={route('home')}
                                target="_blank"
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition group"
                                title="Ir a la página principal del Portal Público LDR"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-slate-400 group-hover:text-orange-500">🌐</span>
                                    <span>Portal General LDR</span>
                                </div>
                                <span className="text-[11px] text-slate-400">↗</span>
                            </a>
                        </>
                    ) : (
                        <a
                            href={route('home')}
                            target="_blank"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition group"
                        >
                            <span className="text-slate-400 group-hover:text-orange-500">🌐</span>
                            Portal Público
                        </a>
                    )}
                </div>
            </nav>

            <div className="mt-auto p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] transition-colors">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold transition duration-200"
                >
                    <span>🚪</span>
                    Cerrar Sesión
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060a16] flex transition-colors duration-200">
            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 fixed inset-y-0 z-20 shadow-sm dark:shadow-none bg-white dark:bg-[#0b132b]">
                <SidebarContent />
            </aside>

            {/* SIDEBAR MÓVIL */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <div className="relative flex flex-col w-64 h-full shadow-2xl bg-white dark:bg-[#0b132b]">
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 rounded-full"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-[#0b132b] border-b border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        {/* THEME TOGGLE */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500 bg-slate-100 dark:bg-white/5 rounded-full transition"
                            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {isBuyer ? (
                            <Link
                                href={route('companies.index')}
                                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition"
                            >
                                <span>🔍</span>
                                Explorar Empresas
                            </Link>
                        ) : (
                            <Link
                                href={route('products.create')}
                                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm shadow-orange-500/20 transition"
                            >
                                <span>+</span>
                                Nuevo Producto
                            </Link>
                        )}

                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-slate-800 dark:text-white leading-tight flex items-center justify-end gap-1.5">
                                    {user?.role === 'admin' && (
                                        <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                                            ADMIN
                                        </span>
                                    )}
                                    {isBuyer && (
                                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/30">
                                            COMPRADOR
                                        </span>
                                    )}
                                    <span>{company?.name || user.name}</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    {user?.role === 'admin' ? user.email : isBuyer ? 'Cliente / Comprador' : company?.is_verified ? <span className="text-blue-600 dark:text-blue-400">✓ Verificado</span> : 'B2B Partner'}
                                </div>
                            </div>
                            {company?.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-white/10 shadow-sm bg-white"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                                    {userInitial}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Header (Optional) */}
                {header && (
                    <div className="bg-white/50 dark:bg-[#0b132b]/50 border-b border-slate-200/50 dark:border-white/5 backdrop-blur-md transition-colors">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            {header}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-white transition-colors">
                    {children}
                </main>
            </div>
        </div>
    );
}

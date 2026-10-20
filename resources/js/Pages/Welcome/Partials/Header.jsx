import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ categories = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('companies.index'), { search: searchQuery });
        }
    };

    return (
        <>
            {/* --- COMPACT MINIMALIST NAVBAR --- */}
            <header className="bg-[#0b132b] border-b border-white/10 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    
                    {/* LEFT: HAMBURGER & LOGO */}
                    <div className="flex items-center gap-4 shrink-0">
                        {/* Mobile & Sidebar Hamburger */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-1 -ml-1 text-slate-300 hover:text-orange-500 transition focus:outline-none lg:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="font-black text-2xl tracking-tighter text-white flex items-center">
                                LDR<span className="text-orange-500">.</span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: DESKTOP NAV LINKS */}
                    <nav className="hidden lg:block flex-1 pl-8">
                        <ul className="flex items-center gap-8 text-xs font-bold text-slate-300 tracking-wide uppercase">
                            <li><Link href="/" className="hover:text-orange-500 transition">Inicio</Link></li>
                            <li><Link href={route('categories.index')} className="hover:text-orange-500 transition">Categorías</Link></li>
                            <li><Link href={route('offers.index')} className="hover:text-orange-500 transition">Ofertas</Link></li>
                            <li><Link href={route('events.public')} className="hover:text-orange-500 transition">Eventos</Link></li>
                            <li><Link href={route('companies.index')} className="hover:text-orange-500 transition text-white">Directorio B2B</Link></li>
                        </ul>
                    </nav>

                    {/* RIGHT: SEARCH & ICONS */}
                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
                        
                        {/* Compact Search */}
                        <form onSubmit={handleSearch} className="hidden md:flex relative w-48 lg:w-64">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                            />
                            <button type="submit" className="absolute right-2 top-1.5 text-slate-400 hover:text-orange-500 transition">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Search Icon Mobile */}
                        <button className="md:hidden text-slate-300 hover:text-orange-500 transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>

                        {/* Account Icon */}
                        <Link href={route('login')} className="text-slate-300 hover:text-orange-500 transition relative">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* CTA Button / Cart */}
                        <div className="hidden sm:block">
                            <Link 
                                href={route('register')} 
                                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full transition shadow-lg shadow-orange-500/20 flex items-center gap-2"
                            >
                                Registrarse
                            </Link>
                        </div>
                        
                        {/* Hamburger Desktop for Sidebar Drawer */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="hidden lg:block p-1 text-slate-300 hover:text-orange-500 transition focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* --- SIDEBAR DRAWER (DARK THEMED) --- */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                    
                    {/* Drawer */}
                    <div className="relative w-full max-w-xs bg-[#0b132b] shadow-2xl flex flex-col h-full transform transition-transform border-l border-white/10">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <span className="text-orange-500">LDR.</span> Categorías
                            </h2>
                            <button 
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <ul className="space-y-1">
                                {categories && categories.length > 0 ? (
                                    categories.map(category => (
                                        <li key={category.id}>
                                            <Link 
                                                href={route('companies.index', { category: category.id })}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition group"
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:text-orange-500">{category.icon || '📌'}</span>
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-sm text-slate-500">No hay categorías disponibles.</li>
                                )}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10 px-4">
                                <Link 
                                    href={route('login')}
                                    className="block w-full text-center py-2 text-sm font-bold text-slate-300 border border-white/20 rounded-full hover:bg-white/10 transition mb-3"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link 
                                    href={route('register')}
                                    className="block w-full text-center py-2 text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                                >
                                    Crear mi Empresa
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

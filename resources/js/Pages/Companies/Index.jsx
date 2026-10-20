import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Header from '../Welcome/Partials/Header';

// Helper de Insignia Verificado
const VerifiedBadge = ({ size = 'sm' }) => {
    const dims = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <svg className={`${dims} text-blue-500`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
};

export default function CompaniesIndex({ companies, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const fallbackImage = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Sin+Imagen';

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('companies.index'), { search, category: filters?.category }, { preserveState: true });
    };

    const handleCategoryFilter = (categoryId) => {
        router.get(route('companies.index'), { search, category: categoryId }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Head title="Directorio de Empresas B2B" />

            <Header categories={categories} />

            {/* --- HERO DIRECTORY --- */}
            <div className="bg-slate-900 py-16 border-b border-gray-200 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">Empresas & Fabricantes</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base">
                        Directorio oficial de mayoristas, importadores y productores verificados en Bolivia. Compra sin intermediarios directamente de la fuente.
                    </p>
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex relative">
                        <input
                            type="text"
                            placeholder="Buscar empresa por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-gray-900 border-none rounded-full pl-6 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xl"
                        />
                        <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 w-12 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
                
                {/* SIDEBAR: FILTERS */}
                <aside className="w-full lg:w-[260px] shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24 shadow-sm">
                        <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase mb-4">Filtrar por Rubro</h3>
                        <ul className="space-y-2">
                            <li>
                                <button 
                                    onClick={() => handleCategoryFilter('')}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${!filters?.category ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Todos los rubros
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button 
                                        onClick={() => handleCategoryFilter(cat.id)}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition flex items-center gap-2 ${Number(filters?.category) === cat.id ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <span>{cat.icon || '🏢'}</span>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* COMPANY GRID */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-xl text-gray-800">
                            Resultados <span className="text-rose-500">({companies.total})</span>
                        </h2>
                        {filters?.category && (
                            <button onClick={() => handleCategoryFilter('')} className="text-xs text-gray-500 hover:text-rose-500 font-semibold underline">
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    {companies.data.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="font-bold text-gray-900 text-lg">No encontramos empresas</h3>
                            <p className="text-gray-500 text-sm mt-1">Intenta con otra búsqueda o selecciona un rubro distinto.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {companies.data.map(company => (
                                <div key={company.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300 group flex flex-col">
                                    <div className="h-32 bg-gray-100 relative">
                                        <img 
                                            src={company.banner || fallbackImage} 
                                            alt={company.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        />
                                        <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-white p-1 shadow-md border border-gray-100 z-10">
                                            <img 
                                                src={company.logo || fallbackImage} 
                                                alt={company.name} 
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <Link href={route('companies.show', company.id)} className="hover:underline">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-rose-600 transition">
                                                    {company.name}
                                                </h3>
                                            </Link>
                                            {company.is_verified && <VerifiedBadge />}
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider mb-3">
                                            {company.category?.name || 'Servicios'}
                                        </p>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                            {company.short_description || company.description || 'Sin descripción disponible.'}
                                        </p>
                                        
                                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span className="flex items-center gap-1">📍 {company.city || 'Bolivia'}</span>
                                            </div>
                                            {company.whatsapp && (
                                                <a 
                                                    href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="block text-center bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2 rounded-lg text-xs transition"
                                                >
                                                    Contactar por WhatsApp
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINACIÓN */}
                    {companies.links && companies.links.length > 3 && (
                        <div className="mt-10 flex justify-center flex-wrap gap-2">
                            {companies.links.map((link, i) => (
                                <Link 
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg border transition ${link.active ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:text-rose-500'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


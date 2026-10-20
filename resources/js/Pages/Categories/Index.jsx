import { Head, Link } from '@inertiajs/react';
import Header from '../Welcome/Partials/Header';

export default function CategoriesIndex({ categories }) {
    const fallbackImage = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Sin+Imagen';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-rose-500 selection:text-white">
            <Head title="Categorías" />

            {/* Reutilizamos el Header principal */}
            <Header categories={categories} />

            {/* --- HERO CATEGORIES --- */}
            <div className="bg-slate-900 py-16 border-b border-gray-200 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">Explora nuestras Categorías</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base">
                        Encuentra rápidamente el producto o servicio que buscas explorando por rubro. Miles de opciones directas del proveedor.
                    </p>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={route('companies.index', { category: category.id })}
                            className="bg-white rounded-2xl border border-gray-200 hover:border-rose-300 hover:shadow-xl transition duration-300 p-6 flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl group-hover:bg-rose-50 group-hover:scale-110 transition duration-300 mb-4 shadow-sm border border-gray-50">
                                {category.icon || '📦'}
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm group-hover:text-rose-600 transition">
                                {category.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-2 font-semibold">
                                {category.products_count} Productos
                            </p>
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">
                                    Ver Empresas →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm max-w-2xl mx-auto mt-10">
                        <div className="text-5xl mb-4">📂</div>
                        <h3 className="font-bold text-gray-900 text-lg">Aún no hay categorías</h3>
                        <p className="text-gray-500 text-sm mt-1">Vuelve pronto para descubrir nuevos rubros.</p>
                    </div>
                )}
            </main>

            {/* --- FOOTER SIMPLIFICADO --- */}
            <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800 mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="font-black text-xl tracking-tighter text-white">
                            LDR<span className="text-rose-500">.</span>
                        </div>
                    </div>
                    <div className="text-xs text-center">
                        © {new Date().getFullYear()} LDR Comercial. Catálogos transparentes.
                    </div>
                </div>
            </footer>
        </div>
    );
}


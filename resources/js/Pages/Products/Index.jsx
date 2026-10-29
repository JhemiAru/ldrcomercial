import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductIndex({ hasCompany, company, products, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) {
            router.delete(route('products.destroy', id));
        }
    };

    if (!hasCompany) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-bold text-gray-800">Catálogo de Productos & Precios</h2>
                }
            >
                <Head title="Productos y Precios" />
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                            <div className="text-4xl mb-4">🏢</div>
                            <h3 className="text-xl font-bold text-gray-900">Registra tu Empresa Primero</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                Para publicar productos y sus precios en la plataforma, primero debes completar los datos comerciales de tu empresa.
                            </p>
                            <Link
                                href={route('company.edit')}
                                className="mt-6 inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow"
                            >
                                Configurar Perfil de Empresa →
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Catálogo de Productos & Precios
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Gestiona tu lista de precios minoristas y cotizaciones B2B para {company?.name}
                        </p>
                    </div>
                    <Link
                        href={route('products.create')}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow transition"
                    >
                        + Nuevo Producto / Precio
                    </Link>
                </div>
            }
        >
            <Head title="Productos y Precios" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Search and Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-96">
                            <input
                                type="text"
                                className="w-full text-sm rounded-lg border-gray-300 bg-white text-slate-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Buscar por nombre o código SKU..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                            >
                                Buscar
                            </button>
                        </form>
                        <div className="text-sm text-gray-500">
                            Total: <span className="font-bold text-gray-900">{products.total || 0}</span> productos
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {products.data?.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-3">🏷️</div>
                                <h4 className="text-lg font-bold text-gray-900">Aún no tienes productos publicados</h4>
                                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                                    Comienza publicando tus artículos con precio individual o mayorista para que los clientes te encuentren.
                                </p>
                                <Link
                                    href={route('products.create')}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow"
                                >
                                    Publicar Mi Primer Producto
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Producto</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Rubro</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Precio Regular</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Precio B2B / Mayor</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Stock</th>
                                            <th className="px-6 py-3.5 text-right font-semibold text-gray-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {products.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/70 transition">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">{item.name}</div>
                                                    {item.sku && (
                                                        <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {item.category?.name || 'General'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-gray-900">
                                                        {item.currency} {Number(item.price).toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-gray-400 block">/ {item.unit}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.wholesale_price ? (
                                                        <div>
                                                            <span className="font-semibold text-emerald-700">
                                                                {item.currency} {Number(item.wholesale_price).toFixed(2)}
                                                            </span>
                                                            <span className="text-xs text-emerald-600 block">
                                                                Desde {item.min_wholesale_qty} {item.unit}s
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No aplica</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.in_stock ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            {item.stock_quantity ? `${item.stock_quantity} disp.` : 'Disponible'}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            Agotado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link
                                                        href={route('products.edit', item.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="text-red-600 hover:text-red-900 font-medium ml-2"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

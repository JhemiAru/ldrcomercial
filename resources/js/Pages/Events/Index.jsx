import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function EventIndex({ hasCompany, company, events }) {
    const handleDelete = (id, title) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el evento "${title}"?`)) {
            router.delete(route('events.destroy', id));
        }
    };

    const typeBadges = {
        fair: { label: 'Feria Comercial', color: 'bg-purple-100 text-purple-800' },
        promo: { label: 'Promoción / Oferta', color: 'bg-emerald-100 text-emerald-800' },
        webinar: { label: 'Webinar / Online', color: 'bg-blue-100 text-blue-800' },
        launch: { label: 'Lanzamiento', color: 'bg-amber-100 text-amber-800' },
        discount: { label: 'Descuento Especial', color: 'bg-rose-100 text-rose-800' },
    };

    if (!hasCompany) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-bold text-gray-800">Eventos & Ofertas Comerciales</h2>
                }
            >
                <Head title="Eventos y Promociones" />
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                            <div className="text-4xl mb-4">🏢</div>
                            <h3 className="text-xl font-bold text-gray-900">Registra tu Empresa Primero</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                Para publicar ferias, webinars o promociones con fecha, primero debes tener tu perfil comercial activo.
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
                            Eventos, Ferias & Promociones
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Publicaciones con fecha y hora para ganar visibilidad comercial en {company?.name}
                        </p>
                    </div>
                    <Link
                        href={route('events.create')}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow transition"
                    >
                        + Nuevo Evento o Promoción
                    </Link>
                </div>
            }
        >
            <Head title="Eventos y Promociones" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {events.data?.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-3">📅</div>
                                <h4 className="text-lg font-bold text-gray-900">No tienes eventos o promociones publicadas</h4>
                                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                                    Organiza un evento presencial, rueda de negocios, descuento por tiempo limitado o demostración de productos.
                                </p>
                                <Link
                                    href={route('events.create')}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow"
                                >
                                    Publicar Primer Evento
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Título del Evento</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Tipo</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Modalidad / Lugar</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Fecha y Hora</th>
                                            <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Acceso</th>
                                            <th className="px-6 py-3.5 text-right font-semibold text-gray-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {events.data.map((item) => {
                                            const badge = typeBadges[item.event_type] || { label: item.event_type, color: 'bg-gray-100 text-gray-800' };
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50/70 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900">{item.title}</div>
                                                        {item.short_description && (
                                                            <div className="text-xs text-gray-500 line-clamp-1">{item.short_description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div className="font-medium">
                                                            {item.modality === 'in_person' ? '📍 Presencial' : item.modality === 'online' ? '💻 Virtual' : '🔄 Híbrido'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {item.location_name || item.city || 'Por confirmar'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div className="font-medium">
                                                            {new Date(item.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.admission_type === 'free' ? (
                                                            <span className="text-emerald-700 font-semibold text-xs">Gratuito</span>
                                                        ) : (
                                                            <span className="text-gray-900 font-semibold text-xs">
                                                                {item.admission_price ? `BOB ${item.admission_price}` : 'Registro'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <Link
                                                            href={route('events.edit', item.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.title)}
                                                            className="text-red-600 hover:text-red-900 font-medium ml-2"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

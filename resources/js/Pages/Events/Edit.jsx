import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditEvent({ event }) {
    // Format dates to YYYY-MM-DDTHH:mm for datetime-local
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        short_description: event.short_description || '',
        description: event.description || '',
        event_type: event.event_type || 'fair',
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        modality: event.modality || 'in_person',
        location_name: event.location_name || '',
        address: event.address || '',
        city: event.city || '',
        link: event.link || '',
        admission_type: event.admission_type || 'free',
        admission_price: event.admission_price || '',
        is_featured: Boolean(event.is_featured),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('events.update', event.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-800">
                            Editar Evento: {event.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Modifica fechas, modalidad o detalles de la publicación
                        </p>
                    </div>
                    <Link
                        href={route('events.index')}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        ← Volver a eventos
                    </Link>
                </div>
            }
        >
            <Head title={`Editar ${event.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Información General */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Detalles del Evento
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="title" value="Título o Nombre del Evento *" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.title} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="event_type" value="Tipo de Evento *" />
                                        <select
                                            id="event_type"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.event_type}
                                            onChange={(e) => setData('event_type', e.target.value)}
                                        >
                                            <option value="fair">Feria Comercial / Exposición</option>
                                            <option value="promo">Promoción por Tiempo Limitado</option>
                                            <option value="discount">Descuento Especial de Temporada</option>
                                            <option value="webinar">Webinar / Capacitación Virtual</option>
                                            <option value="launch">Lanzamiento de Producto</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.event_type} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="modality" value="Modalidad *" />
                                        <select
                                            id="modality"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.modality}
                                            onChange={(e) => setData('modality', e.target.value)}
                                        >
                                            <option value="in_person">Presencial</option>
                                            <option value="online">Virtual / En línea</option>
                                            <option value="hybrid">Híbrido (Presencial + Transmisión)</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.modality} />
                                    </div>
                                </div>
                            </div>

                            {/* Fechas y Horarios */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Fechas y Horarios
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Fecha y Hora de Inicio *" />
                                        <TextInput
                                            id="start_date"
                                            type="datetime-local"
                                            className="mt-1 block w-full"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.start_date} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="end_date" value="Fecha y Hora de Finalización" />
                                        <TextInput
                                            id="end_date"
                                            type="datetime-local"
                                            className="mt-1 block w-full"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.end_date} />
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación y Enlaces */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Ubicación y Asistencia
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="location_name" value="Lugar / Recinto / Plataforma" />
                                        <TextInput
                                            id="location_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.location_name}
                                            onChange={(e) => setData('location_name', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.location_name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="city" value="Ciudad" />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.city} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="address" value="Dirección" />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.address} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="admission_type" value="Condición de Entrada" />
                                        <select
                                            id="admission_type"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.admission_type}
                                            onChange={(e) => setData('admission_type', e.target.value)}
                                        >
                                            <option value="free">Entrada Libre / Gratuita</option>
                                            <option value="registration_required">Requiere Registro Previo</option>
                                            <option value="paid">Con Costo de Entrada</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.admission_type} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="admission_price" value="Precio de Entrada (si aplica)" />
                                        <TextInput
                                            id="admission_price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.admission_price}
                                            onChange={(e) => setData('admission_price', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.admission_price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="link" value="Enlace de Registro / Transmisión" />
                                        <TextInput
                                            id="link"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.link} />
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Descripción y Programa
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="short_description" value="Resumen Breve del Evento" />
                                        <TextInput
                                            id="short_description"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.short_description} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="description" value="Detalles del Evento o Condiciones" />
                                        <textarea
                                            id="description"
                                            rows="4"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('events.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700">
                                    {processing ? 'Guardando...' : 'Actualizar Evento'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

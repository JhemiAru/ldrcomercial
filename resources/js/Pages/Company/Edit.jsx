import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EditCompany({ company, categories = [], status }) {
    const { data, setData, post, processing, errors } = useForm({
        name: company?.name || '',
        legal_name: company?.legal_name || '',
        category_id: company?.category_id || '',
        tax_id: company?.tax_id || '',
        short_description: company?.short_description || '',
        description: company?.description || '',
        phone: company?.phone || '',
        whatsapp: company?.whatsapp || '',
        email: company?.email || '',
        website: company?.website || '',
        address: company?.address || '',
        city: company?.city || '',
        department: company?.department || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('company.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-gray-800">
                        Perfil de Mi Empresa
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Esta información será visible en el directorio comercial y en tus productos
                    </p>
                </div>
            }
        >
            <Head title="Perfil de Empresa" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                            ✓ {status}
                        </div>
                    )}

                    {company && (
                        <div className="mb-6 p-4 rounded-xl border flex items-center justify-between gap-4 bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                                {company.is_verified ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                                        ⏱️
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Estado de Verificación del Negocio:
                                        </h4>
                                        {company.is_verified ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                ✓ Negocio Verificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                ⏳ En proceso de validación
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {company.is_verified
                                            ? 'Tu negocio cuenta con la insignia de verificado en la vitrina pública, inspirando mayor confianza a compradores.'
                                            : 'Completa tus datos de NIT, dirección y contacto para que el administrador valide tu empresa.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Identificación de la Empresa */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Información General
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Nombre Comercial del Negocio *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Ej. Distribuidora Central SRL"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category_id" value="Rubro / Sector Principal" />
                                        <select
                                            id="category_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                        >
                                            <option value="">Selecciona un rubro comercial</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.category_id} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="legal_name" value="Razón Social (Opcional)" />
                                        <TextInput
                                            id="legal_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.legal_name}
                                            onChange={(e) => setData('legal_name', e.target.value)}
                                            placeholder="Nombre registrado formalmente"
                                        />
                                        <InputError className="mt-2" message={errors.legal_name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tax_id" value="NIT / RUC / Identificación Fiscal" />
                                        <TextInput
                                            id="tax_id"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.tax_id}
                                            onChange={(e) => setData('tax_id', e.target.value)}
                                            placeholder="Número de identificación tributaria"
                                        />
                                        <InputError className="mt-2" message={errors.tax_id} />
                                    </div>
                                </div>
                            </div>

                            {/* Contacto & WhatsApp */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Canales de Contacto & Ventas Directas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="whatsapp" value="Número de WhatsApp Comercial" />
                                        <TextInput
                                            id="whatsapp"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            placeholder="Ej. 59170000000 (sin espacios ni signos)"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Los compradores podrán enviarte consultas y cotizaciones directamente a este WhatsApp.
                                        </p>
                                        <InputError className="mt-2" message={errors.whatsapp} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="phone" value="Teléfono Fijo / Centralita" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Ej. +591 3 3330000"
                                        />
                                        <InputError className="mt-2" message={errors.phone} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Correo Electrónico de Ventas" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="ventas@tuempresa.com"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="website" value="Sitio Web / Tienda Online" />
                                        <TextInput
                                            id="website"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://tuempresa.com"
                                        />
                                        <InputError className="mt-2" message={errors.website} />
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Ubicación Geográfica
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="city" value="Ciudad / Municipio" />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Ej. Santa Cruz, La Paz, Cochabamba"
                                        />
                                        <InputError className="mt-2" message={errors.city} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="department" value="Departamento / Estado / Región" />
                                        <TextInput
                                            id="department"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            placeholder="Ej. Santa Cruz"
                                        />
                                        <InputError className="mt-2" message={errors.department} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="address" value="Dirección Física" />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Calle, avenida o zona comercial"
                                        />
                                        <InputError className="mt-2" message={errors.address} />
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Descripción y Presentación Comercial
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="short_description" value="Lema o Resumen Corto (Máx. 250 caracteres)" />
                                        <TextInput
                                            id="short_description"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="Ej. Distribuidor mayorista líder en equipamiento industrial y repuestos originales."
                                        />
                                        <InputError className="mt-2" message={errors.short_description} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="description" value="Acerca de la Empresa / Historia / Servicios" />
                                        <textarea
                                            id="description"
                                            rows="4"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe tu trayectoria, condiciones comerciales, líneas de producto que representas, etc."
                                        />
                                        <InputError className="mt-2" message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                                <PrimaryButton disabled={processing} className="px-6 py-2.5">
                                    {processing ? 'Guardando...' : 'Guardar Información de Empresa'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

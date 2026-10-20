import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateProduct({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        sku: '',
        short_description: '',
        description: '',
        price: '',
        original_price: '',
        wholesale_price: '',
        min_wholesale_qty: '1',
        currency: 'BOB',
        price_type: 'fixed',
        unit: 'unidad',
        main_image: '',
        in_stock: true,
        stock_quantity: '',
        is_featured: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-800">
                            Publicar Nuevo Producto o Precio
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Agrega un artículo con precio minorista y opción de escala mayorista B2B
                        </p>
                    </div>
                    <Link
                        href={route('products.index')}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        ← Volver a productos
                    </Link>
                </div>
            }
        >
            <Head title="Publicar Producto" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Información básica */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Detalles del Producto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="name" value="Nombre del Producto / Servicio *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Ej. Servidor Dell PowerEdge R450 2U"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category_id" value="Categoría / Rubro" />
                                        <select
                                            id="category_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.category_id} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sku" value="Código SKU / Modelo (Opcional)" />
                                        <TextInput
                                            id="sku"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Ej. SRV-DELL-450"
                                        />
                                        <InputError className="mt-2" message={errors.sku} />
                                    </div>
                                </div>
                            </div>

                            {/* Esquema de Precios */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Precios y Condiciones Comerciales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="currency" value="Moneda" />
                                        <select
                                            id="currency"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                        >
                                            <option value="BOB">BOB (Bolivianos)</option>
                                            <option value="USD">USD (Dólares)</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.currency} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="price" value="Precio Regular / Minorista *" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                            placeholder="0.00"
                                        />
                                        <InputError className="mt-2" message={errors.price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="original_price" value="Precio Anterior / Referencia (Opcional)" />
                                        <TextInput
                                            id="original_price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.original_price}
                                            onChange={(e) => setData('original_price', e.target.value)}
                                            placeholder="Para mostrar % descuento"
                                        />
                                        <InputError className="mt-2" message={errors.original_price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit" value="Unidad de Medida" />
                                        <TextInput
                                            id="unit"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            placeholder="unidad, metro, caja, kg"
                                        />
                                        <InputError className="mt-2" message={errors.unit} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="main_image" value="URL de la Fotografía del Producto (Opcional)" />
                                        <TextInput
                                            id="main_image"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.main_image}
                                            onChange={(e) => setData('main_image', e.target.value)}
                                            placeholder="https://ejemplo.com/foto.jpg"
                                        />
                                        <InputError className="mt-2" message={errors.main_image} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="wholesale_price" value="Precio Mayorista / B2B (Opcional)" />
                                        <TextInput
                                            id="wholesale_price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.wholesale_price}
                                            onChange={(e) => setData('wholesale_price', e.target.value)}
                                            placeholder="Precio con descuento B2B"
                                        />
                                        <InputError className="mt-2" message={errors.wholesale_price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="min_wholesale_qty" value="Cantidad Mínima para Mayorista" />
                                        <TextInput
                                            id="min_wholesale_qty"
                                            type="number"
                                            min="1"
                                            className="mt-1 block w-full"
                                            value={data.min_wholesale_qty}
                                            onChange={(e) => setData('min_wholesale_qty', e.target.value)}
                                            placeholder="Ej. 5"
                                        />
                                        <InputError className="mt-2" message={errors.min_wholesale_qty} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="stock_quantity" value="Cantidad en Stock (Opcional)" />
                                        <TextInput
                                            id="stock_quantity"
                                            type="number"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            placeholder="Ej. 10"
                                        />
                                        <InputError className="mt-2" message={errors.stock_quantity} />
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Descripción y Especificaciones
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="short_description" value="Resumen Comercial Rápido" />
                                        <TextInput
                                            id="short_description"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="Ej. Equipo de alto rendimiento con garantía de 1 año y soporte en sitio."
                                        />
                                        <InputError className="mt-2" message={errors.short_description} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="description" value="Descripción Detallada / Ficha Técnica" />
                                        <textarea
                                            id="description"
                                            rows="4"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Detalla las características técnicas, términos de entrega, garantía, etc."
                                        />
                                        <InputError className="mt-2" message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('products.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Guardando...' : 'Publicar Producto'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

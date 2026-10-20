import { SmallProductRow } from './WelcomeUtils';

export default function ProductShowcase({ promotionalProducts, featuredProducts }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:pl-[292px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Column 1: Ofertas */}
                <div>
                    <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase mb-5 border-b border-gray-200 pb-2">Nuevas Ofertas</h3>
                    <div className="flex flex-col gap-5">
                        {promotionalProducts.slice(0, 3).map(prod => (
                            <SmallProductRow key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>

                {/* Column 2: Tendencias */}
                <div>
                    <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase mb-5 border-b border-gray-200 pb-2">En Tendencia</h3>
                    <div className="flex flex-col gap-5">
                        {featuredProducts.slice(4, 7).map(prod => (
                            <SmallProductRow key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>

                {/* Column 3: Más Valorados */}
                <div>
                    <h3 className="font-bold text-sm tracking-wide text-gray-800 uppercase mb-5 border-b border-gray-200 pb-2">Más Buscados</h3>
                    <div className="flex flex-col gap-5">
                        {promotionalProducts.slice(3, 6).map(prod => (
                            <SmallProductRow key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


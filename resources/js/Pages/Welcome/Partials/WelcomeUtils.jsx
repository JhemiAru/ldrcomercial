export const fallbackImage = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Sin+Imagen';

export const getPromoWhatsAppUrl = (company, product, discount = 0) => {
    if (!company?.whatsapp) return '#';
    const num = company.whatsapp.replace(/[^0-9]/g, '');
    let text = `Hola, vi tu producto "${product?.name}" en LDR Comercial.`;
    if (discount > 0) text = `Hola, vi tu producto "${product?.name}" con ${discount}% OFF en LDR Comercial.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export const Stars = () => (
    <div className="flex text-yellow-400 text-[10px]">
        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
    </div>
);

export const VerifiedBadge = ({ size = 'sm' }) => {
    const dims = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <svg className={`${dims} text-blue-500`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
};

export const SmallProductRow = ({ product }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-20 h-20 rounded-md bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
            <img
                src={product.main_image || fallbackImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                onError={(e) => { e.currentTarget.src = fallbackImage; }}
            />
        </div>
        <div className="flex-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{product.category?.name}</p>
            <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-rose-500 transition">
                {product.name}
            </h4>
            <div className="my-1"><Stars /></div>
            <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold text-sm">
                    {product.currency} {Number(product.price).toFixed(2)}
                </span>
                {product.original_price > product.price && (
                    <span className="text-gray-400 text-xs line-through">
                        {product.currency} {Number(product.original_price).toFixed(2)}
                    </span>
                )}
            </div>
        </div>
    </div>
);


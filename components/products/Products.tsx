import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/Button';
import { Product } from '@/data/types';
import Link from 'next/link';

interface ProductProps {
    product: Product;
    showUser?: boolean;
    showStatus?: boolean;
}

const Products: React.FC<ProductProps> = ({ product, showUser = true, showStatus = true }) => {
    return (
        <div className="flex min-h-50 flex-col rounded-2xl bg-gray-50 p-4 shadow-lg dark:bg-gray-800">
            {/* User */}
            {showUser && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative h-15 w-15 rounded-4xl bg-blue-50 p-2">
                        {product.profile_pic_url ? (
                            <Image
                                src={product.profile_pic_url || ''}
                                alt={`${product.full_name}`}
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-8 w-8 p-4 text-gray-400" />
                        )}
                    </div>
                    <span className="text-black dark:text-white">{product.full_name}</span>
                </div>
            )}

            {/* Image */}
            <div className="relative h-50 w-full">
                <Image
                    src={product.image_url || '/images/default-product-image.png'}
                    alt="Test Image"
                    fill
                />

                {showStatus && !product.is_avail && (
                    <>
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute top-2 left-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow">
                            Sold
                        </div>
                    </>
                )}
            </div>

            {/* Product Details */}
            <div className="my-3 flex grow flex-col justify-between gap-1 text-black dark:text-white">
                <span className="flex items-center gap-2 text-lg font-semibold">
                    {product.item_name}
                    {showStatus && (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.is_avail ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {product.is_avail ? 'Available' : 'Sold'}
                        </span>
                    )}
                </span>
                <span>₱{product.item_price}</span>
            </div>

            {/* Button */}
            <div className="flex justify-center">
                <Link
                    href={`/products/${product.listing_id}`}
                    className="w-full"
                >
                    <Button label="View Product" />
                </Link>
            </div>
        </div>
    );
};

export default Products;

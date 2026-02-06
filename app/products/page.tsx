import Products from '@/components/products/Products';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getProducts } from '@/lib/dal/product-dal';
import { ProductFilters } from '@/types/products';
import FilterProducts from '@/app/products/filter-products';
import { JSX, Suspense } from 'react';

type PageProps = {
    searchParams: Promise<{
        category?: string;
        search?: string;
        condition?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    }>;
};

async function ProductsList({ filters }: { filters: ProductFilters }): Promise<JSX.Element> {
    const products = await getProducts(filters);

    return (
        <>
            {/* Results Summary */}
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {products.length > 0 ? (
                        <span>
                            Showing {products.length} product
                            {products.length !== 1 ? 's' : ''}
                            {filters.search && (
                                <span>
                                    {' '}
                                    for &ldquo;
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {filters.search}
                                    </span>
                                    &rdquo;
                                </span>
                            )}
                        </span>
                    ) : (
                        <span>No products found</span>
                    )}
                </div>
            </div>

            {/* Products Grid or Empty State */}
            {products.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-12 text-center dark:bg-gray-800">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                        <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        No products found
                    </h3>
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                        Try adjusting your filters or search terms to find what you&apos;re looking
                        for.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Clear all filters
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Products
                            key={product.listing_id}
                            product={product}
                            showUser
                        />
                    ))}
                </div>
            )}
        </>
    );
}

function ProductsLoading(): JSX.Element {
    return (
        <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default async function ProductsPage({ searchParams }: PageProps): Promise<JSX.Element> {
    const params = await searchParams;

    const filters: ProductFilters = {
        category: params.category as ProductFilters['category'],
        search: params.search,
        condition: params.condition as ProductFilters['condition'],
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        sort: params.sort as ProductFilters['sort'],
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />

            {/* Page Header */}
            <div className="mx-auto mt-4 flex w-full max-w-7xl items-center gap-2 p-4">
                <Link
                    href="/"
                    className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Back to home"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Browse Products</h1>
            </div>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-6 sm:px-6 lg:px-8">
                <Suspense
                    fallback={
                        <div className="mb-6 h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                    }
                >
                    <FilterProducts />
                </Suspense>

                <Suspense fallback={<ProductsLoading />}>
                    <ProductsList filters={filters} />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}

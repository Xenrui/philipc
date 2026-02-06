import Banner from '@/components/HomeBanner';
import Navigation from '@/components/Navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Products from '@/components/products/Products';
import CategoriesList from '@/components/CategoriesList';
import Footer from '@/components/Footer';
import { getLandingAllProducts } from '@/lib/dal/product-dal';
import { JSX } from 'react';

const Home = async (): Promise<JSX.Element> => {
    const products = await getLandingAllProducts();

    return (
        <div className="flex min-h-screen flex-col bg-gray-200 dark:bg-gray-900">
            <Navigation />
            {/* Home Page */}
            <div className="mx-3 flex flex-1 flex-col">
                <Banner />
                {/* Recommendations */}
                <section
                    id="recommendations"
                    className="m-4 mx-auto w-full max-w-7xl"
                >
                    <div className="flex justify-between">
                        <div className="text-black dark:text-white">
                            <span className="text-lg font-semibold">Recommended for you</span>
                        </div>
                        <div className="">
                            <Link
                                href={'/products'}
                                className="text-primary flex hover:text-blue-700 hover:underline"
                            >
                                View All
                                <ChevronRight className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>

                    <div className="mb-4 grid grid-flow-row gap-5 px-2 py-5 sm:grid-cols-2 md:px-5 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => {
                            return (
                                <Products
                                    key={product.listing_id}
                                    product={product}
                                    showStatus={false}
                                />
                            );
                        })}
                    </div>
                </section>
                <section
                    id="categories"
                    className="mx-auto my-4 w-full max-w-7xl"
                >
                    <div className="flex justify-between">
                        <div className="text-black dark:text-white">
                            <span className="text-lg font-semibold">Explore Categories</span>
                        </div>
                    </div>
                    <div className="">
                        <CategoriesList />
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Home;

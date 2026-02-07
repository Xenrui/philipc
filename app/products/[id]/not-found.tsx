import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PackageX, ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound(): React.JSX.Element {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <div className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <PackageX className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Product Not Found
                    </h1>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">
                        The product you&apos;re looking for doesn&apos;t exist or may have been
                        removed by the seller.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Search className="h-4 w-4" />
                            Browse Products
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

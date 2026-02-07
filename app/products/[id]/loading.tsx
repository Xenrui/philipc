import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ProductLoading(): React.JSX.Element {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <div className="w-full flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Breadcrumb skeleton */}
                    <div className="mb-6 flex items-center space-x-2">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <span className="text-gray-400">/</span>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <span className="text-gray-400">/</span>
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Image carousel skeleton */}
                        <div className="aspect-square animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

                        {/* Product info skeleton */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <hr className="border-gray-300 dark:border-gray-600" />
                                <div className="flex items-center justify-between">
                                    <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                            <div className="flex gap-3">
                                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Seller info skeleton */}
                    <div className="mb-8 animate-pulse rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Reviews skeleton */}
                    <div className="mb-8 animate-pulse rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-4 h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="border-b border-gray-200 pb-4 dark:border-gray-700"
                                >
                                    <div className="mb-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

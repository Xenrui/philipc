'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps): React.JSX.Element {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <div className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Something went wrong
                    </h1>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        We encountered an error while loading this product. This might be a
                        temporary issue.
                    </p>
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 text-left text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                            <p className="font-medium">Error details:</p>
                            <p className="mt-1 font-mono text-xs">{error.message}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </button>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            <Home className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

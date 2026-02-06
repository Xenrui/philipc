'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { JSX, KeyboardEvent, useCallback, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import { sortOptions, conditionOptions } from '@/data/searchFilters';
import { Search, X, Filter } from 'lucide-react';

export default function FilterProducts(): JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        condition: searchParams.get('condition') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '',
        search: searchParams.get('search') || '',
    });

    const hasActiveFilters = Object.values(filters).some((value) => value !== '');

    const updateFilter = (key: keyof typeof filters, value: string): void => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim()) {
                params.set(key, value.trim());
            }
        });

        router.push(`/products?${params.toString()}`);
    }, [filters, router]);

    const clearFilters = useCallback(() => {
        setFilters({
            condition: '',
            minPrice: '',
            maxPrice: '',
            sort: '',
            search: '',
        });
        router.push('/products');
    }, [router]);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    return (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters & Search
                </h2>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <X className="h-4 w-4" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Sort */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sort by Price
                    </label>
                    <Dropdown
                        label=""
                        options={sortOptions}
                        selected={filters.sort}
                        onChange={(value) => updateFilter('sort', value)}
                        placeholder="Select sorting..."
                    />
                </div>

                {/* Condition */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Condition
                    </label>
                    <Dropdown
                        label=""
                        options={conditionOptions}
                        selected={filters.condition}
                        onChange={(value) => updateFilter('condition', value)}
                        placeholder="Any condition"
                    />
                </div>

                {/* Min Price */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Min Price (₱)
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Max Price */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Price (₱)
                    </label>
                    <input
                        type="number"
                        placeholder="No limit"
                        min="0"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <button
                onClick={applyFilters}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
                <Search className="h-4 w-4" />
                Apply Filters
            </button>
        </div>
    );
}

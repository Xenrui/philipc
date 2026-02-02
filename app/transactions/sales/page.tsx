'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Star } from 'lucide-react';
import { Transaction } from '@/data/types';

const SalesPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async (): Promise<void> => {
            try {
                const res = await fetch('/api/transactions/sales');
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const json = await res.json();
                if (json.success && json.data) {
                    setTransactions(json.data);
                }
            } catch (error) {
                console.error('Error fetching sales:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-32 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-800"
                    ></div>
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                No sales yet. List items to start selling!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <div
                    key={transaction.transac_id}
                    className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
                >
                    <div className="flex gap-4">
                        <div className="relative h-17 w-17 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
                            {transaction.image_url ? (
                                <Image
                                    src={transaction.image_url}
                                    alt={transaction.item_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <Link
                                href={`/products/${transaction.listing_id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                                {transaction.item_name}
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Condition: {transaction.item_condition}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Buyer:{' '}
                                <Link
                                    href={`/users/${transaction.buyer_username}`}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {transaction.buyer_name}
                                </Link>
                            </p>
                            <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                                ₱{transaction.offer_price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    transaction.transac_done
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                            >
                                {transaction.transac_done ? 'Completed' : 'Pending'}
                            </span>
                            {transaction.review_rating && (
                                <div className="mt-2 flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-1 dark:bg-yellow-900/30">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold dark:text-white">
                                        {transaction.review_rating}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {transaction.review_text && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-600">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Buyer Review:
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {transaction.review_text}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SalesPage;

import React, { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import TransactionTabs from './components/TransactionTabs';
import TransactionSummary from './components/TransactionSummary';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TransactionsLayout: React.FC<{ children: ReactNode }> = ({
    children,
}: {
    children: ReactNode;
}) => {
    return (
        <div className="flex min-h-screen flex-col dark:bg-gray-900">
            <Navigation />
            <div className="mx-auto w-full max-w-7xl flex-1 flex-col p-3 md:p-6">
                {/* Page Header */}
                <div className="mx-auto mt-4 flex max-w-7xl gap-2 p-4">
                    <Link
                        className="text-gray-900 hover:cursor-pointer dark:text-white"
                        href={'/'}
                    >
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {' '}
                        My Transactions & Offers
                    </h1>
                </div>

                {/* Summary Cards */}
                <TransactionSummary />

                {/* Tabs */}
                <TransactionTabs />

                {/* Tab Content */}
                <div className="mt-4">{children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default TransactionsLayout;

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton(): React.JSX.Element {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
    );
}

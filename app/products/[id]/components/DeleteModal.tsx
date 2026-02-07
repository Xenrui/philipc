'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertCircle } from 'lucide-react';
import { deleteProductAction } from '../actions';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    listingId: number;
}

export default function DeleteModal({
    isOpen,
    onClose,
    productName,
    listingId,
}: DeleteModalProps): React.JSX.Element | null {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true);
        setError(null);

        try {
            const result = await deleteProductAction(listingId);
            if (result.success) {
                router.push('/products');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = (): void => {
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                        <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Delete Product
                    </h3>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete &quot;{productName}&quot;? This action cannot be
                    undone and will permanently remove the listing and all its images.
                </p>

                {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

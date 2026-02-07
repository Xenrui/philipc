'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { submitOfferAction } from '../actions';

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    listingId: number;
}

export default function OfferModal({
    isOpen,
    onClose,
    productName,
    listingId,
}: OfferModalProps): React.JSX.Element | null {
    const [offerPrice, setOfferPrice] = useState('');
    const [offerError, setOfferError] = useState('');
    const [offerSuccess, setOfferSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOfferSubmit = async (): Promise<void> => {
        const numericPrice = Number(offerPrice);
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            setOfferError('Enter a valid offer amount.');
            return;
        }

        setIsSubmitting(true);
        setOfferError('');

        try {
            const result = await submitOfferAction(listingId, numericPrice);

            if (!result.success) {
                setOfferError(result.message);
                setOfferSuccess(false);
            } else {
                setOfferError('');
                setOfferSuccess(true);
                setOfferPrice('');
                // Auto-close modal after 2 seconds on success
                setTimeout(() => {
                    onClose();
                    setOfferSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Offer submission error:', error);
            setOfferError('Failed to submit offer');
            setOfferSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (): void => {
        onClose();
        setOfferError('');
        setOfferSuccess(false);
        setOfferPrice('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClose}
                        className="rounded-full border border-gray-200 p-2 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-200">
                            Make an offer
                        </p>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {productName}
                        </h3>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    {offerSuccess && (
                        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-200 dark:ring-green-800/40">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="font-semibold">Offer sent successfully!</p>
                                    <p className="text-xs opacity-90">
                                        The seller will review your offer soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {offerError && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-800/40">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="font-semibold">Failed to send offer</p>
                                    <p className="text-xs opacity-90">{offerError}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {!offerSuccess && (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Your offer (₱)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="e.g., 1000"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                    Meet in a safe place
                                </span>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                    Respect seller response time
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleOfferSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Offer'}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

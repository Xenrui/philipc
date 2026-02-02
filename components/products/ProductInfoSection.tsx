'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product as ProductType, UserSession } from '@/data/types';
import { Edit, Trash2, MapPin, Share2, Copy, Check, Phone, Facebook } from 'lucide-react';

interface ProductInfoSectionProps {
    product: ProductType;
    user: UserSession | null;
    isAvail: boolean;
    isOfferModalOpen: boolean;
    onOfferClick: () => void;
    onDeleteClick: () => void;
    offerStatus: 'idle' | 'success';
    contactNo: string | null;
    fbLink: string | null;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
    product,
    user,
    isAvail,
    onOfferClick,
    onDeleteClick,
    offerStatus,
    contactNo,
    fbLink,
}) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleShareClick = (): void => {
        setIsShareModalOpen(true);
    };

    const handleContactClick = (): void => {
        setIsContactModalOpen(true);
    };

    const handleCopyLink = async (): Promise<void> => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setIsShareModalOpen(false);
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleViewFacebook = (): void => {
        if (fbLink) {
            window.open(fbLink, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {product.item_name}
                    </h1>
                    <hr className="border-gray-400" />

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-blue-500 dark:text-white">
                                ₱ {product.item_price}
                            </p>
                        </div>
                        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:bg-blue-900/30 dark:text-blue-200">
                            Asking Price
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${isAvail ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {isAvail ? 'Available' : 'Sold'}
                        </span>
                        <span className="flex items-center rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                            <MapPin className="mr-1 h-4 w-4" /> {product.item_location}
                        </span>
                    </div>
                </div>

                <div>
                    {user && user.user_id === product.seller_id ? (
                        <div className="mt-4 flex gap-3">
                            <Link
                                href={`/products/${product.listing_id}/edit`}
                                className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-600"
                            >
                                <Edit className="h-5 w-5" />
                                Edit Listing
                            </Link>
                            <button
                                onClick={onDeleteClick}
                                className="rounded-lg border border-red-300 bg-red-50 p-3 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                            >
                                <Trash2 className="h-5 w-5 text-red-600 hover:cursor-pointer dark:text-red-400" />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 flex gap-2">
                            <div className="grid flex-1 gap-3 sm:grid-cols-2">
                                {/* Offer*/}
                                <button
                                    onClick={onOfferClick}
                                    disabled={!isAvail}
                                    className={`items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm ${
                                        isAvail
                                            ? 'bg-primary text-white hover:cursor-pointer hover:bg-blue-700 dark:bg-blue-600'
                                            : 'cursor-not-allowed bg-gray-400 text-gray-700 dark:bg-gray-600'
                                    }`}
                                >
                                    Make an Offer
                                </button>

                                {/* Contact */}
                                <button
                                    onClick={handleContactClick}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:cursor-pointer hover:border-blue-400 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-100"
                                >
                                    Contact Seller
                                </button>
                            </div>

                            {/* Share */}
                            <button
                                onClick={handleShareClick}
                                className="rounded-lg border border-gray-300 p-3 hover:cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    )}
                    {offerStatus === 'success' && (
                        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-200 dark:ring-green-800/40">
                            Offer noted. Await seller confirmation.
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                        Description
                    </h3>
                    <span
                        className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${product.item_condition === 'Brand New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                        {product.item_condition}
                    </span>
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {product.item_description}
                    </p>
                </div>

                {/* Safety Tips */}
                <div className="flex items-start space-x-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400">🛡️</div>
                    <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-300">
                            Safety Tips
                        </h4>
                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                            Pass agad pag holdaper.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    onClick={() => setIsContactModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>

                        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                            Contact Seller
                        </h2>

                        <div className="space-y-6">
                            {/* Contact Number */}
                            {contactNo && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Phone Number
                                            </p>
                                            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                +63{contactNo}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Facebook Link */}
                            {fbLink && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                            <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Facebook Link
                                            </p>
                                            <button
                                                onClick={handleViewFacebook}
                                                className="text-lg font-semibold text-blue-600 underline decoration-2 underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                View Facebook Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!contactNo && !fbLink && (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    No contact information available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {isShareModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    onClick={() => setIsShareModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>

                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            Share this with your community
                        </h2>

                        <div className="mb-4">
                            <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
                                Copy link
                            </p>
                            <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                                <input
                                    type="text"
                                    readOnly
                                    value={window.location.href}
                                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    {isCopied ? (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <Copy className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductInfoSection;

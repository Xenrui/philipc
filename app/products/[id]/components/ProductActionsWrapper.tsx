'use client';

import React, { useState } from 'react';
import ProductInfoSection from '@/components/products/ProductInfoSection';
import OfferModal from './OfferModal';
import DeleteModal from './DeleteModal';
import { Product, UserSession } from '@/types/products';

interface ProductActionsWrapperProps {
    product: Product;
    user: UserSession | null;
    contactNo: string | null;
    fbLink: string | null;
}

export default function ProductActionsWrapper({
    product,
    user,
    contactNo,
    fbLink,
}: ProductActionsWrapperProps): React.JSX.Element {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <ProductInfoSection
                product={product}
                user={user}
                isAvail={Boolean(product.is_avail)}
                isOfferModalOpen={isOfferModalOpen}
                onOfferClick={() => setIsOfferModalOpen(true)}
                onDeleteClick={() => setShowDeleteModal(true)}
                offerStatus="idle"
                contactNo={contactNo}
                fbLink={fbLink}
            />

            <OfferModal
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                productName={product.item_name}
                listingId={product.listing_id}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                productName={product.item_name}
                listingId={product.listing_id}
            />
        </>
    );
}

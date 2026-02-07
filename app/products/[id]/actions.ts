'use server';

import { verifySession } from '@/lib/session';
import { verifyProductOwnership, deleteProduct } from '@/lib/queries/updateProduct';
import { createOffer } from '@/lib/queries/offers';
import { addReviewIfEligible } from '@/lib/queries/reviews';
import { Review } from '@/types/products';

export async function deleteProductAction(listingId: number): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const session = await verifySession();
        if (!session?.userId) {
            return {
                success: false,
                message: 'You must be logged in to delete a listing',
            };
        }

        const ownershipCheck = await verifyProductOwnership(listingId, Number(session.userId));
        if (!ownershipCheck.success) {
            return {
                success: false,
                message: ownershipCheck.message,
            };
        }

        // Delete product
        const result = await deleteProduct(listingId);
        if (!result.success) {
            return {
                success: false,
                message: result.message,
            };
        }

        return {
            success: true,
            message: 'Product deleted successfully',
        };
    } catch (error) {
        console.error('Delete product action error:', error);
        return {
            success: false,
            message: 'An error occurred while deleting the product',
        };
    }
}

export async function submitOfferAction(
    listingId: number,
    offerPrice: number
): Promise<{ success: boolean; message: string }> {
    try {
        const session = await verifySession();
        if (!session?.userId) {
            return {
                success: false,
                message: 'You must be logged in to make an offer',
            };
        }

        if (!Number.isFinite(offerPrice) || offerPrice <= 0) {
            return {
                success: false,
                message: 'Please enter a valid offer amount',
            };
        }

        const result = await createOffer(listingId, Number(session.userId), offerPrice);
        return result;
    } catch (error) {
        console.error('Submit offer action error:', error);
        return {
            success: false,
            message: 'An error occurred while submitting the offer',
        };
    }
}

export async function submitReviewAction(
    listingId: number,
    rating: number,
    text: string
): Promise<{ success: boolean; message: string; review?: Review }> {
    try {
        const session = await verifySession();
        if (!session?.userId) {
            return {
                success: false,
                message: 'You must be logged in to submit a review',
            };
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return {
                success: false,
                message: 'Rating must be between 1 and 5',
            };
        }

        if (!text.trim()) {
            return {
                success: false,
                message: 'Please enter a review',
            };
        }

        const result = await addReviewIfEligible(listingId, Number(session.userId), rating, text);

        if (result.success) {
            // Return a placeholder review object for optimistic UI update
            return {
                success: true,
                message: result.message,
                review: {
                    review_id: Date.now(),
                    transac_id: 0,
                    review_text: text,
                    review_rating: rating,
                    buyer_first_name: 'You',
                    buyer_last_name: '',
                    buyer_profile_pic: '',
                    item_name: '',
                    item_price: 0,
                },
            };
        }

        return result;
    } catch (error) {
        console.error('Submit review action error:', error);
        return {
            success: false,
            message: 'An error occurred while submitting the review',
        };
    }
}

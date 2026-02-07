'use client';

import React, { useState, useTransition } from 'react';
import { Review, UserSession } from '@/types/products';
import { Star, Send, AlertCircle } from 'lucide-react';
import Dropdown from '@/components/Dropdown';
import { submitReviewAction } from '../actions';

interface ReviewsClientProps {
    listingId: number;
    initialReviews: Review[];
    canReview: boolean;
    user: UserSession | null;
}

export default function ReviewsClient({
    listingId,
    initialReviews,
    canReview: initialCanReview,
}: ReviewsClientProps): React.JSX.Element | null {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [canReview, setCanReview] = useState(initialCanReview);
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewText, setReviewText] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleReviewSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setReviewError('');

        if (!reviewText.trim()) {
            setReviewError('Please enter a review');
            return;
        }

        startTransition(async () => {
            try {
                const result = await submitReviewAction(
                    listingId,
                    parseInt(reviewRating),
                    reviewText
                );

                if (!result.success) {
                    setReviewError(result.message);
                    return;
                }

                // Clear form and update state
                setReviewText('');
                setReviewRating('5');
                setCanReview(false);

                // Add the new review to the list (optimistic update)
                if (result.review) {
                    setReviews((prev) => [result.review!, ...prev]);
                }
            } catch (error) {
                setReviewError('An error occurred while submitting your review');
                console.error('Review submission error:', error);
            }
        });
    };

    if (reviews.length === 0 && !canReview) {
        return null;
    }

    return (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h3>

            {canReview && (
                <form
                    onSubmit={handleReviewSubmit}
                    className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Rating
                        </label>
                        <Dropdown
                            label=""
                            options={[
                                { id: 5, label: '★★★★★ Excellent', value: '5' },
                                { id: 4, label: '★★★★ Good', value: '4' },
                                { id: 3, label: '★★★ Average', value: '3' },
                                { id: 2, label: '★★ Poor', value: '2' },
                                { id: 1, label: '★ Very Poor', value: '1' },
                            ]}
                            selected={reviewRating}
                            onChange={setReviewRating}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Review
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>

                    {reviewError && (
                        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{reviewError}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                        {isPending ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {reviews.length > 0 &&
                    reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-700"
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {review.buyer_first_name}
                                    </p>
                                    <div className="mt-1 flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3.5 w-3.5 ${
                                                    i < review.review_rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {review.review_text}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

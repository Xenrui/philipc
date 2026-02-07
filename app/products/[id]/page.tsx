import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Products from '@/components/products/Products';
import SellerOffers from '@/components/products/SellerOffers';
import ProductImageCarousel from '@/components/products/ProductImageCarousel';
import SellerInfoSection from '@/components/products/SellerInfoSection';
import {
    getProductDetailById,
    getProductRecommendations,
    getProductReviewsById,
    canUserReviewProduct,
} from '@/lib/dal/product-detail-dal';
import { getCurrentUser } from '@/lib/auth';
import { ProductActionsWrapper, ReviewsClient, BackButton } from './components';
import { UserSession } from '@/types/products';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps): Promise<React.JSX.Element> {
    const { id } = await params;

    const [productResult, currentUser] = await Promise.all([
        getProductDetailById(id),
        getCurrentUser(),
    ]);

    if (!productResult.success || !productResult.data) {
        notFound();
    }

    const { product, images, sellerStats, sellerContact } = productResult.data;

    const [recommendations, reviews, canReview] = await Promise.all([
        getProductRecommendations(id, 4),
        getProductReviewsById(product.listing_id),
        currentUser
            ? canUserReviewProduct(product.listing_id, currentUser.user_id)
            : Promise.resolve(false),
    ]);

    const user: UserSession | null = currentUser
        ? {
              user_id: currentUser.user_id,
              username: currentUser.username,
              first_name: currentUser.first_name,
              last_name: currentUser.last_name,
              profile_pic_url: currentUser.profile_pic_url,
          }
        : null;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <div className="w-full flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center space-x-2 text-sm">
                        <BackButton />
                        <span className="text-gray-400">/</span>
                        <Link
                            href="/products"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Products
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 dark:text-white">{product.item_name}</span>
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Image Carousel - Client Component for interactivity */}
                        <ProductImageCarousel
                            images={images}
                            productName={product.item_name}
                        />

                        {/* Product Info with Actions - Client Wrapper */}
                        <ProductActionsWrapper
                            product={product}
                            user={user}
                            contactNo={sellerContact.contact_no}
                            fbLink={sellerContact.fb_link}
                        />
                    </div>

                    {/* Seller Info - Server Component */}
                    {sellerStats && (
                        <div className="mb-8">
                            <SellerInfoSection
                                sellerName={product.full_name || ''}
                                sellerProfilePic={product.profile_pic_url || undefined}
                                sellerUsername={product.username || ''}
                                sellerLocation={product.item_location}
                                avgRating={sellerStats.avg_rating}
                                reviewCount={sellerStats.review_count}
                                productCount={sellerStats.product_count}
                            />
                        </div>
                    )}

                    {/* Seller Offers Section - Client Component (only for seller) */}
                    {user && user.user_id === product.seller_id && (
                        <div className="mb-8">
                            <SellerOffers
                                listingId={product.listing_id}
                                productPrice={product.item_price}
                            />
                        </div>
                    )}

                    {/* Reviews - Client Component for form interaction */}
                    <div className="mb-8">
                        <ReviewsClient
                            listingId={product.listing_id}
                            initialReviews={reviews}
                            canReview={canReview}
                            user={user}
                        />
                    </div>

                    {/* Recommendations - Server Component */}
                    {recommendations.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                You might also like
                            </h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {recommendations.map((r) => (
                                    <Products
                                        key={r.listing_id}
                                        product={r}
                                        showUser
                                        showStatus={false}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

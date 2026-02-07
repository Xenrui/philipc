import { pool } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
    Product,
    Review,
    Row,
    SellerStats,
    LandingProduct,
    ProductDetailData,
} from '@/types/products';

export interface ProductDetailResult {
    success: boolean;
    message: string;
    data: ProductDetailData | null;
}

/**
 * Get complete product details including images and seller info
 */
export async function getProductDetailById(listingId: string): Promise<ProductDetailResult> {
    try {
        // Fetch product with seller info
        const [products] = await pool.query<Row<Product>[]>(
            `SELECT 
                CONCAT(users.first_name, " ", users.last_name) AS full_name,
                users.fb_link, 
                username,
                profile_pic_url,
                products.*
            FROM products 
            JOIN users ON products.seller_id = users.user_id 
            WHERE listing_id = ?`,
            [listingId]
        );

        if (products.length === 0) {
            return {
                success: false,
                message: 'Product not found',
                data: null,
            };
        }

        const product = products[0];

        // Fetch product images
        const [imageRows] = await pool.query<Row<{ image_url: string }>[]>(
            `SELECT image_url FROM product_images WHERE listing_id = ?`,
            [listingId]
        );
        const images = imageRows.map((img) => img.image_url);

        // Fetch seller stats (rating, review count, product count)
        const [sellerStats] = await pool.query<Row<SellerStats>[]>(
            `SELECT 
                AVG(review_rating) AS avg_rating,
                COUNT(review_rating) as review_count,
                (SELECT COUNT(*) FROM products
                    WHERE seller_id = ?
                        AND is_avail = 1) as product_count
             FROM reviews r
             JOIN transactions t ON r.transac_id = t.transac_id
             JOIN products p ON t.listing_id = p.listing_id
             JOIN users u ON u.user_id = p.seller_id
             WHERE p.seller_id = ? AND is_avail = 0`,
            [product.seller_id, product.seller_id]
        );

        // Fetch seller contact info
        const [sellerContact] = await pool.query<
            Row<{ contact_no: string | null; fb_link: string | null }>[]
        >(`SELECT contact_no, fb_link FROM users WHERE user_id = ?`, [product.seller_id]);

        return {
            success: true,
            message: 'Product fetched successfully',
            data: {
                product,
                images,
                sellerStats: sellerStats[0] || { avg_rating: 0, review_count: 0, product_count: 0 },
                sellerContact: sellerContact[0] || { contact_no: null, fb_link: null },
            },
        };
    } catch (error) {
        console.error('getProductDetailById error:', error);
        return {
            success: false,
            message: 'Failed to fetch product',
            data: null,
        };
    }
}

/**
 * Get product recommendations excluding a specific product
 */
export async function getProductRecommendations(
    excludeId: string,
    limit: number = 4
): Promise<LandingProduct[]> {
    try {
        const user = await getCurrentUser();
        const userId = user?.user_id ?? null;

        const [products] = await pool.execute<LandingProduct[]>(
            `SELECT
                p.*,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.profile_pic_url,
                u.username,
                pi.image_url
            FROM products p
            JOIN users u ON p.seller_id = u.user_id
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1
            WHERE p.is_avail = 1
                AND p.listing_id <> ?
                AND (? IS NULL OR p.seller_id <> ?)
            ORDER BY RAND()
            LIMIT ?`,
            [excludeId, userId, userId, limit]
        );

        return products;
    } catch (error) {
        console.error('getProductRecommendations error:', error);
        return [];
    }
}

/**
 * Get reviews for a specific product
 */
export async function getProductReviewsById(listingId: number): Promise<Review[]> {
    try {
        const [rows] = await pool.query<Row<Review>[]>(
            `SELECT 
                r.review_id,
                r.transac_id,
                r.review_text,
                r.review_rating,
                r.created_at,
                CONCAT(u.first_name, ' ', u.last_name) AS buyer_first_name,
                '' AS buyer_last_name,
                p.item_name,
                p.item_price,
                pi.image_url AS image
            FROM reviews r
            JOIN transactions t ON r.transac_id = t.transac_id
            JOIN products p ON t.listing_id = p.listing_id
            JOIN users u ON t.buyer_id = u.user_id
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1
            WHERE p.listing_id = ?
            ORDER BY r.created_at DESC`,
            [listingId]
        );
        return rows;
    } catch (error) {
        console.error('getProductReviewsById error:', error);
        return [];
    }
}

/**
 * Check if a user can review a product (must have purchased and not yet reviewed)
 */
export async function canUserReviewProduct(listingId: number, userId: number): Promise<boolean> {
    try {
        const [rows] = await pool.query<Row<{ transac_id: number; has_review: number }>[]>(
            `SELECT t.transac_id, 
                    CASE WHEN r.transac_id IS NULL THEN 0 ELSE 1 END AS has_review
             FROM transactions t
             LEFT JOIN reviews r ON r.transac_id = t.transac_id
             WHERE t.listing_id = ? AND t.buyer_id = ? AND t.transac_done = 1
             ORDER BY t.created_at DESC
             LIMIT 1`,
            [listingId, userId]
        );

        if (rows.length === 0) {
            return false;
        }

        return rows[0].has_review === 0;
    } catch (error) {
        console.error('canUserReviewProduct error:', error);
        return false;
    }
}

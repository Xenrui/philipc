import { pool } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LandingProduct } from '@/types/products';

export async function getLandingAllProducts(): Promise<LandingProduct[]> {
    const user = await getCurrentUser();
    const userId = user?.user_id ?? null;

    const [products] = await pool.execute<LandingProduct[]>(
        `
            SELECT
                p.*,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.profile_pic_url,
                pi.image_url
            FROM products p
            JOIN users u
                ON p.seller_id = u.user_id
            LEFT JOIN product_images pi
                ON p.listing_id = pi.listing_id
            AND pi.is_cover = 1
            WHERE p.is_avail = 0
                AND (
                    ? IS NULL 
                        OR p.seller_id <> ?
                    )
        `,
        [userId, userId]
    );

    return products;
}

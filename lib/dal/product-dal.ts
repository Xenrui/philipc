import { pool } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LandingProduct, ProductFilters } from '@/types/products';

/**
 * Get all available products for the landing page, excluding current user's products
 */
export async function getLandingAllProducts(): Promise<LandingProduct[]> {
    const user = await getCurrentUser();
    const userId = user?.user_id ?? null;

    const [products] = await pool.execute<LandingProduct[]>(
        `
            SELECT
                p.*,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.profile_pic_url,
                u.username,
                pi.image_url
            FROM products p
            JOIN users u ON p.seller_id = u.user_id
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1
            WHERE p.is_avail = 1
                AND (? IS NULL OR p.seller_id <> ?)
            ORDER BY p.created_at DESC
            LIMIT 20
        `,
        [userId, userId]
    );

    return products;
}

/**
 * Get products with filters applied
 */
export async function getProducts(filters: ProductFilters): Promise<LandingProduct[]> {
    const { category, search, condition, minPrice, maxPrice, sort } = filters;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    // Only show available products
    conditions.push('p.is_avail = 1');

    // Category filter
    if (category) {
        conditions.push('p.category = ?');
        params.push(category);
    }

    // Search filter (item name and description)
    if (search && search.trim()) {
        conditions.push('(p.item_name LIKE ? OR p.item_description LIKE ?)');
        const searchTerm = `%${search.trim()}%`;
        params.push(searchTerm, searchTerm);
    }

    // Condition filter
    if (condition) {
        conditions.push('p.item_condition = ?');
        params.push(condition);
    }

    // Price range filters
    if (minPrice !== undefined && minPrice > 0) {
        conditions.push('p.item_price >= ?');
        params.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice > 0) {
        conditions.push('p.item_price <= ?');
        params.push(maxPrice);
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderClause = 'ORDER BY p.created_at DESC'; // Default: newest first

    if (sort === 'asc') {
        orderClause = 'ORDER BY p.item_price ASC';
    } else if (sort === 'desc') {
        orderClause = 'ORDER BY p.item_price DESC';
    } else if (sort === 'newest') {
        orderClause = 'ORDER BY p.created_at DESC';
    }

    // Execute query
    const query = `
        SELECT 
            p.*,
            CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            u.profile_pic_url,
            u.username,
            pi.image_url
        FROM products p
        JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1
        ${whereClause}
        ${orderClause}
        LIMIT 100
    `;

    const [products] = await pool.execute<LandingProduct[]>(query, params);

    return products;
}

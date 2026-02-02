import { Product, RatingSummary, Review, Row, User } from '@/types/types';
import { pool } from '@/lib/db';

interface GetUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        listings: Product[];
        rating: RatingSummary;
        reviews: Review[];
    } | null;
}

interface UpdateUserResponse {
    success: boolean;
    message: string;
}

export async function getUser(username: string): Promise<GetUserResponse> {
    const [users] = await pool.query<Row<User>[]>(`SELECT * FROM users WHERE username = ?`, [
        username,
    ]);

    if (users.length === 0) {
        return {
            success: false,
            message: 'User does not exist',
            data: null,
        };
    }

    const user = users[0];
    const user_id = user.user_id;

    const [listings] = await pool.query<Row<Product>[]>(
        `SELECT p.*, pi.image_url 
            FROM products p
            LEFT JOIN product_images pi
            ON p.listing_id = pi.listing_id
            AND is_cover = 1
            WHERE seller_id = ?
            ORDER BY p.is_avail DESC`,
        [user_id]
    );

    const [reviews] = await pool.query<Row<Review>[]>(
        `SELECT r.*,
                u.first_name as buyer_first_name,
                u.last_name as buyer_last_name,
                u.profile_pic_url as buyer_profile_pic,
                p.item_name,
                p.item_price
         FROM reviews r
         JOIN transactions t ON r.transac_id = t.transac_id
         JOIN products p ON t.listing_id = p.listing_id
         JOIN users u ON t.buyer_id = u.user_id
         WHERE p.seller_id = ? AND is_avail = 0`,
        [user_id]
    );

    // Fetch average rating
    const [rating] = await pool.query<Row<RatingSummary>[]>(
        `SELECT AVG(review_rating) AS avg_rating, COUNT(review_rating) as count
         FROM reviews r
         JOIN transactions t ON r.transac_id = t.transac_id
         JOIN products p ON t.listing_id = p.listing_id
         WHERE p.seller_id = ? AND is_avail = 0`,
        [user_id]
    );

    return {
        success: true,
        message: 'User Fetched Succesfully',
        data: {
            user: user,
            rating: rating[0],
            listings: listings,
            reviews: reviews,
        },
    };
}

function determineError(error: string): string | undefined {
    if (error.includes('username')) return 'Username already exists.';
    if (error.includes('email')) return 'Email already used.';
    if (error.includes('contact_no')) return 'Contact number already used.';
}

export async function updateUser(
    id: number,
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    fb_link?: string | null,
    contact_no?: string | null,
    profile_pic_url?: string | null
): Promise<UpdateUserResponse> {
    let query = '';
    const attributes = [];
    if (username) attributes.push(`username = '${username}'`);
    if (email) attributes.push(`email = '${email}'`);
    if (password) attributes.push(`password = '${password}'`);
    if (first_name) attributes.push(`first_name = '${first_name}'`);
    if (last_name) attributes.push(`last_name = '${last_name}'`);
    if (fb_link !== undefined) {
        attributes.push(`fb_link = ${fb_link ? `'${fb_link}'` : 'NULL'}`);
    }
    if (contact_no !== undefined) {
        attributes.push(`contact_no = ${contact_no ? `'${contact_no}'` : 'NULL'}`);
    }
    if (profile_pic_url !== undefined) {
        attributes.push(`profile_pic_url = ${profile_pic_url ? `'${profile_pic_url}'` : 'NULL'}`);
    }

    for (let i = 0; i < attributes.length; i++) {
        query += attributes[i];

        if (attributes.length - 1 === i) {
            break;
        } else {
            query += ', ';
        }
    }

    query = `UPDATE users SET ${query} WHERE user_id = ${id}`;

    if (attributes.length > 0) {
        try {
            await pool.execute(query);

            return {
                success: true,
                message: 'User updated successfully',
            };
        } catch (err) {
            const error = String(err);
            const error_message = determineError(error) || 'An unexpected error occurred';
            return {
                success: false,
                message: error_message,
            };
        }
    }

    return {
        success: true,
        message: 'User updated successfully',
    };
}

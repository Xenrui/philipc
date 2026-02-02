import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

type CategoryRow = RowDataPacket & {
    category: string;
};

export async function getCategories(): Promise<{ category: string }[]> {
    const [rows] = await pool.query<CategoryRow[]>(
        `
        SELECT DISTINCT category
        FROM products
        ORDER BY category ASC
        `
    );

    return rows.map((r) => ({ category: r.category }));
}

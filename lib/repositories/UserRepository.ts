import { pool } from '@/lib/db';
import { CreateUserInput, UserRow } from '@/types/user.types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * Handles User Table in the Database
 */
export class UserRepository {
    async findAll(): Promise<UserRow[] | null> {
        const [users] = await pool.execute<UserRow[]>(`SELECT * FROM users;`);

        return users || null;
    }

    async findById(id: number): Promise<UserRow | null> {
        const [user] = await pool.execute<UserRow[]>(`SELECT * FROM users WHERE user_id = ?`, [id]);

        return user[0] || null;
    }

    async findByUsername(username: string): Promise<UserRow | null> {
        const [user] = await pool.execute<UserRow[]>(`SELECT * FROM users WHERE username = ?`, [
            username,
        ]);

        return user[0] || null;
    }

    async findByEmail(email: string): Promise<UserRow | null> {
        const [user] = await pool.execute<UserRow[]>(`SELECT * FROM users WHERE email = ?`, [
            email,
        ]);

        return user[0] || null;
    }

    async create({
        first_name,
        last_name,
        email,
        contact_no,
        fb_link = null,
        username,
        password,
    }: CreateUserInput): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO users
                (first_name, last_name, email, contact_no, fb_link, username, password)
                VALUES
                (?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, contact_no, fb_link, username, password]
        );

        return result.insertId;
    }

    async update(
        userId: number,
        fields: Partial<Omit<UserRow, 'user_id' | 'pasword'>>
    ): Promise<boolean> {
        const keys = Object.keys(fields) as (keyof typeof fields)[];

        if (keys.length === 0) {
            return false;
        }

        const setString = keys.map((key) => `${key} = ?`).join(',');
        const values = keys.map((key) => fields[key]);

        const query = `UPDATE users SET ${setString} WHERE user_id = ?`;

        const [result] = await pool.execute<ResultSetHeader>(query, [...values, userId]);

        return result.affectedRows > 0;
    }

    async emailExists(email: string): Promise<boolean> {
        const [result] = await pool.execute<RowDataPacket[]>(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        return result.length > 0;
    }

    async usernameExists(username: string): Promise<boolean> {
        const [result] = await pool.execute<RowDataPacket[]>(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        return result.length > 0;
    }
}

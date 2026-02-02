import { Row, User } from '@/types/types';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface GetVerifyUserResponse {
    success: boolean;
    message: string;
    data: {
        loggedIn: boolean;
        user_id: number;
    } | null;
}

export async function verifyUser(
    username: string,
    password: string
): Promise<GetVerifyUserResponse> {
    const [users] = await pool.query<Row<User>[]>(
        `SELECT user_id, password FROM users WHERE username = ? OR email = ?`,
        [username, username]
    );

    if (users.length === 0) {
        return {
            success: false,
            message: 'User does not exist/Wrong credentials',
            data: null,
        };
    }

    const user = users[0];
    const storedPassword = user.password;

    const isHashed = /^\$2[ayb]\$/.test(storedPassword);

    let isPasswordValid = false;

    if (isHashed) {
        isPasswordValid = await bcrypt.compare(password, storedPassword);
    } else {
        isPasswordValid = password === storedPassword;
    }

    if (!isPasswordValid) {
        return {
            success: false,
            message: 'User does not exist/Wrong credentials',
            data: null,
        };
    }

    return {
        success: true,
        message: 'Logged In Successfully',
        data: {
            loggedIn: true,
            user_id: user.user_id,
        },
    };
}

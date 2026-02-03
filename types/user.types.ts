import { RowDataPacket } from 'mysql2';

export interface UserRow extends RowDataPacket {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    username: string;
    password: string;
    profile_pic_url?: string | null;
    fb_link?: string | null;
}

export type SafeUser = Omit<UserRow, 'password'>;

export type CreateUserInput = Omit<UserRow, 'user_id' | 'created_at'>;

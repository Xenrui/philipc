'use server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export type SessionPayLoad = {
    userId: number;
};

const SECRET_KEY = process.env.SESSION_SECRET;
const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: SessionPayLoad): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(ENCODED_KEY);
}

export async function verifyToken(token: string): Promise<SessionPayLoad | null> {
    try {
        const { payload } = await jwtVerify<SessionPayLoad>(token, ENCODED_KEY, {
            algorithms: ['HS256'],
        });

        if (typeof payload.userId !== 'number') {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export async function setSessionCookie(response: NextResponse, token: string): Promise<void> {
    response.cookies.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function deleteSession(): Promise<void> {
    const cookie = await cookies();
    cookie.delete('session');
}

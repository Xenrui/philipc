import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

    const cookie = await cookies();

    cookie.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
}

export async function deleteSession(): Promise<void> {
    const cookie = await cookies();

    cookie.delete('session');
}

type SessionPayLoad = {
    userId: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayLoad): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(
    session: string | undefined = ''
): Promise<{ userId: string; expiresAt: Date } | null> {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as { userId: string; expiresAt: Date };
    } catch {
        return null;
    }
}

export async function verifySession(): Promise<{ userId: string; expiresAt: Date } | null> {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;

    if (!session) {
        return null;
    }

    const payload = await decrypt(session);

    if (!payload || !payload.userId) {
        return null;
    }

    return {
        userId: payload.userId as string,
        expiresAt: payload.expiresAt as Date,
    };
}

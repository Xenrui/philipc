import { SessionPayLoad, setSessionCookie, signToken } from '@/lib/auth';
import { AuthService } from '@/lib/services/AuthService';
import { signupSchema } from '@/lib/validations/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();

    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: z.treeifyError(validationResult.error).properties,
            },
            { status: 400 }
        );
    }

    const authService = new AuthService();

    try {
        const userId = await authService.register(validationResult.data);

        const payload: SessionPayLoad = {
            userId: userId,
        };
        const token = await signToken(payload);

        const response = NextResponse.json(
            {
                message: 'User registered successfully',
                user: { id: userId },
            },
            { status: 201 }
        );

        setSessionCookie(response, token);
        return response;
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Something went wrong',
                details: message,
            },
            { status: 500 }
        );
    }
}

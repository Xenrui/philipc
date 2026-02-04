import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    response.cookies.delete('session');

    return response;
}

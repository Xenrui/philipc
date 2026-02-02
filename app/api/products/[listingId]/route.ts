import { getSpecificProduct } from '@/lib/queries/specificProduct';
import { pool } from '@/lib/db';
import { Row } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const { listingId } = await params;

        const product = await getSpecificProduct(listingId);

        if (!product.success) {
            return NextResponse.json(product);
        }

        // get seller id
        const sellerId = product.data?.product?.seller_id;

        if (!sellerId) {
            return NextResponse.json(product);
        }

        // fetch seller's contact info
        const [sellerInfo] = await pool.query<
            Row<{
                contact_no: string | null;
                fb_link: string | null;
            }>[]
        >(`SELECT contact_no, fb_link FROM users WHERE user_id = ?`, [sellerId]);

        // add seller contact info
        return NextResponse.json({
            ...product,
            data: {
                ...product.data,
                seller: sellerInfo[0] || { contact_no: null, fb_link: null },
            },
        });
    } catch (error) {
        console.error('GET /products/[id] error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to fetch specific product' }),
            { status: 500 }
        );
    }
}

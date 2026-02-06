import { RowDataPacket } from 'mysql2';

export interface Product extends RowDataPacket {
    listing_id: number;
    seller_id: number;
    category: string;
    item_name: string;
    item_condition: string;
    item_price: number;
    item_description: string;
    item_location: string;
    is_avail: boolean;
    image_url?: string | string[];
}

export interface LandingProduct extends Product {
    full_name: string;
    profile_pic_url: string;
    fb_link: string;
    username: string;
}

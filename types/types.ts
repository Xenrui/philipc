import { RowDataPacket } from 'mysql2';

export type Product = {
    full_name: string;
    profile_pic_url: string;
    fb_link: string;
    username: string;
    listing_id: number;
    seller_id: number;
    seller_avatar?: string | null;
    category: string;
    item_name: string;
    item_condition: string;
    item_price: number;
    item_description: string;
    item_location: string;
    is_avail: boolean;
    image_url?: string;
};

export type Seller = {
    avg_rating: number;
    review_count: number;
    product_count: number;
};

export interface CreateProductInput {
    seller_id: number;
    category: string;
    item_name: string;
    item_price: number;
    item_condition: string;
    item_description: string;
    item_location: string;
}

export type User = {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    username: string;
    fb_link: string;
    password: string;
    profile_pic_url?: string | null;
    image?: string;
};

export type UserSession = {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_pic_url?: string | null;
};

export type Review = {
    review_id: number;
    transac_id: number;
    review_text: string;
    review_rating: number;
    buyer_first_name: string;
    buyer_last_name: string;
    buyer_profile_pic: string;
    item_name: string;
    item_price: number;
    image?: string;
};

export type RatingSummary = {
    avg_rating: number;
    count: number;
};

export type Offer = {
    offer_id: number;
    listing_id: number;
    buyer_id: number;
    offer_price: number;
    offer_status: 'Pending' | 'Accepted' | 'Rejected';
    created_at: string;
    buyer_name?: string;
};

export type Transaction = {
    transac_id: number;
    listing_id: number;
    buyer_id: number;
    transac_done: boolean;
    created_at: string;
    item_name: string;
    item_price: number;
    offer_price: number;
    item_condition: string;
    image_url?: string;
    seller_name: string;
    seller_username: string;
    buyer_name: string;
    buyer_username: string;
    review_rating?: number;
    review_text?: string;
    review_id?: number;
};

export type OfferWithDetails = {
    offer_id: number;
    listing_id: number;
    buyer_id: number;
    seller_id: number;
    offer_price: number;
    offer_status: 'Pending' | 'Accepted' | 'Rejected';
    created_at: string;
    item_name: string;
    item_price: number;
    image_url?: string;
    seller_name: string;
    seller_username: string;
    buyer_name: string;
    buyer_username: string;
    item_condition: string;
};

export type Row<T> = T & RowDataPacket;

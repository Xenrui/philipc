import { RowDataPacket } from 'mysql2';

// Generic Row type for mysql2 queries
export type Row<T> = T & RowDataPacket;

export type ProductCategory =
    | 'CPU'
    | 'GPU'
    | 'RAM'
    | 'Memory'
    | 'Peripherals'
    | 'Monitors'
    | 'Miscellaneous';

export type ProductCondition =
    | 'Brand New'
    | 'Like New'
    | 'Slightly Used'
    | 'Well Used'
    | 'Heavily Used';

export interface Product extends RowDataPacket {
    listing_id: number;
    seller_id: number;
    category: ProductCategory;
    item_name: string;
    item_condition: ProductCondition;
    item_price: number;
    item_description: string;
    item_location: string;
    is_avail: number; // tinyint(1) in MySQL
    created_at: Date | string;
    image_url?: string;
    // Joined user fields
    full_name?: string;
    profile_pic_url?: string;
    username?: string;
    fb_link?: string;
}

export interface LandingProduct extends Product {
    full_name: string;
    profile_pic_url: string;
    username: string;
}

export type ProductFilters = {
    category?: ProductCategory;
    search?: string;
    condition?: ProductCondition;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'asc' | 'desc' | 'newest';
};

export type SortOption = 'asc' | 'desc' | 'newest';

export interface SellerStats {
    avg_rating: number;
    review_count: number;
    product_count: number;
}

export interface ProductDetailData {
    product: Product;
    images: string[];
    sellerStats: SellerStats;
    sellerContact: {
        contact_no: string | null;
        fb_link: string | null;
    };
}

export interface UserSession {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_pic_url?: string | null;
}

export interface Review {
    review_id: number;
    transac_id: number;
    review_text: string;
    review_rating: number;
    created_at?: Date | string;
    buyer_first_name: string;
    buyer_last_name: string;
    buyer_profile_pic?: string;
    item_name?: string;
    item_price?: number;
    image?: string;
}

export interface Offer {
    offer_id: number;
    listing_id: number;
    buyer_id: number;
    offer_price: number;
    offer_status: 'Pending' | 'Accepted' | 'Rejected';
    created_at?: Date | string;
    buyer_name?: string;
}

import { RowDataPacket } from 'mysql2';

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

import { LucideIcon, Settings2, ShoppingCart } from 'lucide-react';

export interface UserSetting {
    id: number;
    label: string;
    href: string;
    icon: LucideIcon;
}

export const userSettings: UserSetting[] = [
    {
        id: 1,
        label: 'Transactions',
        href: '/transactions',
        icon: ShoppingCart,
    },
    {
        id: 2,
        label: 'Settings',
        href: '/settings',
        icon: Settings2,
    },
];

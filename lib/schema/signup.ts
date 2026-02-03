import { z } from 'zod';

export const signupSchema = z
    .object({
        first_name: z.string().min(1, { message: 'First name is required' }).trim(),
        last_name: z.string().min(1, { message: 'Last name is required' }).trim(),
        email: z.email({ message: 'Invalid email address' }).trim(),
        contact_no: z
            .string()
            .regex(/^9\d{9}$/, { message: 'Contact number must be in format 9XXXXXXXXX' })
            .trim(),
        fb_link: z.string().optional().nullish(),
        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters' })
            .max(150, { message: 'Username is too long' })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: 'Username can only contain letters, numbers, and underscores',
            })
            .trim(),
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
        confirm_password: z.string().trim(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

// partial schemas for each page
export const page1Schema = signupSchema.pick({
    first_name: true,
    last_name: true,
    contact_no: true,
});

export const page2Schema = signupSchema.pick({
    fb_link: true,
});

export const page3Schema = signupSchema.pick({
    email: true,
    username: true,
    password: true,
    confirm_password: true,
});

export type SignupFormData = z.infer<typeof signupSchema>;

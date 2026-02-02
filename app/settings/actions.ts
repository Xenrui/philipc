'use server';

import { updateUser } from '@/lib/queries/user';
import { uploadProfileImage, deleteProfileImage } from '@/lib/uploadToR2';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type UpdateUserState = {
    success: boolean;
    message?: string;
    errors?:
        | {
              username?: string[];
              first_name?: string[];
              last_name?: string[];
              fb_link?: string[];
              email?: string[];
              contact_no?: string[];
              password?: string[];
          }
        | undefined;
};

// function na gumagamit ng zod na magvavalidate sa form data natin
const updateProfileSchema = z.object({
    username: z
        .string()
        .min(4, 'Username must be at least 3 characters long')
        .max(20, 'Username is too long.'),
    first_name: z.string().min(1, 'First name is required.'),
    last_name: z.string().min(1, 'Last name is required.'),
    fb_link: z.url('Must be a valid URL').or(z.literal('')).or(z.literal(null)),
    email: z.email('Invalid email address'),
    contact_no: z.string().min(10, 'Invalid number').or(z.literal('')).or(z.literal(null)),
    // Allow legacy short or unchanged passwords
    password: z.string().or(z.literal('')).or(z.literal(null)),
});

export async function update(
    prevState: UpdateUserState,
    formData: FormData
): Promise<UpdateUserState> {
    const normalize = (value: FormDataEntryValue | null): string | null => {
        if (value === null) return null;
        if (value instanceof File) return null;
        const str = String(value);
        return str === 'undefined' || str === 'null' ? null : str;
    };

    const validatedFields = updateProfileSchema.safeParse({
        username: normalize(formData.get('username')) ?? '',
        first_name: normalize(formData.get('first_name')) ?? '',
        last_name: normalize(formData.get('last_name')) ?? '',
        fb_link: normalize(formData.get('fb_link')),
        email: normalize(formData.get('email')) ?? '',
        contact_no: normalize(formData.get('contact_no')),
        password: normalize(formData.get('password')),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error with fields.  Please try again.',
        };
    }

    const id = Number(formData.get('id'));
    const username = normalize(formData.get('username')) ?? '';
    const email = normalize(formData.get('email')) ?? '';
    const password = normalize(formData.get('password')) ?? '';
    const first_name = normalize(formData.get('first_name')) ?? '';
    const last_name = normalize(formData.get('last_name')) ?? '';
    const fb_link = normalize(formData.get('fb_link'));
    const contact_no = normalize(formData.get('contact_no'));
    const profileImageFile = formData.get('profile_image') as File | null;
    const oldProfilePicUrl = formData.get('old_profile_pic_url') as string | null;

    let profilePicUrl: string | null = null;

    // If a new file is provided, delete old image first to avoid orphaned files
    if (profileImageFile && profileImageFile.size > 0) {
        if (oldProfilePicUrl) {
            await deleteProfileImage(oldProfilePicUrl);
        }

        const uploadResult = await uploadProfileImage(profileImageFile, id);

        if (!uploadResult.success) {
            return {
                success: false,
                message: uploadResult.error || 'Failed to upload profile image',
            };
        }

        profilePicUrl = uploadResult.url || null;
    }

    const result = await updateUser(
        id,
        username,
        email,
        password,
        first_name,
        last_name,
        fb_link,
        contact_no,
        profilePicUrl !== null ? profilePicUrl : undefined
    );

    if (!result.success) {
        return {
            success: false,
            message: result.message,
        };
    } else {
        redirect(`/settings`);
    }
}

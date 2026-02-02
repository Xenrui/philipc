import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from './r2';

export async function uploadProfileImage(
    file: File,
    userId: number
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Validate file
        if (!file || file.size === 0) {
            return {
                success: false,
                error: 'File is empty or invalid',
            };
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File size exceeds 5MB limit',
            };
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `profile-pics/user-${userId}-${timestamp}.${extension}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
            Metadata: {
                userId: String(userId),
                uploadedAt: new Date().toISOString(),
            },
        });

        await r2.send(command);

        // Construct public URL
        const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${filename}`;

        return {
            success: true,
            url: publicUrl,
        };
    } catch (error) {
        console.error('Error uploading to R2:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload image',
        };
    }
}

export async function deleteProfileImage(
    imageUrl: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!imageUrl) {
            return { success: false, error: 'No image URL provided' };
        }

        // Extract key from URL
        const urlParts = imageUrl.split(`.r2.cloudflarestorage.com/`);
        if (urlParts.length !== 2) {
            return { success: false, error: 'Invalid image URL format' };
        }

        const key = urlParts[1];

        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        });

        await r2.send(command);

        return { success: true };
    } catch (error) {
        console.error('Error deleting from R2:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete image',
        };
    }
}

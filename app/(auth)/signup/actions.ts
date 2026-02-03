'use server';

import { redirect } from 'next/navigation';
import { createSession } from '@/lib/session';
import { signUp } from '@/lib/queries/signUp';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/schema/signup';

export type SignupState =
    | {
          errors?: {
              first_name?: string[];
              last_name?: string[];
              email?: string[];
              contact_no?: string[];
              fb_link?: string[];
              username?: string[];
              password?: string[];
              confirm_password?: string[];
              general?: string[];
          };
      }
    | undefined;

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
    const result = signupSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { first_name, last_name, email, contact_no, username, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 12);

    const signUpResult = await signUp(
        first_name,
        last_name,
        email,
        contact_no,
        username,
        hashedPassword
    );

    if (!signUpResult.success) {
        return {
            errors: {
                general: [signUpResult.error || 'An error occurred during signup'],
            },
        };
    }

    await createSession(String(signUpResult.userId));

    redirect('/products');

    return;
}

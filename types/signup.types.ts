/**
 * Form data structure for the signup form
 */
export interface SignupFormData {
    firstName: string;
    lastName: string;
    contactNo: string;
    fbLink: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

/**
 * Type for form validation errors
 */
export type FormErrors = Partial<Record<keyof SignupFormData, string>>;

/**
 * Field mapping constants for converting between client and server field names
 */
export const SERVER_TO_CLIENT_FIELD_MAP: Record<string, keyof SignupFormData> = {
    first_name: 'firstName',
    last_name: 'lastName',
    contact_no: 'contactNo',
    fb_link: 'fbLink',
    email: 'email',
    username: 'username',
    password: 'password',
    confirm_password: 'confirmPassword',
} as const;

export const CLIENT_TO_SERVER_FIELD_MAP: Record<keyof SignupFormData, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    contactNo: 'contact_no',
    fbLink: 'fb_link',
    email: 'email',
    username: 'username',
    password: 'password',
    confirmPassword: 'confirm_password',
} as const;

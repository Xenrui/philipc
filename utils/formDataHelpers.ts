import { SignupFormData, CLIENT_TO_SERVER_FIELD_MAP } from '@/types/signup.types';

/**
 * Converts client form data to FormData object for server submission
 */
export function prepareFormDataForSubmission(formData: SignupFormData): FormData {
    const submitData = new FormData();

    Object.entries(formData).forEach(([clientKey, value]) => {
        const serverKey = CLIENT_TO_SERVER_FIELD_MAP[clientKey as keyof SignupFormData];
        submitData.append(serverKey, value);
    });

    return submitData;
}

/**
 * Converts client form data to validation format
 */
export function prepareDataForValidation(formData: SignupFormData) {
    return {
        first_name: formData.firstName,
        last_name: formData.lastName,
        contact_no: formData.contactNo,
        fb_link: formData.fbLink,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
    };
}

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

export type FormErrors = Partial<Record<keyof SignupFormData, string>>;

export interface StepProps {
    formData: SignupFormData;
    errors: FormErrors;
    onFieldChange: (field: keyof SignupFormData, value: string) => void;
}

export interface SignupApiResponse {
    message?: string;
    user?: { id: number };
    error?: string;
    details?: Record<string, { errors?: string[] }> | string;
}

export const INITIAL_FORM_DATA: SignupFormData = {
    firstName: '',
    lastName: '',
    contactNo: '',
    fbLink: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
};

export const STEP_LABELS = ['Personal Information', 'Account Details', 'Review & Confirm'] as const;

export const STORAGE_KEY = 'signup_form_data';

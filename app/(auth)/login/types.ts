export interface LoginFormData {
    username: string;
    password: string;
}

export interface FormErrors {
    username?: string;
    password?: string;
}

export interface LoginApiResponse {
    message?: string;
    user?: { id: number };
    error?: string;
    details?: Record<string, { errors?: string[] }> | string;
}

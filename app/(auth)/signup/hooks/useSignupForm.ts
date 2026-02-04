'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    SignupFormData,
    FormErrors,
    INITIAL_FORM_DATA,
    STORAGE_KEY,
    SignupApiResponse,
} from '../types';
import { page1Schema, page2Schema, page3Schema } from '@/lib/schema/signup';

const TOTAL_STEPS = 3;

/**
 * Map server field names to client field names
 */
const SERVER_TO_CLIENT_FIELD: Record<string, keyof SignupFormData> = {
    first_name: 'firstName',
    last_name: 'lastName',
    contact_no: 'contactNo',
    fb_link: 'fbLink',
    email: 'email',
    username: 'username',
    password: 'password',
    confirm_password: 'confirmPassword',
};

interface UseSignupFormReturn {
    activeStep: number;
    formData: SignupFormData;
    errors: FormErrors;
    isSubmitting: boolean;
    submitError: string | null;
    isHydrated: boolean;
    updateField: (field: keyof SignupFormData, value: string) => void;
    handleNext: () => void;
    handleBack: () => void;
    handleSubmit: () => Promise<boolean>;
    canProceed: () => boolean;
    resetForm: () => void;
}

/**
 * Custom hook for managing multi-step signup form state with localStorage persistence
 */
export function useSignupForm(): UseSignupFormReturn {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load form data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData) as Partial<SignupFormData>;
                setFormData((prev) => ({ ...prev, ...parsed }));
            } catch {
                // Invalid JSON, clear storage
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsHydrated(true);
    }, []);

    // Save form data to localStorage on every change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, isHydrated]);

    /**
     * Update a single form field and clear its error
     */
    const updateField = useCallback((field: keyof SignupFormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
        });
        setSubmitError(null);
    }, []);

    /**
     * Convert form data to server format for validation
     */
    const toServerFormat = useCallback((data: SignupFormData) => {
        return {
            first_name: data.firstName,
            last_name: data.lastName,
            contact_no: data.contactNo,
            fb_link: data.fbLink,
            email: data.email,
            username: data.username,
            password: data.password,
            confirm_password: data.confirmPassword,
        };
    }, []);

    /**
     * Validate the current step
     */
    const validateStep = useCallback(
        (step: number): boolean => {
            const serverData = toServerFormat(formData);
            const newErrors: FormErrors = {};

            let result;
            switch (step) {
                case 0:
                    result = page1Schema.safeParse(serverData);
                    break;
                case 1:
                    result = page2Schema.safeParse(serverData);
                    break;
                case 2:
                    result = page3Schema.safeParse(serverData);
                    break;
                default:
                    return true;
            }

            if (!result.success) {
                const fieldErrors = result.error.flatten().fieldErrors;
                Object.entries(fieldErrors).forEach(([serverKey, messages]) => {
                    const clientKey = SERVER_TO_CLIENT_FIELD[serverKey];
                    if (clientKey && messages && messages.length > 0) {
                        newErrors[clientKey] = messages[0];
                    }
                });
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [formData, toServerFormat]
    );

    /**
     * Check if current step has required fields filled
     */
    const canProceed = useCallback((): boolean => {
        switch (activeStep) {
            case 0:
                return (
                    formData.firstName.trim() !== '' &&
                    formData.lastName.trim() !== '' &&
                    formData.contactNo.trim() !== ''
                );
            case 1:
                return (
                    formData.email.trim() !== '' &&
                    formData.username.trim() !== '' &&
                    formData.password.trim() !== '' &&
                    formData.confirmPassword.trim() !== ''
                );
            case 2:
                return true;
            default:
                return false;
        }
    }, [activeStep, formData]);

    /**
     * Handle next button click
     */
    const handleNext = useCallback((): void => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
        }
    }, [activeStep, validateStep]);

    /**
     * Handle back button click
     */
    const handleBack = useCallback((): void => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
        setErrors({});
    }, []);

    /**
     * Clear form data from localStorage
     */
    const clearStorage = useCallback((): void => {
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async (): Promise<boolean> => {
        // Validate all steps before submitting
        for (let step = 0; step < TOTAL_STEPS; step++) {
            if (!validateStep(step)) {
                setActiveStep(step);
                return false;
            }
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toServerFormat(formData)),
            });

            const data: SignupApiResponse = await response.json();

            if (!response.ok) {
                // Handle validation errors from server
                if (data.details && typeof data.details === 'object') {
                    const newErrors: FormErrors = {};
                    Object.entries(data.details).forEach(([serverKey, value]) => {
                        const clientKey = SERVER_TO_CLIENT_FIELD[serverKey];
                        if (clientKey && value.errors && value.errors.length > 0) {
                            newErrors[clientKey] = value.errors[0];
                        }
                    });
                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                        // Go to the step with the first error
                        const errorFields = Object.keys(newErrors) as (keyof SignupFormData)[];
                        const step1Fields: (keyof SignupFormData)[] = [
                            'firstName',
                            'lastName',
                            'contactNo',
                            'fbLink',
                        ];
                        const step2Fields: (keyof SignupFormData)[] = [
                            'email',
                            'username',
                            'password',
                            'confirmPassword',
                        ];

                        if (errorFields.some((f) => step1Fields.includes(f))) {
                            setActiveStep(0);
                        } else if (errorFields.some((f) => step2Fields.includes(f))) {
                            setActiveStep(1);
                        }
                    }
                }
                setSubmitError(data.error || 'An error occurred during signup');
                return false;
            }

            // Success - clear localStorage and redirect
            clearStorage();
            window.location.href = '/products';
            return true;
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Network error. Please try again.'
            );
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, toServerFormat, validateStep, clearStorage]);

    /**
     * Reset all form data and return to first step
     */
    const resetForm = useCallback((): void => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setSubmitError(null);
        setActiveStep(0);
        clearStorage();
    }, [clearStorage]);

    return {
        activeStep,
        formData,
        errors,
        isSubmitting,
        submitError,
        isHydrated,
        updateField,
        handleNext,
        handleBack,
        handleSubmit,
        canProceed,
        resetForm,
    };
}

'use client';

import React, { useState, useTransition, useActionState } from 'react';
import Link from 'next/link';
import { signup, SignupState } from './actions';
import { page1Schema, page2Schema, page3Schema } from '@/schema/signup';
import { SignupNavigation } from '@/components/ui/SignUpNavigation';
import { FloatingLabelInput } from '@/components/ui/FloatingLabel';
import { PhoneInput } from '@/components/ui/PhoneInput';
import {
    SignupFormData,
    FormErrors,
    CLIENT_TO_SERVER_FIELD_MAP,
    SERVER_TO_CLIENT_FIELD_MAP,
} from '@/types/signup.types';
import { prepareFormDataForSubmission, prepareDataForValidation } from '@/utils/formDataHelpers';
import { SIGNUP_CONFIG } from '@/constants/signup.constants';

/**
 * Custom hook for managing signup form state and validation
 */
function useSignupForm() {
    const [page, setPage] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [clientErrors, setClientErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: '',
        lastName: '',
        contactNo: '',
        fbLink: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [state, signupAction] = useActionState<SignupState, FormData>(signup, undefined);

    /**
     * Updates a form field and clears its error
     */
    const updateField = (field: keyof SignupFormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setClientErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
        });
    };

    /**
     * Gets error for a field (client-side or server-side)
     */
    const getError = (field: keyof SignupFormData): string | undefined => {
        // Client-side errors take priority
        if (clientErrors[field]) return clientErrors[field];

        // Check for server-side errors
        if (!state?.errors) return undefined;

        const serverField = CLIENT_TO_SERVER_FIELD_MAP[field];
        const errors = state.errors as Record<string, string[] | undefined>;
        return errors[serverField]?.[0];
    };

    /**
     * Validates the current page using Zod schemas
     */
    const validateCurrentPage = (): boolean => {
        const errors: FormErrors = {};
        const dataToValidate = prepareDataForValidation(formData);

        // Select the appropriate schema based on current page
        let result;
        switch (page) {
            case 1:
                result = page1Schema.safeParse(dataToValidate);
                break;
            case 2:
                result = page2Schema.safeParse(dataToValidate);
                break;
            case 3:
                result = page3Schema.safeParse(dataToValidate);
                break;
            default:
                return true;
        }

        // Process validation errors
        if (result && !result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            Object.entries(fieldErrors).forEach(([serverKey, messages]) => {
                const clientKey = SERVER_TO_CLIENT_FIELD_MAP[serverKey];
                if (clientKey && messages && messages.length > 0) {
                    errors[clientKey] = messages[0];
                }
            });
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Navigates to the next page if validation passes
     */
    const handleNextPage = (): void => {
        if (validateCurrentPage()) {
            setPage((p) => Math.min(p + 1, SIGNUP_CONFIG.TOTAL_PAGES));
        }
    };

    /**
     * Navigates to the previous page
     */
    const handlePrevPage = (): void => {
        setPage((p) => Math.max(p - 1, 1));
    };

    /**
     * Handles form submission
     */
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!validateCurrentPage()) return;

        const submitData = prepareFormDataForSubmission(formData);

        startTransition(() => {
            signupAction(submitData);
        });
    };

    return {
        page,
        isPending,
        formData,
        state,
        updateField,
        getError,
        handleNextPage,
        handlePrevPage,
        handleSubmit,
    };
}

const SignupPage: React.FC = () => {
    const {
        page,
        isPending,
        formData,
        state,
        updateField,
        getError,
        handleNextPage,
        handlePrevPage,
        handleSubmit,
    } = useSignupForm();

    return (
        <div className="relative z-10 mt-10 flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                Create Account!
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Global Error Message */}
                {state?.errors?.general && (
                    <div
                        className="rounded-md bg-red-50 p-3"
                        role="alert"
                    >
                        <p className="text-sm text-red-800">{state.errors.general[0]}</p>
                    </div>
                )}

                {/* Page 1: Personal Information */}
                {page === 1 && (
                    <>
                        <FloatingLabelInput
                            id="first_name"
                            label="First Name"
                            value={formData.firstName}
                            onChange={(val) => updateField('firstName', val)}
                            error={getError('firstName')}
                            required
                            autoComplete="given-name"
                        />

                        <FloatingLabelInput
                            id="last_name"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(val) => updateField('lastName', val)}
                            error={getError('lastName')}
                            required
                            autoComplete="family-name"
                        />

                        <PhoneInput
                            id="contact_no"
                            value={formData.contactNo}
                            onChange={(val) => updateField('contactNo', val)}
                            error={getError('contactNo')}
                            maxLength={SIGNUP_CONFIG.PHONE_MAX_LENGTH}
                            required
                        />

                        <SignupNavigation
                            page={page}
                            totalPages={SIGNUP_CONFIG.TOTAL_PAGES}
                            onNext={handleNextPage}
                            onPrev={handlePrevPage}
                        />
                    </>
                )}

                {/* Page 2: Social Media */}
                {page === 2 && (
                    <>
                        <FloatingLabelInput
                            id="fb_link"
                            label="Facebook Link (Optional)"
                            type="url"
                            value={formData.fbLink}
                            onChange={(val) => updateField('fbLink', val)}
                            error={getError('fbLink')}
                            autoComplete="url"
                        />

                        <SignupNavigation
                            page={page}
                            totalPages={SIGNUP_CONFIG.TOTAL_PAGES}
                            onNext={handleNextPage}
                            onPrev={handlePrevPage}
                        />
                    </>
                )}

                {/* Page 3: Account Credentials */}
                {page === 3 && (
                    <>
                        <FloatingLabelInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(val) => updateField('email', val)}
                            error={getError('email')}
                            required
                            autoComplete="email"
                        />

                        <FloatingLabelInput
                            id="username"
                            label="Username"
                            value={formData.username}
                            onChange={(val) => updateField('username', val)}
                            error={getError('username')}
                            required
                            autoComplete="username"
                        />

                        <FloatingLabelInput
                            id="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(val) => updateField('password', val)}
                            error={getError('password')}
                            required
                            autoComplete="new-password"
                        />

                        <FloatingLabelInput
                            id="confirm_password"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(val) => updateField('confirmPassword', val)}
                            error={getError('confirmPassword')}
                            required
                            autoComplete="new-password"
                        />

                        <SignupNavigation
                            page={page}
                            totalPages={SIGNUP_CONFIG.TOTAL_PAGES}
                            onNext={handleNextPage}
                            onPrev={handlePrevPage}
                        />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-6 flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </>
                )}

                {/* Footer */}
                <p className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="ml-1 rounded-xl border border-gray-300 p-2 font-semibold text-blue-600 shadow-md transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;

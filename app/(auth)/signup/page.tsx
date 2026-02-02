'use client';

import React, { JSX, useActionState, useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { signup, SignupState } from './actions';
import Image from 'next/image';
import { page1Schema, page2Schema, page3Schema } from '@/schema/signup';

// Types
interface SignupFormData {
    firstName: string;
    lastName: string;
    contactNo: string;
    fbLink: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SignupFormData, string>>;

// Constants
const TOTAL_PAGES = 3;
const PHONE_MAX_LENGTH = 10;

// Navigation Component
const SignupNavigation = ({
    page,
    onNext,
    onPrev,
}: {
    page: number;
    onNext: () => void;
    onPrev: () => void;
}): JSX.Element => {
    const dots = useMemo(
        () =>
            Array.from({ length: TOTAL_PAGES }, (_, i) => (
                <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                        page === i + 1 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                />
            )),
        [page]
    );

    return (
        <div className="flex flex-col items-center pt-3">
            <div className="flex items-center justify-center gap-6 text-2xl">
                <button
                    type="button"
                    className={`${
                        page === 1
                            ? 'cursor-default opacity-30 select-none'
                            : 'cursor-pointer hover:text-blue-600'
                    }`}
                    onClick={onPrev}
                    disabled={page === 1}
                    aria-label="Previous page"
                >
                    ←
                </button>

                <div
                    className="flex items-center gap-2"
                    role="navigation"
                    aria-label="Page indicators"
                >
                    {dots}
                </div>

                <button
                    type="button"
                    className={`${
                        page === TOTAL_PAGES
                            ? 'cursor-default opacity-30 select-none'
                            : 'cursor-pointer hover:text-blue-600'
                    }`}
                    onClick={onNext}
                    disabled={page === TOTAL_PAGES}
                    aria-label="Next page"
                >
                    →
                </button>
            </div>
        </div>
    );
};

// input component
const FloatingLabelInput = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    maxLength,
    autoComplete,
}: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    maxLength?: number;
    autoComplete?: string;
}): JSX.Element => (
    <div className="relative">
        <input
            id={id}
            type={type}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            maxLength={maxLength}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
        />
        <label
            htmlFor={id}
            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text"
        >
            {label}
        </label>
        {error && (
            <p
                id={`${id}-error`}
                className="mt-1 text-xs text-red-600"
                role="alert"
            >
                {error}
            </p>
        )}
    </div>
);

const SignupPage: React.FC = () => {
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

    // field update handler
    const updateField = (field: keyof SignupFormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setClientErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
        });
    };

    // get error - merge client and server errors
    const getError = (field: keyof SignupFormData): string | undefined => {
        if (clientErrors[field]) return clientErrors[field];
        if (!state?.errors) return undefined;

        const fieldMap: Record<keyof SignupFormData, string> = {
            firstName: 'first_name',
            lastName: 'last_name',
            contactNo: 'contact_no',
            fbLink: 'fb_link',
            email: 'email',
            username: 'username',
            password: 'password',
            confirmPassword: 'confirm_password',
        };

        const serverField = fieldMap[field];
        const errors = state.errors as Record<string, string[] | undefined>;
        return errors[serverField]?.[0];
    };

    // validation using Zod
    const validateCurrentPage = (): boolean => {
        const errors: FormErrors = {};

        const dataToValidate = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            contact_no: formData.contactNo,
            fb_link: formData.fbLink,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirm_password: formData.confirmPassword,
        };

        let result;

        if (page === 1) {
            result = page1Schema.safeParse(dataToValidate);
        } else if (page === 2) {
            result = page2Schema.safeParse(dataToValidate);
        } else if (page === 3) {
            result = page3Schema.safeParse(dataToValidate);
        }

        if (result && !result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            const reverseFieldMap: Record<string, keyof SignupFormData> = {
                first_name: 'firstName',
                last_name: 'lastName',
                contact_no: 'contactNo',
                fb_link: 'fbLink',
                email: 'email',
                username: 'username',
                password: 'password',
                confirm_password: 'confirmPassword',
            };

            Object.entries(fieldErrors).forEach(([key, messages]) => {
                const camelKey = reverseFieldMap[key];
                if (camelKey && messages && messages.length > 0) {
                    errors[camelKey] = messages[0];
                }
            });
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextPage = (): void => {
        if (validateCurrentPage()) setPage((p) => Math.min(p + 1, TOTAL_PAGES));
    };

    const prevPage = (): void => setPage((p) => Math.max(p - 1, 1));

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!validateCurrentPage()) return;

        const submitData = new FormData();
        submitData.append('first_name', formData.firstName);
        submitData.append('last_name', formData.lastName);
        submitData.append('contact_no', formData.contactNo);
        submitData.append('fb_link', formData.fbLink);
        submitData.append('email', formData.email);
        submitData.append('username', formData.username);
        submitData.append('password', formData.password);
        submitData.append('confirm_password', formData.confirmPassword);

        startTransition(() => {
            signupAction(submitData);
        });
    };

    return (
        <div className="relativ z-10 mt-10 flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                Create Account!
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {state?.errors?.general && (
                    <div
                        className="rounded-md bg-red-50 p-3"
                        role="alert"
                    >
                        <p className="text-sm text-red-800">{state.errors.general[0]}</p>
                    </div>
                )}

                {page === 1 && (
                    <>
                        {/* First Name Input */}
                        <FloatingLabelInput
                            id="first_name"
                            label="First Name"
                            value={formData.firstName}
                            onChange={(val) => updateField('firstName', val)}
                            error={getError('firstName')}
                            required
                        />

                        {/* Last Name Input */}
                        <FloatingLabelInput
                            id="last_name"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(val) => updateField('lastName', val)}
                            error={getError('lastName')}
                            required
                        />

                        {/* Contact No. Input */}
                        <div className="flex items-start gap-2">
                            <div className="flex items-center gap-2 pt-5">
                                <Image
                                    src="/ph_flag.svg"
                                    alt="Philippines Flag"
                                    width={24}
                                    height={24}
                                />
                                <span className="text-sm text-gray-700">+63</span>
                            </div>

                            <div className="relative flex-1">
                                <input
                                    id="contact_no"
                                    type="tel"
                                    required
                                    value={formData.contactNo}
                                    onChange={(e) => updateField('contactNo', e.target.value)}
                                    placeholder=" "
                                    maxLength={PHONE_MAX_LENGTH}
                                    autoComplete="tel"
                                    aria-invalid={!!getError('contactNo')}
                                    aria-describedby={
                                        getError('contactNo') ? 'contact_no-error' : undefined
                                    }
                                    className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                                />
                                <label
                                    htmlFor="contact_no"
                                    className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text"
                                >
                                    Contact No.
                                </label>
                                {getError('contactNo') && (
                                    <p
                                        id="contact_no-error"
                                        className="mt-1 text-xs text-red-600"
                                        role="alert"
                                    >
                                        {getError('contactNo')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <SignupNavigation
                            page={page}
                            onNext={nextPage}
                            onPrev={prevPage}
                        />
                    </>
                )}

                {page === 2 && (
                    <>
                        {/* FB Link Input */}
                        <FloatingLabelInput
                            id="fb_link"
                            label="Facebook Link (Optional)"
                            type="url"
                            value={formData.fbLink}
                            onChange={(val) => updateField('fbLink', val)}
                            error={getError('fbLink')}
                        />

                        <SignupNavigation
                            page={page}
                            onNext={nextPage}
                            onPrev={prevPage}
                        />
                    </>
                )}

                {page === 3 && (
                    <>
                        {/* Email Input */}
                        <FloatingLabelInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(val) => updateField('email', val)}
                            error={getError('email')}
                            required
                        />

                        {/* Username Input */}
                        <FloatingLabelInput
                            id="username"
                            label="Username"
                            value={formData.username}
                            onChange={(val) => updateField('username', val)}
                            error={getError('username')}
                            required
                        />

                        {/* Password Input */}
                        <FloatingLabelInput
                            id="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(val) => updateField('password', val)}
                            error={getError('password')}
                            required
                        />

                        {/* Confirm Password Input */}
                        <FloatingLabelInput
                            id="confirm_password"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(val) => updateField('confirmPassword', val)}
                            error={getError('confirmPassword')}
                            required
                        />

                        <SignupNavigation
                            page={page}
                            onNext={nextPage}
                            onPrev={prevPage}
                        />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-6 flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </>
                )}

                <p className="text-center text-xs text-gray-600">
                    Already have an account?
                    <Link
                        href="/login"
                        className="ml-1 rounded-xl border border-gray-300 p-2 font-semibold text-blue-600 shadow-md hover:bg-gray-100"
                    >
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;

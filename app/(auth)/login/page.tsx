'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { LoginApiResponse, LoginFormData } from '@/app/(auth)/login/types';
import { FormErrors } from '@/app/(auth)/signup/types';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isRemembered, setIsRemembered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const updateField = (field: keyof LoginFormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setSubmitError(null);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username or email is required';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 3) {
            newErrors.password = 'Password must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data: LoginApiResponse = await response.json();

            if (!response.ok) {
                if (data.details && typeof data.details === 'object') {
                    const newErrors: FormErrors = {};
                    Object.entries(data.details).forEach(([key, value]) => {
                        if (key === 'username' && value.errors && value.errors.length > 0) {
                            newErrors.username = value.errors[0];
                        }
                        if (key === 'password' && value.errors && value.errors.length > 0) {
                            newErrors.password = value.errors[0];
                        }
                    });
                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                    }
                }
                setSubmitError(
                    typeof data.details === 'string' ? data.details : data.error || 'Login failed'
                );
                return;
            }

            router.push('/products');
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Network error. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{ p: { xs: 2.5, sm: 3 }, width: '100%' }}
        >
            {/* Header */}
            <Typography
                variant="h5"
                component="h1"
                textAlign="center"
                fontWeight="bold"
                sx={{ mb: 3 }}
            >
                Welcome Back
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* Error Alert */}
                {submitError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2, py: 0.5 }}
                    >
                        {submitError}
                    </Alert>
                )}

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Username or Email"
                        value={formData.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        error={!!errors.username}
                        helperText={errors.username}
                        required
                        autoComplete="username"
                        autoFocus
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        autoComplete="current-password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'Hide password' : 'Show password'
                                            }
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                            inputLabel: { shrink: true },
                        }}
                    />

                    {/* Remember Me */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRemembered}
                                onChange={(e) => setIsRemembered(e.target.checked)}
                                size="small"
                            />
                        }
                        label={
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Remember me
                            </Typography>
                        }
                        sx={{ mt: -0.5, mb: 0.5 }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={
                            isSubmitting ? <CircularProgress size={18} /> : <LogIn size={18} />
                        }
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </Box>
            </form>

            {/* Footer */}
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-primary"
                        style={{
                            fontWeight: 600,
                            textDecoration: 'underline',
                        }}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Paper>
    );
};

export default LoginPage;

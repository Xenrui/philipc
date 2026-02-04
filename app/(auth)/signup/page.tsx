'use client';

import React from 'react';
import Link from 'next/link';
import {
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Alert,
    CircularProgress,
    Skeleton,
    IconButton,
    Tooltip,
} from '@mui/material';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useSignupForm } from './hooks/useSignupForm';
import { PersonalInfoStep, AccountDetailsStep, ReviewStep } from './components';
import { STEP_LABELS } from './types';

const SignupPage: React.FC = () => {
    const {
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
    } = useSignupForm();

    const isLastStep = activeStep === STEP_LABELS.length - 1;

    const renderStepContent = (): React.ReactNode => {
        switch (activeStep) {
            case 0:
                return (
                    <PersonalInfoStep
                        formData={formData}
                        errors={errors}
                        onFieldChange={updateField}
                    />
                );
            case 1:
                return (
                    <AccountDetailsStep
                        formData={formData}
                        errors={errors}
                        onFieldChange={updateField}
                    />
                );
            case 2:
                return <ReviewStep formData={formData} />;
            default:
                return null;
        }
    };

    // Loading skeleton while hydrating from localStorage
    if (!isHydrated) {
        return (
            <Paper
                elevation={2}
                sx={{ p: { xs: 2.5, sm: 3 }, width: '100%' }}
            >
                <Skeleton
                    variant="text"
                    sx={{ fontSize: '1.5rem', mb: 1.5 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={50}
                    sx={{ mb: 3 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={180}
                />
            </Paper>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{ p: { xs: 2.5, sm: 3 }, width: '100%' }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Typography
                    variant="h5"
                    component="h1"
                    textAlign="center"
                    fontWeight="bold"
                >
                    Create Account
                </Typography>
                <Tooltip title="Reset form">
                    <IconButton
                        size="small"
                        onClick={resetForm}
                        disabled={isSubmitting}
                        sx={{ ml: 1 }}
                        aria-label="Reset form"
                    >
                        <RotateCcw size={18} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Stepper - Compact */}
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    mb: 3,
                    '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        mt: 0.5,
                    },
                    '& .MuiStepIcon-root': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    },
                }}
            >
                {STEP_LABELS.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Error Alert */}
            {submitError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, py: 0.5 }}
                >
                    {submitError}
                </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

            {/* Navigation Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1.5,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{ minWidth: 100 }}
                >
                    Back
                </Button>

                {isLastStep ? (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        startIcon={
                            isSubmitting ? <CircularProgress size={16} /> : <Check size={16} />
                        }
                        sx={{ minWidth: 140 }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleNext}
                        disabled={!canProceed()}
                        endIcon={<ArrowRight size={16} />}
                        sx={{ minWidth: 100 }}
                    >
                        Next
                    </Button>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        style={{
                            fontWeight: 600,
                            textDecoration: 'underline',
                        }}
                        className="text-primary"
                    >
                        Log In
                    </Link>
                </Typography>
            </Box>
        </Paper>
    );
};

export default SignupPage;

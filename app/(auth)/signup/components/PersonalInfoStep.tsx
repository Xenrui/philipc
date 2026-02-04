'use client';

import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { StepProps } from '../types';
import { SIGNUP_CONFIG } from '@/constants/signup.constants';

/**
 * Step 1: Personal Information
 * Collects first name, last name, contact number, and optional Facebook link
 */
export const PersonalInfoStep: React.FC<StepProps> = ({ formData, errors, onFieldChange }) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= SIGNUP_CONFIG.PHONE_MAX_LENGTH) {
            onFieldChange('contactNo', value);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
                fullWidth
                size="small"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                autoComplete="given-name"
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                autoComplete="family-name"
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Contact Number"
                value={formData.contactNo}
                onChange={handlePhoneChange}
                error={!!errors.contactNo}
                helperText={errors.contactNo || 'Format: 9XXXXXXXXX'}
                required
                autoComplete="tel-national"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {SIGNUP_CONFIG.PHONE_COUNTRY_CODE}
                            </InputAdornment>
                        ),
                    },
                    inputLabel: { shrink: true },
                }}
                inputProps={{
                    maxLength: SIGNUP_CONFIG.PHONE_MAX_LENGTH,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Facebook Link (Optional)"
                type="url"
                value={formData.fbLink}
                onChange={(e) => onFieldChange('fbLink', e.target.value)}
                error={!!errors.fbLink}
                helperText={errors.fbLink}
                autoComplete="url"
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />
        </Box>
    );
};

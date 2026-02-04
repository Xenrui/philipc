'use client';

import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { StepProps } from '../types';

/**
 * Step 2: Account Details
 * Collects email, username, password, and confirm password
 */
export const AccountDetailsStep: React.FC<StepProps> = ({ formData, errors, onFieldChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                fullWidth
                size="small"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
                autoComplete="email"
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Username"
                value={formData.username}
                onChange={(e) => onFieldChange('username', e.target.value)}
                error={!!errors.username}
                helperText={errors.username || 'Min 3 chars, letters/numbers/underscores'}
                required
                autoComplete="username"
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
                onChange={(e) => onFieldChange('password', e.target.value)}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 8 characters'}
                required
                autoComplete="new-password"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                    inputLabel: { shrink: true },
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                autoComplete="new-password"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showConfirmPassword ? 'Hide password' : 'Show password'
                                    }
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    size="small"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                    inputLabel: { shrink: true },
                }}
            />
        </Box>
    );
};

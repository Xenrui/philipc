'use client';

import React from 'react';
import { Box, Typography, Paper, Divider, Chip } from '@mui/material';
import { User, Mail, Phone, Link as LinkIcon, AtSign, Lock } from 'lucide-react';
import { SignupFormData } from '../types';
import { SIGNUP_CONFIG } from '@/constants/signup.constants';

interface ReviewStepProps {
    formData: SignupFormData;
}

interface ReviewItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isOptional?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ icon, label, value, isOptional }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            py: 1,
        }}
    >
        <Box sx={{ color: 'primary.main', mt: 0.25 }}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, lineHeight: 1.2 }}
            >
                {label}
                {isOptional && (
                    <Chip
                        label="Optional"
                        size="small"
                        variant="outlined"
                        sx={{ height: 16, fontSize: '0.6rem' }}
                    />
                )}
            </Typography>
            <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
            >
                {value || '—'}
            </Typography>
        </Box>
    </Box>
);

/**
 * Step 3: Review & Confirm
 * Displays all entered data for review before submission
 */
export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const formattedPhone = formData.contactNo
        ? `${SIGNUP_CONFIG.PHONE_COUNTRY_CODE} ${formData.contactNo}`
        : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: -0.5 }}
            >
                Please review your information before creating your account.
            </Typography>

            {/* Personal Information Section */}
            <Paper
                variant="outlined"
                sx={{ p: 1.5 }}
            >
                <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ mb: 0.5, fontSize: '0.8rem' }}
                >
                    Personal Information
                </Typography>
                <Divider sx={{ mb: 0.5 }} />

                <ReviewItem
                    icon={<User size={18} />}
                    label="Full Name"
                    value={fullName}
                />

                <ReviewItem
                    icon={<Phone size={18} />}
                    label="Contact Number"
                    value={formattedPhone}
                />

                <ReviewItem
                    icon={<LinkIcon size={18} />}
                    label="Facebook Link"
                    value={formData.fbLink}
                    isOptional
                />
            </Paper>

            {/* Account Details Section */}
            <Paper
                variant="outlined"
                sx={{ p: 1.5 }}
            >
                <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ mb: 0.5, fontSize: '0.8rem' }}
                >
                    Account Details
                </Typography>
                <Divider sx={{ mb: 0.5 }} />

                <ReviewItem
                    icon={<Mail size={18} />}
                    label="Email Address"
                    value={formData.email}
                />

                <ReviewItem
                    icon={<AtSign size={18} />}
                    label="Username"
                    value={formData.username}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        py: 1,
                    }}
                >
                    <Box sx={{ color: 'primary.main', mt: 0.25 }}>
                        <Box
                            component="span"
                            sx={{ fontSize: 18 }}
                        >
                            <Lock size={18} />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            alignItems: 'flex-start',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ lineHeight: 1.2 }}
                        >
                            Password
                        </Typography>
                        <Typography variant="body2">
                            {'•'.repeat(Math.min(formData.password.length, 12))}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

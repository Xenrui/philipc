'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/lib/theme';
import React, { JSX } from 'react';
export default function Providers({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

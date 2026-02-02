'use client';

import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDark(stored === 'dark');
            document.documentElement.classList.toggle('dark', stored === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDark(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    const toggle = (): void => {
        const newDark = !dark;
        setDark(newDark);
        document.documentElement.classList.toggle('dark', newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggle}
            className="mx-auto p-2 text-sm text-white"
        >
            {dark ? <Sun /> : <Moon />}
        </button>
    );
};

export default ThemeToggle;

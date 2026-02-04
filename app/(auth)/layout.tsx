import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="grid min-h-screen grid-cols-1 bg-gray-100 lg:grid-cols-2">
            {/* Left side - Background image (hidden on mobile) */}
            <div className="hidden items-center justify-center bg-[url('/images/form-bg.jpg')] bg-cover bg-center lg:flex">
                <div className="max-w-lg px-5 text-white">
                    <div className="mt-8 w-full overflow-hidden rounded-md shadow-xl"></div>
                </div>
            </div>

            {/* Right side - Form content */}
            <div className="flex min-h-screen flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="relative mb-4 h-10 w-48 shrink-0 sm:h-12 sm:w-56 lg:mb-6 lg:h-14 lg:w-64">
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="PhiliPC Logo"
                                fill
                                priority
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Form container */}
                    <div className="w-full max-w-md shrink-0">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

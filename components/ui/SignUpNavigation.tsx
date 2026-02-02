import React, { useMemo } from 'react';

interface SignupNavigationProps {
    page: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
}

export const SignupNavigation: React.FC<SignupNavigationProps> = ({
    page,
    totalPages,
    onNext,
    onPrev,
}) => {
    const dots = useMemo(
        () =>
            Array.from({ length: totalPages }, (_, i) => (
                <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                        page === i + 1 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-current={page === i + 1 ? 'step' : undefined}
                />
            )),
        [page, totalPages]
    );

    return (
        <div className="flex flex-col items-center pt-3">
            <div className="flex items-center justify-center gap-6 text-2xl">
                <button
                    type="button"
                    className={`transition-opacity ${
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
                    aria-label={`Page ${page} of ${totalPages}`}
                >
                    {dots}
                </div>

                <button
                    type="button"
                    className={`transition-opacity ${
                        page === totalPages
                            ? 'cursor-default opacity-30 select-none'
                            : 'cursor-pointer hover:text-blue-600'
                    }`}
                    onClick={onNext}
                    disabled={page === totalPages}
                    aria-label="Next page"
                >
                    →
                </button>
            </div>
        </div>
    );
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ViewPDFsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to admin portal
        router.replace('/admin');
    }, [router]);

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Redirecting to Admin Portal...</p>
            </div>
        </div>
    );
}

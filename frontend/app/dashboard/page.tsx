'use client';

import { useUser, SignedIn, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div className="p-8">Loading...</div>;

    const departmentName = user?.publicMetadata?.department_code as string || "Assigned Department";

    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
                <div className="min-h-[calc(100vh-80px)] bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="max-w-4xl mx-auto px-6 py-10">

                        {/* Welcome Section */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
                            <h1 className="text-2xl font-bold text-black">Welcome, {user?.firstName}</h1>
                            <p className="text-gray-600 mt-1">
                                Department: <span className="font-semibold text-blue-600">{departmentName}</span>
                            </p>
                        </div>

                        {/* Upload PDF Card */}
                        <Link href="/dashboard/upload-pdf" className="block">
                            <div className="bg-white hover:bg-blue-50 p-8 rounded-xl border-2 border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-600 text-white p-4 rounded-full">
                                        <Upload size={28} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-black">Upload Reference PDF</h2>
                                </div>
                                <p className="text-gray-600 text-lg">
                                    Upload a PDF copy of your existing timetable for reference purposes.
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>
            </SignedIn>
        </>
    );
}

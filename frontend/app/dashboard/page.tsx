'use client';

import { useUser, SignedIn, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useState } from "react";

const DEPARTMENTS = [
    { id: 'dap', name: 'Department of Applied Physics' },
    { id: 'dac', name: 'Department of Applied Chemistry' },
    { id: 'dam', name: 'Department of Applied Mathematics' },
    { id: 'dbt', name: 'Department of Biotechnology' },
    { id: 'dce', name: 'Department of Civil Engineering' },
    { id: 'cse', name: 'Department of Computer Science and Engineering' },
    { id: 'ee', name: 'Electrical Engineering Department' },
    { id: 'ece', name: 'Electronics and Communication Engineering Department' },
    { id: 'dee', name: 'Department of Environmental Engineering' },
    { id: 'doh', name: 'Department of Humanities' },
    { id: 'dit', name: 'Department of Information Technology' },
    { id: 'me', name: 'Mechanical Engineering Department' },
    { id: 'dod', name: 'Department of Design' },
    { id: 'dsm', name: 'Delhi School of Management (DSM)' },
    { id: 'pe', name: 'Physical Education' },
    { id: 'se', name: 'Software Engineering Department' },
    { id: 'usme', name: 'University School of Management & Entrepreneurship' },
    { id: 'other', name: 'Other (Specify)' },
];

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [selectedDept, setSelectedDept] = useState('');
    const [otherDept, setOtherDept] = useState('');

    if (!isLoaded) return <div className="p-8">Loading...</div>;

    const departmentName = user?.publicMetadata?.department_code as string || selectedDept;

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
                                Timetable In-Charge
                            </p>
                        </div>

                        {/* Department Selection */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                            <h2 className="text-xl font-bold text-black mb-4">Select Your Department</h2>

                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg text-black text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Select Department --</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>

                            {/* Other Department Input */}
                            {selectedDept === 'other' && (
                                <div className="mt-4">
                                    <label className="block text-black font-medium mb-2">Specify Department:</label>
                                    <input
                                        type="text"
                                        value={otherDept}
                                        onChange={(e) => setOtherDept(e.target.value)}
                                        placeholder="Enter department name..."
                                        className="w-full p-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            {selectedDept && selectedDept !== 'other' && (
                                <p className="mt-3 text-green-600 font-medium">
                                    ✓ Selected: {DEPARTMENTS.find(d => d.id === selectedDept)?.name}
                                </p>
                            )}
                            {selectedDept === 'other' && otherDept && (
                                <p className="mt-3 text-green-600 font-medium">
                                    ✓ Selected: {otherDept}
                                </p>
                            )}
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

export default function UploadPDFPage() {
    const [file, setFile] = useState<File | null>(null);
    const [note, setNote] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file.' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note', note);
            formData.append('department', 'default');

            // Upload to backend (which uploads to Cloudinary)
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            console.log('Uploading to:', `${backendUrl}/documents/upload/`);

            const response = await fetch(`${backendUrl}/documents/upload/`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            setMessage({ type: 'success', text: `PDF uploaded successfully! URL: ${result.url}` });
            setFile(null);
            setNote('');

            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (err: any) {
            console.error('Upload error:', err);
            setMessage({ type: 'error', text: err.message || 'Upload failed. Make sure the backend is running.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft size={20} />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                        <Upload className="text-blue-600" size={32} />
                        Upload Reference PDF
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Upload a PDF copy of your existing timetable for reference purposes.
                    </p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {message.type === 'success' && <CheckCircle size={20} className="mt-0.5" />}
                        <span className="break-all">{message.text}</span>
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleUpload} className="space-y-6">

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 p-8 text-center hover:bg-blue-100 transition-colors">
                        <FileText className="mx-auto text-blue-500 mb-4" size={48} />
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        />
                        <p className="mt-3 text-sm text-gray-500">Only PDF files are allowed (max 10MB)</p>
                        {file && (
                            <p className="mt-2 text-blue-700 font-medium">
                                Selected: {file.name}
                            </p>
                        )}
                    </div>

                    {/* Note Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">
                            Optional Note
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-4 h-24 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="E.g., Fall 2025 Draft 1, or any description..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Upload PDF
                            </>
                        )}
                    </button>
                </form>

                {/* Instructions */}
                <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-black mb-3">How it works:</h3>
                    <ul className="space-y-2 text-gray-700 list-disc pl-5">
                        <li>Your PDF is securely uploaded to Cloudinary cloud storage.</li>
                        <li>It will be linked to your department for reference.</li>
                        <li>This PDF is <strong>not</strong> processed automatically – it's for reference only.</li>
                        <li>The timetable generation algorithm will use this as a reference document.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

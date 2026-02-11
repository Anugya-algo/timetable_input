'use client';

import { useState, useEffect } from 'react';
import { FileText, ExternalLink, Calendar, RefreshCw, Search, Lock, LogOut, Eye, EyeOff } from 'lucide-react';

interface PDFDocument {
    id: string;
    filename: string;
    url: string;
    note: string;
    uploaded_at: string | null;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // PDF state
    const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Check if already logged in
    useEffect(() => {
        const token = sessionStorage.getItem('admin_authenticated');
        if (token === 'true') {
            setIsAuthenticated(true);
        }
        setCheckingAuth(false);
    }, []);

    // Fetch PDFs when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchPDFs();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

        if (username === adminUser && password === adminPass) {
            sessionStorage.setItem('admin_authenticated', 'true');
            setIsAuthenticated(true);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    const fetchPDFs = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const response = await fetch(`${backendUrl}/documents/list/`);
            if (!response.ok) throw new Error('Failed to fetch PDFs');
            const data = await response.json();
            setPdfs(data);
        } catch (err: any) {
            setFetchError(err.message || 'Failed to load PDFs');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            // Fallback: open in new tab
            window.open(url, '_blank');
        }
    };

    const handleCopy = (text: string) => {
        // Fallback copy method that works on HTTP localhost
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredPdfs = pdfs.filter(pdf =>
        pdf.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.note.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                <Lock size={28} />
                            </div>
                            <h1 className="text-2xl font-bold text-black">Admin Portal</h1>
                            <p className="text-gray-500 mt-2">Enter admin credentials to view uploaded PDFs</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-black font-medium mb-2 text-sm">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-medium mb-2 text-sm">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // ADMIN DASHBOARD - PDF LIST
    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Lock size={18} />
                        </div>
                        <h1 className="text-xl font-bold text-black">Admin Portal</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                            <FileText className="text-blue-600" size={28} />
                            Uploaded PDFs
                        </h2>
                        <p className="text-gray-500 mt-1">All reference PDFs uploaded </p>
                    </div>
                    <button
                        onClick={fetchPDFs}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by filename or note..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading PDFs...</p>
                    </div>
                )}

                {/* Error */}
                {fetchError && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="font-medium">Error: {fetchError}</p>
                        <p className="text-sm mt-1">Make sure the backend is running and accessible.</p>
                    </div>
                )}

                {/* PDF List */}
                {!loading && !fetchError && (
                    <>
                        <p className="text-gray-500 mb-4 text-sm">
                            {filteredPdfs.length} {filteredPdfs.length === 1 ? 'document' : 'documents'} found
                        </p>

                        {filteredPdfs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">
                                    {searchTerm ? 'No PDFs match your search.' : 'No PDFs uploaded yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPdfs.map((pdf) => (
                                    <div
                                        key={pdf.id}
                                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 min-w-0">
                                                <div className="bg-red-50 p-3 rounded-lg shrink-0">
                                                    <FileText size={24} className="text-red-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-black text-lg truncate">
                                                        {pdf.filename}
                                                    </h3>
                                                    {pdf.note && (
                                                        <p className="text-gray-600 mt-1 text-sm">{pdf.note}</p>
                                                    )}
                                                    <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
                                                        <Calendar size={12} />
                                                        <span>{formatDate(pdf.uploaded_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex gap-2">
                                                <a
                                                    href={pdf.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    <ExternalLink size={14} />
                                                    View PDF
                                                </a>
                                                <button
                                                    onClick={() => handleDownload(pdf.url, pdf.filename)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

'use client';

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <SignedOut>
        <div className="min-h-[calc(100vh-80px)] bg-white" style={{ fontFamily: 'times new roman' }}>
          {/* Welcome Bar - Distinguished from header */}
          <div className="bg-blue-100 text-blue-900 py-6 px-6 border-b border-blue-200">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl font-bold">
                Welcome, Timetable In-Charge
              </h1>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Purpose of the Site */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-4">
                Purpose of This Site
              </h2>
              <p className="text-black text-lg leading-relaxed">
                This is an <strong>internal data entry portal</strong> for authorized Timetable In-Charges.
                Your role is to input structured timetable data for your department, including:
              </p>
              <ul className="list-disc pl-8 mt-4 text-black space-y-2">
                <li>Faculty members and their availability</li>
                <li>Rooms and labs with capacities</li>
                <li>Subjects with course codes and credits</li>
                <li>Scheduled class entries (faculty + room + subject + time)</li>
              </ul>
              <p className="text-black mt-4">
                This data will be used by the <strong>automated timetable generation algorithm</strong> to create conflict-free schedules.
              </p>
            </div>

            {/* How to Upload PDF */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-4">
                How to Upload Reference PDF
              </h2>
              <p className="text-black mb-4">
                If you have an existing timetable in PDF format, you can upload it as a reference document:
              </p>
              <ol className="list-decimal pl-8 text-black space-y-2">
                <li>Go to Dashboard and click <strong>"Upload Reference PDF"</strong></li>
                <li>Click the file selector and choose your PDF (only .pdf files allowed)</li>
                <li>Optionally add a note (e.g., "Fall 2025 Draft 1")</li>
                <li>Click <strong>"Upload PDF"</strong></li>
                <li>The file is securely stored and linked to your department</li>
              </ol>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-black">
              <p className="font-bold">Important:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>You can only enter data for <strong>your assigned department</strong>.</li>
                <li>The system automatically prevents double-booking of rooms and faculty.</li>
                <li>All data is validated before saving.</li>
              </ul>
            </div>

            {/* Sign In Prompt */}
            <div className="text-center mt-10 py-6 border-t border-gray-200">
              <p className="text-black text-lg">
                Click <strong className="text-blue-600">Sign In</strong> above to get started.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
    </>
  );
}

function RedirectToDashboard() {
  useEffect(() => {
    window.location.href = '/dashboard';
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

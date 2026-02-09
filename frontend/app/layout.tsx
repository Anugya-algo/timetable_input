import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AcadSync Data Entry Admin",
  description: "Internal admin tool for timetable data collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen`}
        >
          <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg border-b-4 border-blue-800">
            <div className="w-full px-8 py-5 flex justify-between items-center">
              {/* Logo + Title on LEFT */}
              <div className="flex items-center gap-4">
                <Image
                  src="/image.png"
                  alt="AcadSync Logo"
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
                <div>
                  <span className="font-bold text-2xl tracking-tight drop-shadow-sm">AcadSync</span>
                  <span className="text-blue-100 text-sm block font-medium">Data Entry Admin</span>
                </div>
              </div>

              {/* Auth buttons on RIGHT */}
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-blue-400 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-300 transition-all border-2 border-white/40 shadow-lg">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-11 h-11 ring-2 ring-white/50 shadow-lg"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

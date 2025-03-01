import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { UserButton, SignedIn } from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Interview-IQ",
  description: "AI-powered interview preparation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClerkProvider>
          <div className="flex flex-col">
            <header className="flex justify-between items-center shadow-sm">

              <SignedIn>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Head = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-5 flex items-center justify-between max-w-6xl mx-auto relative">
      {/* Logo Section */}
      <div className="flex items-center space-x-1">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-brain"
          >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V5a2 2 0 0 0 2 2h.5A2.5 2.5 0 0 1 17 9.5a2.5 2.5 0 0 1-2.5 2.5.5.5 0 0 0-.5.5v.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5v-.5a.5.5 0 0 0-.5-.5 2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 8 7h.5a2 2 0 0 0 2-2v-.5A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M6 10a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1 2 2 0 0 0 0 4h12a2 2 0 1 0 0-4 1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1" />
          </svg>
        </div>
        <span className="text-xl font-bold text-indigo-900">Interview-IQ</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Primary Nav Links */}
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">
          Features
        </a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">
          Solutions
        </a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">
          Pricing
        </a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">
          Resources
        </a>
      </div>

      {/* Desktop - Auth Actions (UserButton or Login / Get Started) */}
      <div className="hidden md:flex items-center space-x-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/auth/sign-in" />
        </SignedIn>
        <SignedOut>
          <a
            className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            href="/auth/sign-in"
          >
            Login
          </a>
          <a
            className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg"
            href="/auth/sign-up"
          >
            Get Started
          </a>
        </SignedOut>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          className="focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-lg z-10 border-t">
          {/* Primary Nav Links */}
          <div className="flex flex-col space-y-3">
            <a className="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2" href="#">
              Features
            </a>
            <a className="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2" href="#">
              Solutions
            </a>
            <a className="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2" href="#">
              Pricing
            </a>
            <a className="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2" href="#">
              Resources
            </a>
          </div>

          {/* Auth Actions in Mobile Menu */}
          <div className="mt-4 pt-4 border-t flex flex-col space-y-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/auth/sign-in" />
            </SignedIn>
            <SignedOut>
              <a
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2"
                href="/auth/sign-in"
              >
                Login
              </a>
              <a
                className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg text-center"
                href="/auth/sign-up"
              >
                Get Started
              </a>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Head;

import React, { useState } from 'react';

const Head = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-5 flex items-center justify-center max-w-6xl mx-auto relative">
      {/* Logo Section */}

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
        </div>
      )}
    </nav>
  );
};

export default Head;

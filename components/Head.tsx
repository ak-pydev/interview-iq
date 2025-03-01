import React, { useState } from 'react';

const Head = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-5 flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center space-x-1">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V5a2 2 0 0 0 2 2h.5A2.5 2.5 0 0 1 17 9.5a2.5 2.5 0 0 1-2.5 2.5.5.5 0 0 0-.5.5v.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5v-.5a.5.5 0 0 0-.5-.5 2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 8 7h.5a2 2 0 0 0 2-2v-.5A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M6 10a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1 2 2 0 0 0 0 4h12a2 2 0 1 0 0-4 1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1" />
          </svg>
        </div>
        <span className="text-xl font-bold text-indigo-900">Interview-IQ</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">Features</a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">Solutions</a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">Pricing</a>
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">Resources</a>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <a className="text-sm font-medium text-gray-600 hover:text-indigo-600" href="#">Login</a>
        <a className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition duration-300" href="#">Get Started</a>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <a className="text-sm font-medium text-gray-600" href="#">Features</a>
            <a className="text-sm font-medium text-gray-600" href="#">Solutions</a>
            <a className="text-sm font-medium text-gray-600" href="#">Pricing</a>
            <a className="text-sm font-medium text-gray-600" href="#">Resources</a>
            <a className="text-sm font-medium text-gray-600" href="#">Login</a>
            <a className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg text-center" href="#">Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Head;

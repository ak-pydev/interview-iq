import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Abstract Wave Shape */}
      <div className="absolute bottom-0 left-0 w-full opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24">
          <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18.48 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" className="fill-white" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-white text-indigo-600 p-2 rounded-lg mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V5a2 2 0 0 0 2 2h.5A2.5 2.5 0 0 1 17 9.5a2.5 2.5 0 0 1-2.5 2.5.5.5 0 0 0-.5.5v.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5v-.5a.5.5 0 0 0-.5-.5 2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 8 7h.5a2 2 0 0 0 2-2v-.5A2.5 2.5 0 0 1 9.5 2Z"/>
                  <path d="M6 10a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1 2 2 0 0 0 0 4h12a2 2 0 1 0 0-4 1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1"/>
                </svg>
              </div>
<<<<<<< HEAD
              <span className="text-xl font-bold">PropelCareer.AI</span>
=======
              <span className="text-xl font-bold">Hire Flow AI</span>
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
            </div>
            <p className="text-indigo-200 mb-6">
              Empowering careers through AI-driven guidance, skill development, and personalized mentorship for every step of your professional journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-indigo-800 hover:bg-indigo-700 rounded-full flex items-center justify-center transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-indigo-800 hover:bg-indigo-700 rounded-full flex items-center justify-center transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-indigo-800 hover:bg-indigo-700 rounded-full flex items-center justify-center transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-indigo-800 hover:bg-indigo-700 rounded-full flex items-center justify-center transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Resume Builder</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">AI Mock Interviews</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Career Path Explorer</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Skill Analysis</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Job Recommendations</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Career Blog</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Interview Tips</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Skill Guides</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Industry Insights</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition duration-300">Career Events</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">Stay Updated</h3>
            <p className="text-indigo-200 mb-4">Get the latest career tips and AI features straight to your inbox</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-indigo-800 text-white px-3 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-r-lg font-medium transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

       

        {/* Copyright and legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-indigo-800">
          <p className="text-indigo-300 mb-4 md:mb-0">© {new Date().getFullYear()} CareerMentorAI. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="text-sm text-indigo-300 hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" className="text-sm text-indigo-300 hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" className="text-sm text-indigo-300 hover:text-white transition duration-300">Cookie Policy</a>
            <a href="#" className="text-sm text-indigo-300 hover:text-white transition duration-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
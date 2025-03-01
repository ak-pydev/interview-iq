import { SignIn, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | Career Portal</title>
        <meta name="description" content="Sign in to access your career portal" />
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* Header with logo and user button */}
        <header className="w-full flex justify-between items-center shadow-sm">
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </header>

        {/* Main content with side-by-side layout */}
        <div className="flex-grow flex items-center justify-center">
          <div className="flex max-w-4xl w-full overflow-hidden shadow-2xl rounded-lg">
            {/* Left side - Image */}
            <div className="hidden md:block w-1/2 relative">
              <img 
                src="https://americansteminstitute.us/images/ezgif-2-14e9d333e2.gif" 
                alt="Career Portal" 
                className="bg-contain bg-cover"
              />
            </div>
            
            {/* Right side - Sign in form with rounded corners on the right side only */}
            <div className="w-full md:w-1/2 bg-white p-8 rounded-tr-xl rounded-br-xl shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h1>
              <div className="mt-6 text-sm text-gray-500 mb-6">
                <p>Access your career resources and opportunities</p>
              </div>
              <SignedOut>
                <div className="rounded-lg overflow-hidden">
                  <SignIn 
                    path="/auth/sign-in" 
                    routing="path" 
                    signUpUrl="/sign-up"
                  />
                </div>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-4 bg-white">
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Interview-IQ Career Portal. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
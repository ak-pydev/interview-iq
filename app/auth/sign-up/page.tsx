import { SignUp, SignedOut } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up | Career Portal</title>
        <meta name="description" content="Sign up to access your career portal" />
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* Main content with side-by-side layout */}
        <div className="flex-grow flex items-center justify-center">
          <div className="flex max-w-4xl w-full overflow-hidden shadow-2xl rounded-lg">
            {/* Left side - Image */}
            <div className="hidden md:block w-1/2 relative">
              <img 
                src="https://americansteminstitute.us/images/ezgif-2-14e9d333e2.gif"
                alt="Career Portal"
                className="bg-contain bg-cover h-full w-full object-cover"
              />
            </div>

            {/* Right side - Sign up form */}
            <div className="w-full md:w-1/2 bg-white p-8 rounded-tr-xl rounded-br-xl shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h1>
              <div className="mt-6 text-sm text-gray-500 mb-6">
                <p>Join the community to access your career resources and opportunities.</p>
              </div>
              <SignedOut>
                <div className="rounded-lg overflow-hidden">
                  <SignUp 
                    path="/auth/sign-up"
                    routing="path"
                    signInUrl="/auth/sign-in"
                    afterSignUpUrl="/"
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

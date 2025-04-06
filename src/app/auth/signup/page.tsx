'use client';

import { useEffect } from 'react';
import { signInWithRedirect } from '@aws-amplify/auth';

export default function SignUp() {
  useEffect(() => {
    console.log('🔑 SIGNUP PAGE MOUNTED 🔑');
    const initiateSignUp = async () => {
      try {
        console.log('🔄 Starting sign-up redirect...');
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('signup', 'true');
        window.history.replaceState({}, '', currentUrl.toString());
        
        await signInWithRedirect();
        console.log('✅ Sign-up redirect successful');
      } catch (error) {
        console.error('❌ Error during sign-up redirect:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
      }
    };

    initiateSignUp();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Redirecting to sign up...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            If you are not redirected automatically, click the button below.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set('signup', 'true');
              window.history.replaceState({}, '', currentUrl.toString());
              signInWithRedirect();
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up with AWS Cognito
          </button>
        </div>
      </div>
    </div>
  );
} 
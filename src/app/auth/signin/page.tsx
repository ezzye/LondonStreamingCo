'use client';

import { signInWithRedirect } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with AWS Cognito
          </button>
        </div>
      </div>
    </div>
  );
} 
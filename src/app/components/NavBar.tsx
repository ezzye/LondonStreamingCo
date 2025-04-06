'use client';

import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

// Add interface for User type
interface User {
  email?: string;
  // Add other user properties as needed
}

export default function NavBar() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          LyricAI
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/auth/signin"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 
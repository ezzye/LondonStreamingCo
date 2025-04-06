'use client';

import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SongGenerator from './components/SongGenerator';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          LyricAI Song Generator
        </h1>
        <SongGenerator />
      </div>
    </main>
  );
}

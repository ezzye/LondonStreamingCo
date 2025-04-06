'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SongGenerator from './components/SongGenerator';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  console.log('🏠 Home Component Rendering');

  useEffect(() => {
    console.log('🏠 HOME PAGE MOUNTED 🏠');
    try {
      console.log('📍 Current Path:', window.location.pathname);
      console.log('👤 Auth State:', { user, loading });
      
      if (!loading && !user) {
        console.log('🔄 Redirecting to signin...');
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('❌ Error in Home component:', error);
    }
  }, [user, loading, router]);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '4px',
          background: 'red',
          color: 'white',
          zIndex: 9999,
          textAlign: 'center',
          fontSize: '12px'
        }}
      >
        Debug Bar - JS {typeof window !== 'undefined' ? 'Loaded' : 'Loading'} - Auth {loading ? 'Loading' : (user ? 'User Found' : 'No User')}
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          Debug: {loading ? 'Loading...' : (user ? 'User Found' : 'No User')}
        </div>
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        ) : user ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              LyricAI
            </h1>
            <p className="text-gray-300 text-center mb-8">
              Transform your ideas into song lyrics inspired by your favorite songs
            </p>
            <SongGenerator />
          </div>
        ) : null}
      </div>
    </>
  );
}

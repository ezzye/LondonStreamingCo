'use client';

// Add this at the very top, before any imports
console.log('STARTUP: Loading providers.tsx');

import { Amplify } from 'aws-amplify';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import NavBar from './components/NavBar';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { ResourcesConfig } from 'aws-amplify';

// Configure Amplify immediately
console.log('🔵 AMPLIFY CONFIG 🔵');
const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT!],
          responseType: 'code'
        }
      }
    }
  }
};

console.log('📝 Amplify Config:', JSON.stringify(config, null, 2));

try {
  console.log('⚙️ Configuring Amplify...');
  Amplify.configure(config);
  console.log('✅ Amplify configured successfully');
} catch (error) {
  console.error('❌ Error configuring Amplify:', error);
}

// Create a wrapper for localStorage that returns Promises
const keyValueStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(key, value);
      resolve();
    });
  },
  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(key));
    });
  },
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  },
  clear: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.clear();
      resolve();
    });
  }
};

cognitoUserPoolsTokenProvider.setKeyValueStorage(keyValueStorage);

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('=== Providers Rendering ===');
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
} 
'use client';

import { Amplify } from 'aws-amplify';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import NavBar from './components/NavBar';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';

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
  // Add the required clear method
  clear: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.clear();
      resolve();
    });
  }
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      signUpVerificationMethod: 'code',
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
});

// Use our Promise-based wrapper instead of localStorage directly
cognitoUserPoolsTokenProvider.setKeyValueStorage(keyValueStorage);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <>
          <NavBar />
          {children}
        </>
      </AuthProvider>
    </ErrorBoundary>
  );
} 
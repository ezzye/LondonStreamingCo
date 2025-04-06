"use client";

import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser, signOut as amplifySignOut, fetchAuthSession } from '@aws-amplify/auth';

interface AuthUser {
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== AuthProvider Mounting ===');
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user authentication...');
      const currentUser = await getCurrentUser();
      console.log('Current user data:', currentUser);
      
      setUser({
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId
      });
      console.log('User set successfully');
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      console.log('Auth check complete, setting loading to false');
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  console.log('AuthProvider rendering, user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

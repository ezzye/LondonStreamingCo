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
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser({
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

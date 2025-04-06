"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

interface DeepgramContextType {
  deepgramClient: any | null; // We'll properly type this later
  isInitialized: boolean;
}

const DeepgramContext = createContext<DeepgramContextType>({
  deepgramClient: null,
  isInitialized: false
});

export function DeepgramProvider({ children }: { children: React.ReactNode }) {
  const [deepgramClient, setDeepgramClient] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDeepgram = async () => {
      try {
        if (typeof window !== 'undefined') {
          const response = await fetch('/api/deepgram/transcribe-audio');
          const { apiKey } = await response.json();
          
          if (!apiKey) {
            throw new Error('Deepgram API key not found');
          }

          const client = createClient(apiKey);
          setDeepgramClient(client);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Deepgram:', error);
      }
    };

    initializeDeepgram();
  }, []);

  return (
    <DeepgramContext.Provider value={{ deepgramClient, isInitialized }}>
      {children}
    </DeepgramContext.Provider>
  );
}

export function useDeepgram() {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error('useDeepgram must be used within a DeepgramProvider');
  }
  return context;
}

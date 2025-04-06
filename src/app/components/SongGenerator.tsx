'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';
import { SongGeneratorErrorBoundary } from './SongGeneratorErrorBoundary';

// Maximum number of retries for transient errors
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface APIError {
  status?: number;
  message?: string;
}

interface AuthError {
  name?: string;
  message?: string;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if error is retryable
const isRetryableError = (error: APIError) => {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.status || 0);
};

function SongGeneratorContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const { user, signOut } = useContext(AuthContext);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const formatLyrics = (content: string) => {
    // Remove the JSON formatting artifacts
    const cleanContent = content.replace(/\\n/g, '\n')  // Replace \n with actual line breaks
      .replace(/[{"}]/g, '')  // Remove JSON artifacts
      .replace(/role:assistant,content:/g, '')  // Remove role and content markers
      .replace(/,refusal:null,annotations:\[\]/g, '')  // Remove trailing markers
      .trim();

    return cleanContent;
  };

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    if (error.name === 'TokenExpiredError' || error.name === 'NotAuthorizedException') {
      router.push('/auth/signin');
    }
  };

  const handleAPIError = async (error: APIError) => {
    console.error('API error:', error);
    if (error.status === 401 || error.status === 403) {
      router.push('/auth/signin');
      return false;
    }
    return error.status === 429 || error.status === 500;
  };

  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) {
          router.push('/auth/signin');
          throw new Error('No authentication token available');
        }
        setAuthToken(token);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth/signin');
      }
    };

    getAuthToken();
  }, [router]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'https://p5aokttmre.execute-api.us-east-1.amazonaws.com/prod/generate',
    headers: authToken ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    } : undefined,
    onError: async (error) => {
      const shouldRetry = await handleAPIError(error as APIError);
      if (shouldRetry) {
        handleSubmit(new Event('submit') as any);
      }
    }
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user) {
        throw new Error('NotAuthorizedException');
      }
      
      setError(null);
      setIsGenerating(true);
      setRetryCount(0); // Reset retry count for new submissions
      await handleSubmit(e);
    } catch (error) {
      if ((error as AuthError).name) {
        handleAuthError(error as AuthError);
      } else {
        const shouldRetry = await handleAPIError(error as APIError);
        if (shouldRetry) {
          // Retry the request
          handleSubmit(e);
        }
      }
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setIsGenerating(false);
        setError('Maximum retry attempts reached. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>Example: &quot;Write a love song similar to &apos;Perfect&apos; by Ed Sheeran, but about finding love in a coffee shop&quot;</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-600 text-white ml-auto max-w-[80%]'
                : 'bg-gray-800 text-gray-100 mr-auto max-w-[80%] whitespace-pre-wrap'
            }`}
          >
            {message.role === 'assistant' ? formatLyrics(message.content) : message.content}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex-none">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Describe the song you want to create..."
            className="flex-1 rounded-lg bg-gray-800 text-white p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Lyrics'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SongGenerator() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <SongGeneratorErrorBoundary>
      <SongGeneratorContent />
    </SongGeneratorErrorBoundary>
  );
} 
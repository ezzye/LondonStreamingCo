'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SongGeneratorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SongGenerator Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-[calc(100vh-200px)] items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-center">
            <h2 className="text-red-500 text-2xl font-bold mb-4">
              Oops! Something went wrong with the lyrics generator
            </h2>
            <p className="text-gray-300 mb-6">
              {this.state.error?.message || 'An unexpected error occurred while generating lyrics'}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <p className="text-gray-400 text-sm">
                If the problem persists, please try signing out and back in.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 
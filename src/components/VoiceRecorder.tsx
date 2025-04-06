'use client';

import { useState } from 'react';
import { useDeepgram } from '../lib/contexts/DeepgramContext';
import { motion } from 'framer-motion';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { deepgramClient, isInitialized } = useDeepgram();

  const handleStartRecording = async () => {
    if (!isInitialized || !deepgramClient) {
      console.error('Deepgram client not initialized');
      return;
    }

    setIsRecording(true);
    setTranscript('');
    
    try {
      deepgramClient.listen({
        onResults: (results: any) => {
          if (results.results?.channels[0]?.alternatives[0]?.transcript) {
            setTranscript(results.results.channels[0].alternatives[0].transcript);
          }
        },
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (!isInitialized || !deepgramClient) {
      return;
    }

    setIsRecording(false);
    
    try {
      deepgramClient.finish();
      
      if (transcript) {
        console.log('Final transcript:', transcript);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-400">Initializing voice recorder...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`rounded-full p-4 ${
          isRecording ? 'bg-red-600' : 'bg-blue-600'
        } text-white transition-colors`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </motion.button>
      
      {transcript && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg max-w-lg w-full">
          <p className="text-gray-200">{transcript}</p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useEffect } from 'react';

interface VoiceToTextButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceToTextButton({ onTranscript }: VoiceToTextButtonProps) {
  const { isListening, transcript, isSupported, startListening, stopListening, setTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      setTranscript('');
    }
  }, [transcript, onTranscript, setTranscript]);

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input not supported in this browser"
        className="p-2 rounded-full bg-gray-100 text-gray-300 cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      className={`p-2 rounded-full transition-colors ${
        isListening
          ? 'bg-pink text-white voice-pulse'
          : 'bg-turquoise/10 text-turquoise-dark hover:bg-turquoise/20'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}

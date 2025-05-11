import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void;
  isProcessing: boolean;
}

// Type definition for the SpeechRecognition object
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

// Type definition for the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Get the appropriate SpeechRecognition API
const SpeechRecognitionAPI = window.SpeechRecognition || 
                            window.webkitSpeechRecognition;

const VoiceControls: React.FC<VoiceControlsProps> = ({ onVoiceInput, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition;
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onVoiceInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <Button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`rounded-full h-14 w-14 shadow-lg ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-primary-500 hover:bg-primary-600'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <Mic className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VoiceControls;

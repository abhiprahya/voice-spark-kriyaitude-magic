
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void;
  isProcessing: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onVoiceInput, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      
      newRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setIsListening(false);
        onVoiceInput(transcript);
      };
      
      newRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: 'Voice recognition error',
          description: 'Please try again or type your prompt.',
          variant: 'destructive'
        });
      };
      
      newRecognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(newRecognition);
    }
    
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.abort();
      }
    };
  }, [onVoiceInput, toast]);

  const toggleListening = useCallback(() => {
    if (isProcessing) return;
    
    if (isListening) {
      recognition?.abort();
      setIsListening(false);
    } else {
      if (!recognition) {
        toast({
          title: 'Voice recognition not supported',
          description: 'Your browser does not support speech recognition.',
          variant: 'destructive'
        });
        return;
      }
      
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition', error);
        toast({
          title: 'Failed to start listening',
          description: 'Please try again.',
          variant: 'destructive'
        });
      }
    }
  }, [isListening, recognition, isProcessing, toast]);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className={`${isListening ? 'before:animate-pulse-ring before:absolute before:inset-0 before:rounded-full before:bg-primary-500/50 before:scale-150' : ''} relative`}>
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`h-16 w-16 rounded-full shadow-lg ${
            isListening 
              ? 'bg-primary-600 hover:bg-primary-700 animate-bounce-subtle'
              : 'bg-primary-500 hover:bg-primary-600'
          } transition-all`}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoiceControls;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
  onVoiceButtonClick: () => void;
  isListening: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isProcessing, 
  onVoiceButtonClick,
  isListening 
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center">
      <Input
        placeholder="Type your content idea or say 'Hey Kriyaitude'..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="pr-24 rounded-full border-gray-300 shadow-sm"
        disabled={isProcessing}
      />
      <div className="absolute right-1 flex gap-1">
        <Button 
          type="button" 
          onClick={onVoiceButtonClick}
          variant={isListening ? "destructive" : "ghost"}
          size="sm" 
          className={`h-8 w-8 p-0 rounded-full ${isListening ? 'animate-pulse' : ''}`}
          disabled={isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Voice input'}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          className="rounded-full h-8 px-3"
          disabled={!inputText.trim() || isProcessing}
        >
          {isProcessing ? 'Generating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default PromptInput;

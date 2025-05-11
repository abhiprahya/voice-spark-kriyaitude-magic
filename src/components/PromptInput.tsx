
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
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
        className="pr-16 rounded-full border-gray-300 shadow-sm"
        disabled={isProcessing}
      />
      <Button 
        type="submit" 
        className="absolute right-1 rounded-full h-8 px-3"
        disabled={!inputText.trim() || isProcessing}
      >
        {isProcessing ? 'Generating...' : 'Create'}
      </Button>
    </form>
  );
};

export default PromptInput;

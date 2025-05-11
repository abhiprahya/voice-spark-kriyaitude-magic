
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContentTypeSelectorProps {
  selectedType: 'caption' | 'meme' | 'script';
  onTypeChange: (type: 'caption' | 'meme' | 'script') => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        className={`rounded-full border ${
          selectedType === 'caption' 
            ? 'bg-primary-500 text-white border-primary-600' 
            : 'bg-white text-gray-700'
        }`}
        onClick={() => onTypeChange('caption')}
      >
        Captions
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`rounded-full border ${
          selectedType === 'meme' 
            ? 'bg-primary-500 text-white border-primary-600' 
            : 'bg-white text-gray-700'
        }`}
        onClick={() => onTypeChange('meme')}
      >
        Memes
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`rounded-full border ${
          selectedType === 'script' 
            ? 'bg-primary-500 text-white border-primary-600' 
            : 'bg-white text-gray-700'
        }`}
        onClick={() => onTypeChange('script')}
      >
        Scripts
      </Button>
    </div>
  );
};

export default ContentTypeSelector;

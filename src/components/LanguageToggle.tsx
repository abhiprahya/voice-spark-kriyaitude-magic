
import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageToggleProps {
  currentLanguage: 'english' | 'kannada';
  onLanguageChange: (language: 'english' | 'kannada') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="bg-white rounded-full p-1 border border-gray-200 shadow-sm flex">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full px-3 text-sm ${
          currentLanguage === 'english' 
            ? 'bg-primary-100 text-primary-800 hover:bg-primary-200 hover:text-primary-900' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        onClick={() => onLanguageChange('english')}
      >
        English
      </Button>
      <Button
        variant="ghost" 
        size="sm"
        className={`rounded-full px-3 text-sm ${
          currentLanguage === 'kannada' 
            ? 'bg-primary-100 text-primary-800 hover:bg-primary-200 hover:text-primary-900' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        onClick={() => onLanguageChange('kannada')}
      >
        ಕನ್ನಡ
      </Button>
    </div>
  );
};

export default LanguageToggle;

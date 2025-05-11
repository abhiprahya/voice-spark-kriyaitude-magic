
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume, Share, Download } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ContentCardProps {
  content: {
    id: string;
    type: 'caption' | 'meme' | 'script';
    text: string;
    language: string;
    imageUrl?: string;
    createdAt: Date;
  };
  onPlayback: () => void;
  isPlaying: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onPlayback, isPlaying }) => {
  const { type, text, language, imageUrl } = content;
  
  const typeLabels = {
    caption: 'Caption',
    meme: 'Meme Text',
    script: 'Script',
  };
  
  const typeColors = {
    caption: 'bg-blue-100 text-blue-800',
    meme: 'bg-purple-100 text-purple-800',
    script: 'bg-amber-100 text-amber-800',
  };
  
  const languageColors = {
    English: 'bg-green-100 text-green-800',
    Kannada: 'bg-pink-100 text-pink-800',
  };

  // Select a random height for Pinterest-like layout
  const randomHeight = React.useMemo(() => {
    const heights = ['h-auto', 'h-auto md:h-64', 'h-auto md:h-80'];
    return heights[Math.floor(Math.random() * heights.length)];
  }, []);

  return (
    <Card className={`w-full bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${randomHeight}`}>
      {type === 'meme' && imageUrl && (
        <div className="relative w-full h-40 md:h-48">
          <img 
            src={imageUrl} 
            alt="Meme template" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300/9b87f5/ffffff?text=Meme+Template';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl font-bold text-center px-4 text-shadow-lg">
              {text}
            </p>
          </div>
        </div>
      )}
      
      <CardContent className={`p-4 ${type === 'meme' && imageUrl ? 'pt-2' : 'pt-4'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`${typeColors[type]} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {typeLabels[type]}
          </span>
          <span className={`${languageColors[language] || 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {language}
          </span>
        </div>
        
        {(type !== 'meme' || !imageUrl) && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800 font-medium text-base md:text-lg">{text}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-gray-600 ${isPlaying ? 'bg-primary-100' : ''}`}
          onClick={onPlayback}
        >
          <Volume className="h-4 w-4 mr-1" />
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;

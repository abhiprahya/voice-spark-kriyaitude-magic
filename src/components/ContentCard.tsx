
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume, Share, Download } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ContentCardProps {
  content: {
    type: 'caption' | 'meme' | 'script';
    text: string;
    language: string;
    imageUrl?: string;
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

  return (
    <Card className="w-full bg-white shadow-md rounded-xl overflow-hidden">
      {type === 'meme' && imageUrl && (
        <div className="relative w-full h-48">
          <img 
            src={imageUrl} 
            alt="Meme template" 
            className="w-full h-full object-cover"
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
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {typeLabels[type]}
          </span>
          <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {language}
          </span>
        </div>
        
        {(type !== 'meme' || !imageUrl) && (
          <p className="text-gray-800 font-medium text-lg">{text}</p>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600"
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

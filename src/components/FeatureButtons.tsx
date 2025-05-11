
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Video, Gift, Text, Languages, AudioLines } from 'lucide-react';

interface FeatureButtonsProps {
  onFeatureSelect: (feature: string) => void;
  selectedFeature: string;
}

const FeatureButtons: React.FC<FeatureButtonsProps> = ({ 
  onFeatureSelect,
  selectedFeature
}) => {
  const features = [
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'video', icon: Video, label: 'Video' },
    { id: 'gif', icon: Gift, label: 'GIF' },
    { id: 'text', icon: Text, label: 'Text' },
    { id: 'translate', icon: Languages, label: 'Translate' },
    { id: 'audio', icon: AudioLines, label: 'Audio' }
  ];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeature === feature.id;
          
          return (
            <Button
              key={feature.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className={`flex-col py-2 h-auto ${
                isSelected ? 'bg-primary-500' : 'bg-white'
              }`}
              onClick={() => onFeatureSelect(feature.id)}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{feature.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureButtons;

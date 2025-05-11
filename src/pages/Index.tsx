
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import LanguageToggle from '@/components/LanguageToggle';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import PromptInput from '@/components/PromptInput';
import FeatureButtons from '@/components/FeatureButtons';
import { useToast } from '@/hooks/use-toast';
import { generateContent, textToSpeech, processVoiceCommand } from '@/services/ai';
import VoiceControls from '@/components/VoiceControls';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'english' | 'kannada'>('english');
  const [contentType, setContentType] = useState<'caption' | 'meme' | 'script'>('caption');
  const [selectedFeature, setSelectedFeature] = useState<string>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [contentCards, setContentCards] = useState<Array<{
    id: string;
    type: 'caption' | 'meme' | 'script';
    text: string;
    language: string;
    imageUrl?: string;
    createdAt: Date;
  }>>([]);

  // Handle feature selection
  const handleFeatureSelect = useCallback((feature: string) => {
    setSelectedFeature(feature);
    
    // Map features to content types where applicable
    if (feature === 'text') {
      setContentType('caption');
    } else if (feature === 'image' || feature === 'gif') {
      setContentType('meme');
    } else if (feature === 'video' || feature === 'audio') {
      setContentType('script');
    }
    
    toast({
      title: `${feature.charAt(0).toUpperCase() + feature.slice(1)} mode activated`,
      description: "Now generating content for this format",
    });
  }, [toast]);

  // Voice controls setup
  const { toggleListening } = VoiceControls({
    onVoiceInput: handleVoiceInput,
    isProcessing,
    isListening,
    setIsListening
  });

  // Handle voice input
  function handleVoiceInput(text: string) {
    // Check if command starts with trigger phrase
    const lowercaseText = text.toLowerCase();
    const isTriggerCommand = lowercaseText.includes('hey kriyaitude') || 
                             lowercaseText.includes('kriyaitude');
    
    if (isTriggerCommand) {
      toast({
        title: 'Voice command recognized!',
        description: `"${text}"`,
      });
      
      // Process the voice command to determine content type and extract prompt
      const { type, prompt } = processVoiceCommand(text);
      
      if (type) {
        setContentType(type);
      }
      
      handleContentGeneration(prompt, type || contentType);
    } else {
      // If not a trigger command, just use as a regular prompt
      handleContentGeneration(text, contentType);
    }
  }
  
  // Handle text input submission
  const handleInputSubmit = useCallback((text: string) => {
    handleContentGeneration(text, contentType);
  }, [contentType]);
  
  // Generate content based on prompt and type
  const handleContentGeneration = useCallback(async (prompt: string, type: 'caption' | 'meme' | 'script') => {
    setIsProcessing(true);
    
    try {
      const content = await generateContent(type, prompt, language);
      
      const newCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: content.type,
        text: content.text,
        language: content.language,
        imageUrl: content.imageUrl,
        createdAt: new Date()
      };
      
      setContentCards(prev => [newCard, ...prev]);
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} generated!`,
        description: language === 'english' ? 'Tap to play audio' : 'ಆಡಿಯೋ ಪ್ಲೇ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Generation failed',
        description: 'Please try again with a different prompt.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [language, toast]);
  
  // Handle TTS playback
  const handlePlayback = useCallback(async (cardId: string, text: string, cardLanguage: string) => {
    if (playingCardId === cardId) {
      setPlayingCardId(null);
      return;
    }
    
    try {
      setPlayingCardId(cardId);
      await textToSpeech(
        text, 
        cardLanguage === 'English' ? 'english' : 'kannada'
      );
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: 'Playback failed',
        description: 'Your browser may not support this voice language.',
        variant: 'destructive',
      });
    } finally {
      setPlayingCardId(null);
    }
  }, [playingCardId, toast]);
  
  // Generate welcome message on first load
  useEffect(() => {
    const generateWelcomeContent = async () => {
      setIsProcessing(true);
      try {
        const welcomeContent = await generateContent('caption', 'welcome', language);
        setContentCards([{
          id: 'welcome-card',
          type: welcomeContent.type,
          text: welcomeContent.text,
          language: welcomeContent.language,
          imageUrl: welcomeContent.imageUrl,
          createdAt: new Date()
        }]);
      } catch (error) {
        console.error('Error generating welcome content:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    if (contentCards.length === 0) {
      generateWelcomeContent();
    }
  }, [language]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-24 px-4 max-w-4xl mx-auto">
        <div className="w-full flex justify-center my-4">
          <img 
            src="/kriyaitude-template.png" 
            alt="Kriyaitude AI" 
            className="h-14 object-contain shadow-sm rounded-md"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x100/9b87f5/ffffff?text=Kriyaitude+AI';
            }}
          />
        </div>
        
        <div className="my-4 flex justify-center">
          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </div>
        
        <div className="my-4">
          <FeatureButtons
            selectedFeature={selectedFeature}
            onFeatureSelect={handleFeatureSelect}
          />
        </div>
        
        <div className="my-4">
          <ContentTypeSelector 
            selectedType={contentType} 
            onTypeChange={setContentType} 
          />
        </div>
        
        <div className="my-6">
          <PromptInput 
            onSubmit={handleInputSubmit}
            isProcessing={isProcessing}
            onVoiceButtonClick={toggleListening}
            isListening={isListening}
          />
        </div>
        
        <div className="mt-8">
          {isProcessing && (
            <div className="flex flex-col items-center justify-center h-48 border border-gray-200 rounded-xl bg-white shadow-sm animate-pulse mb-6">
              <div className="h-8 w-8 border-4 border-t-primary-500 border-r-primary-300 border-b-primary-500 border-l-primary-300 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Generating {contentType}...</p>
            </div>
          )}
          
          <ScrollArea className="h-[calc(100vh-360px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentCards.map((card) => (
                <ContentCard 
                  key={card.id}
                  content={card} 
                  onPlayback={() => handlePlayback(card.id, card.text, card.language)}
                  isPlaying={playingCardId === card.id}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Index;

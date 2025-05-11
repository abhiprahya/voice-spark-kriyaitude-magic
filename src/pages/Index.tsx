
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import VoiceControls from '@/components/VoiceControls';
import ContentCard from '@/components/ContentCard';
import LanguageToggle from '@/components/LanguageToggle';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import PromptInput from '@/components/PromptInput';
import { useToast } from '@/hooks/use-toast';
import { generateContent, textToSpeech, processVoiceCommand } from '@/services/ai';

const Index = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'english' | 'kannada'>('english');
  const [contentType, setContentType] = useState<'caption' | 'meme' | 'script'>('caption');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    type: 'caption' | 'meme' | 'script';
    text: string;
    language: string;
    imageUrl?: string;
  } | null>(null);

  // Handle voice input
  const handleVoiceInput = useCallback(async (text: string) => {
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
      
      await handleContentGeneration(prompt, type || contentType);
    } else {
      // If not a trigger command, just use as a regular prompt
      await handleContentGeneration(text, contentType);
    }
  }, [contentType, toast]);
  
  // Handle text input submission
  const handleInputSubmit = useCallback(async (text: string) => {
    await handleContentGeneration(text, contentType);
  }, [contentType]);
  
  // Generate content based on prompt and type
  const handleContentGeneration = useCallback(async (prompt: string, type: 'caption' | 'meme' | 'script') => {
    setIsProcessing(true);
    
    try {
      const content = await generateContent(type, prompt, language);
      setGeneratedContent(content);
      
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
  const handlePlayback = useCallback(async () => {
    if (!generatedContent || isPlaying) return;
    
    try {
      setIsPlaying(true);
      await textToSpeech(
        generatedContent.text, 
        generatedContent.language === 'English' ? 'english' : 'kannada'
      );
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: 'Playback failed',
        description: 'Your browser may not support this voice language.',
        variant: 'destructive',
      });
    } finally {
      setIsPlaying(false);
    }
  }, [generatedContent, isPlaying, toast]);
  
  // Generate welcome message on first load
  useEffect(() => {
    const generateWelcomeContent = async () => {
      setIsProcessing(true);
      try {
        const welcomeContent = await generateContent('caption', 'welcome', language);
        setGeneratedContent(welcomeContent);
      } catch (error) {
        console.error('Error generating welcome content:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    generateWelcomeContent();
  }, [language]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-24 px-4 max-w-md mx-auto">
        <div className="my-4 flex justify-center">
          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={setLanguage} 
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
          />
        </div>
        
        <div className="mt-6 space-y-4">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-48 border border-gray-200 rounded-xl bg-white shadow-sm animate-pulse">
              <div className="h-8 w-8 border-4 border-t-primary-500 border-r-primary-300 border-b-primary-500 border-l-primary-300 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Generating {contentType}...</p>
            </div>
          ) : generatedContent ? (
            <ContentCard 
              content={generatedContent} 
              onPlayback={handlePlayback}
              isPlaying={isPlaying}
            />
          ) : null}
        </div>
      </main>
      
      <VoiceControls 
        onVoiceInput={handleVoiceInput} 
        isProcessing={isProcessing} 
      />
    </div>
  );
};

export default Index;

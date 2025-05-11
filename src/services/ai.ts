
// Simulated API service for the MVP

// Mock meme template URLs
const memeTemplates = [
  '/placeholder.svg',
  'https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg',
  'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg',
  'https://imgflip.com/s/meme/Two-Buttons.jpg',
  'https://imgflip.com/s/meme/Unsettled-Tom.jpg',
  'https://imgflip.com/s/meme/Roll-Safe-Think-About-It.jpg'
];

// For Kannada mock translations (English to Kannada-like text simulation)
const mockKannadaTranslation = (text: string): string => {
  const kannadaPhrases = {
    'create': 'ಸೃಷ್ಟಿಸಿ',
    'awesome': 'ಅದ್ಭುತ',
    'caption': 'ಶೀರ್ಷಿಕೆ',
    'meme': 'ಮೀಮ್',
    'script': 'ಸ್ಕ್ರಿಪ್ಟ್',
    'funny': 'ತಮಾಷೆ',
    'trending': 'ಟ್ರೆಂಡಿಂಗ್',
    'social': 'ಸಾಮಾಜಿಕ',
    'media': 'ಮಾಧ್ಯಮ',
    'today': 'ಇಂದು',
    'content': 'ವಿಷಯ',
    'idea': 'ಕಲ್ಪನೆ',
    'creative': 'ಸೃಜನಾತ್ಮಕ',
    'post': 'ಪೋಸ್ಟ್',
    'viral': 'ವೈರಲ್',
    'share': 'ಹಂಚಿಕೊಳ್ಳಿ',
    'generate': 'ರಚಿಸಿ',
    'inspiration': 'ಸ್ಫೂರ್ತಿ',
    'kriyaitude': 'ಕ್ರಿಯಾಟಿಟ್ಯೂಡ್'
  };
  
  let result = text;
  Object.entries(kannadaPhrases).forEach(([eng, kan]) => {
    const regex = new RegExp(eng, 'gi');
    result = result.replace(regex, kan);
  });
  
  return `${result} ನಲ್ಲಿ`;
};

// Generate random content based on type, prompt, and language
export const generateContent = async (
  type: 'caption' | 'meme' | 'script',
  prompt: string,
  language: 'english' | 'kannada'
): Promise<{
  type: 'caption' | 'meme' | 'script';
  text: string;
  language: string;
  imageUrl?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample responses for each content type
  const captions = [
    "Living my best life one adventure at a time ✨",
    "Not all who wander are lost, but I definitely am 🧭",
    "Less talk, more action. Let the results speak 💯",
    "Sunshine mixed with a little hurricane 🌪️",
    "Too blessed to be stressed 🙏"
  ];
  
  const memeTexts = [
    "When you finally find the last matching sock",
    "Me explaining to my boss why I need a raise",
    "That moment when the weekend is already over",
    "Nobody: ... Me: *Makes another unnecessary purchase*",
    "How I look vs How I feel during video calls"
  ];
  
  const scripts = [
    "Hey followers! Ever wonder how I get that perfect morning glow? Let me take you through my 3-step routine that changed everything...",
    "The secret to viral content isn't what you think. After analyzing 100+ trending posts, I discovered these 3 patterns...",
    "POV: You're scrolling through social media when suddenly you see THAT post from your ex. Your reaction? Priceless.",
    "Unpopular opinion: The best time to post isn't when everyone tells you. Here's what actually works based on my analytics...",
    "Day in my life as a content creator: The reality vs what you see online. Spoiler: It involves a lot more coffee and pajamas."
  ];
  
  // Select appropriate content based on type
  let text: string;
  let imageUrl: string | undefined;
  
  switch (type) {
    case 'caption':
      text = captions[Math.floor(Math.random() * captions.length)];
      break;
    case 'meme':
      text = memeTexts[Math.floor(Math.random() * memeTexts.length)];
      imageUrl = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
      break;
    case 'script':
      text = scripts[Math.floor(Math.random() * scripts.length)];
      break;
    default:
      text = "Here's a creative idea for your next post!";
  }
  
  // Process prompt to personalize response if needed
  if (prompt.toLowerCase().includes('food')) {
    text = type === 'caption' 
      ? "Food so good it deserves a photoshoot 📸" 
      : type === 'meme'
      ? "When the waiter says 'enjoy your meal' and you reply 'you too'"
      : "Let me tell you about this hidden gem restaurant I discovered last weekend. The ambiance was...";
  } else if (prompt.toLowerCase().includes('travel')) {
    text = type === 'caption'
      ? "Collecting moments, not things ✈️"
      : type === 'meme'
      ? "My bank account after booking a vacation vs me on vacation"
      : "Travel tip #27: Always pack these three items that tourists often forget but locals consider essential...";
  }
  
  // Translate if language is Kannada
  if (language === 'kannada') {
    text = mockKannadaTranslation(text);
  }
  
  return {
    type,
    text,
    language: language === 'english' ? 'English' : 'ಕನ್ನಡ',
    imageUrl: type === 'meme' ? imageUrl : undefined
  };
};

// Simulate text-to-speech
export const textToSpeech = (text: string, language: 'english' | 'kannada'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'english' ? 'en-US' : 'kn-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (error) => {
        reject(error);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech not supported');
      reject(new Error('Text-to-speech not supported'));
    }
  });
};

// Process voice command for intent detection
export const processVoiceCommand = (command: string): { 
  type: 'caption' | 'meme' | 'script' | null;
  prompt: string;
} => {
  const lowercaseCommand = command.toLowerCase();
  
  let type: 'caption' | 'meme' | 'script' | null = null;
  let prompt = command;
  
  // Extract content type from command
  if (lowercaseCommand.includes('caption')) {
    type = 'caption';
  } else if (lowercaseCommand.includes('meme')) {
    type = 'meme';
  } else if (lowercaseCommand.includes('script')) {
    type = 'script';
  }
  
  // Extract actual prompt by removing trigger phrases
  const triggerPhrases = [
    'hey kriyaitude',
    'create a',
    'generate a',
    'make a',
    'give me a',
    'create',
    'generate',
    'caption',
    'meme',
    'script'
  ];
  
  triggerPhrases.forEach(phrase => {
    prompt = prompt.replace(new RegExp(phrase, 'gi'), '');
  });
  
  prompt = prompt.trim();
  if (!prompt) {
    prompt = 'creative content';
  }
  
  return { type, prompt };
};

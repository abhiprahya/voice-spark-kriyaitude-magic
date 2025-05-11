
import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-30 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h1 className="text-xl font-bold text-primary-600">Kriyaitude AI</h1>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-600">
          Sign In
        </Button>
      </div>
      <div className="w-full h-24 bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <img 
            src="/placeholder.svg" 
            alt="Kriyaitude AI" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-primary-800 text-center">
              Kriyaitude AI
            </h2>
            <p className="text-sm text-primary-700 mt-1">
              Voice-powered content generation
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


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
    </header>
  );
};

export default Header;

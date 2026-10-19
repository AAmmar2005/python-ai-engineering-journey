import React from 'react';
import { Activity, Share2, Compass, Brain } from 'lucide-react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  readinessScore?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 h-16 bg-surface/95 backdrop-blur-md dark:bg-surface/95 border-t border-outline-variant/60 z-50 shadow-lg">
      <button
        onClick={() => onNavigate('track')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentView === 'track' 
            ? 'text-primary font-bold scale-105 bg-primary/10' 
            : 'text-on-surface-variant hover:bg-surface-container-highest/50'
        }`}
      >
        <Activity className={`w-5 h-5 ${currentView === 'track' ? 'text-primary stroke-[2.5]' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Track</span>
      </button>

      <button
        onClick={() => onNavigate('export')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentView === 'export' 
            ? 'text-primary font-bold scale-105 bg-primary/10' 
            : 'text-on-surface-variant hover:bg-surface-container-highest/50'
        }`}
      >
        <Share2 className={`w-5 h-5 ${currentView === 'export' ? 'text-primary stroke-[2.5]' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Export</span>
      </button>

      <button
        onClick={() => onNavigate('blueprint')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentView === 'blueprint' || currentView === 'input'
            ? 'text-primary font-bold scale-105 bg-primary/10' 
            : 'text-on-surface-variant hover:bg-surface-container-highest/50'
        }`}
      >
        <Compass className={`w-5 h-5 ${currentView === 'blueprint' || currentView === 'input' ? 'text-primary stroke-[2.5]' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Blueprints</span>
      </button>

      <button
        onClick={() => onNavigate('aichat')}
        className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentView === 'aichat' 
            ? 'text-primary font-bold scale-105 bg-primary/10' 
            : 'text-on-surface-variant hover:bg-surface-container-highest/50'
        }`}
      >
        <div className="relative">
          <Brain className={`w-5 h-5 ${currentView === 'aichat' ? 'text-primary stroke-[2.5]' : ''}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary animate-pulse" />
        </div>
        <span className="text-[10px] font-semibold mt-1">AI Chat</span>
      </button>
    </nav>
  );
};

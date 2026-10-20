import React from 'react';
import { Menu, Sparkles, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
import { USER_AVATAR_1, USER_AVATAR_2, MOCK_BLUEPRINTS } from '../data/mockData';
import { ViewMode } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  apiConnected: boolean;
  onToggleApi: () => void;
  activeBlueprintId: string;
  onSelectBlueprint: (id: string) => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userAvatarIndex: number;
  onToggleAvatar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  apiConnected,
  onToggleApi,
  activeBlueprintId,
  onSelectBlueprint,
  currentView,
  onNavigate,
  userAvatarIndex,
  onToggleAvatar
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const activeBlueprint = MOCK_BLUEPRINTS[activeBlueprintId] || MOCK_BLUEPRINTS['bp-neural'];
  const currentAvatarUrl = userAvatarIndex === 0 ? USER_AVATAR_1 : USER_AVATAR_2;

  return (
    <header className="bg-surface dark:bg-surface flex justify-between items-center w-full px-4 sm:px-8 h-16 z-50 shadow-sm dark:shadow-none sticky top-0 border-b border-outline-variant/30 transition-colors">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          title="Open menu"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
        
        <div 
          onClick={() => onNavigate('input')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Go to Input Workspace"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary dark:text-inverse-primary tracking-tight">TaskPulse AI</h1>
        </div>

        {/* Quick Blueprint Selector Badge on Tablet/Desktop */}
        {currentView !== 'input' && (
          <div className="relative hidden md:block ml-4">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm font-medium text-on-surface"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span className="max-w-[180px] truncate">{activeBlueprint.title}</span>
              <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Switch Active Blueprint
                </div>
                {Object.values(MOCK_BLUEPRINTS).map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => {
                      onSelectBlueprint(bp.id);
                      setShowDropdown(false);
                      if (currentView === 'input') onNavigate('blueprint');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      bp.id === activeBlueprintId 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{bp.title}</div>
                      <div className="text-xs text-on-surface-variant">{bp.subtitle.split('•')[1] || bp.subtitle}</div>
                    </div>
                    {bp.id === activeBlueprintId && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-outline-variant/40 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onNavigate('input');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    + Create New Blueprint
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick View Mode Toggle Pills */}
        <div className="hidden lg:flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/60">
          <button
            onClick={() => onNavigate('input')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              currentView === 'input' 
                ? 'bg-white shadow-sm text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Input Workspace
          </button>
          <button
            onClick={() => onNavigate('blueprint')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              currentView === 'blueprint' 
                ? 'bg-white shadow-sm text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Study Sprint Results
          </button>
        </div>

        {/* API Connected Badge */}
        <button 
          onClick={onToggleApi}
          title={apiConnected ? "Gemini API Connected (Click to toggle offline simulation mode)" : "Offline Simulation Mode (Click to connect API)"}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-full border border-outline-variant transition-colors cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-xs font-medium text-on-surface-variant">
            {apiConnected ? 'API: Connected' : 'API: Simulation'}
          </span>
        </button>

        {/* User Avatar - Hotlinked exactly as requested */}
        <button 
          onClick={onToggleAvatar}
          title="Switch User Avatar / Profile"
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high hover:scale-105 transition-transform shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <img 
            className="w-full h-full object-cover" 
            src={currentAvatarUrl} 
            alt="User profile portrait"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};

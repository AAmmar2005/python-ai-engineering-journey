import React from 'react';
import { 
  X, 
  Sparkles, 
  Activity, 
  Share2, 
  Compass, 
  Brain, 
  Moon, 
  Sun, 
  Settings, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { Blueprint, ViewMode } from '../types';
import { USER_AVATAR_1, USER_AVATAR_2, MOCK_BLUEPRINTS } from '../data/mockData';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  blueprints: Record<string, Blueprint>;
  activeBlueprintId: string;
  onSelectBlueprint: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  apiConnected: boolean;
  onToggleApi: () => void;
  userAvatarIndex: number;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  blueprints,
  activeBlueprintId,
  onSelectBlueprint,
  isDarkMode,
  onToggleDarkMode,
  apiConnected,
  onToggleApi,
  userAvatarIndex
}) => {
  if (!isOpen) return null;

  const currentAvatarUrl = userAvatarIndex === 0 ? USER_AVATAR_1 : USER_AVATAR_2;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-surface-container-lowest shadow-2xl border-r border-outline-variant flex flex-col justify-between animate-in slide-in-from-left duration-300">
        <div className="p-5 overflow-y-auto space-y-6 no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-primary dark:text-inverse-primary tracking-tight">TaskPulse AI</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary shrink-0">
              <img src={currentAvatarUrl} alt="User profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-on-surface truncate">Farzeen Abbas</p>
              <p className="text-[11px] text-on-surface-variant truncate">farzeenabbas035@gmail.com</p>
              <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                Pro Plan Active
              </span>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-2 mb-1">
              Workspaces &amp; Views
            </p>

            <button
              onClick={() => { onNavigate('input'); onClose(); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                currentView === 'input' 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Input Workspace</span>
            </button>

            <button
              onClick={() => { onNavigate('blueprint'); onClose(); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                currentView === 'blueprint' 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Study Sprint Results</span>
            </button>

            <button
              onClick={() => { onNavigate('track'); onClose(); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                currentView === 'track' 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Track Analytics</span>
            </button>

            <button
              onClick={() => { onNavigate('export'); onClose(); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                currentView === 'export' 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Export Workspace</span>
            </button>

            <button
              onClick={() => { onNavigate('aichat'); onClose(); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                currentView === 'aichat' 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4" />
                <span>AI Co-pilot Chat</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </button>
          </div>

          {/* Active Blueprints List */}
          <div className="space-y-1 pt-2 border-t border-outline-variant/40">
            <div className="flex items-center justify-between px-2 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Your Blueprints
              </p>
              <span className="text-[10px] bg-surface-container font-semibold px-2 py-0.5 rounded-full text-on-surface-variant">
                {Object.keys(blueprints).length}
              </span>
            </div>

            {(Object.values(blueprints) as Blueprint[]).map((bp) => (
              <button
                key={bp.id}
                onClick={() => {
                  onSelectBlueprint(bp.id);
                  if (currentView === 'input') onNavigate('blueprint');
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  bp.id === activeBlueprintId 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate font-semibold">{bp.title}</div>
                  <div className="text-[10px] text-on-surface-variant">{bp.readinessScore}% ready</div>
                </div>
                {bp.id === activeBlueprintId && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            ))}
          </div>

          {/* Settings & Controls */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-2 mb-1">
              Preferences &amp; Engine
            </p>

            <button
              onClick={onToggleDarkMode}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
                <span>Theme Mode</span>
              </div>
              <span className="text-[10px] font-semibold bg-surface-container px-2 py-0.5 rounded-full capitalize">
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
            </button>

            <button
              onClick={onToggleApi}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>AI Processing Engine</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                apiConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {apiConnected ? 'Live Gemini' : 'Simulated'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/40 bg-surface-container-low/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span>TaskPulse AI v2.4</span>
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

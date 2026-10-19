import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { InputWorkspace } from './components/InputWorkspace';
import { BlueprintResultsView } from './components/BlueprintResultsView';
import { TrackView } from './components/TrackView';
import { ExportView } from './components/ExportView';
import { AIChatView } from './components/AIChatView';
import { SidebarDrawer } from './components/SidebarDrawer';
import { MOCK_BLUEPRINTS, SYLLABUS_TEMPLATES } from './data/mockData';
import { Blueprint, FileAttachment, ViewMode } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('input');
  const [blueprints, setBlueprints] = useState<Record<string, Blueprint>>(MOCK_BLUEPRINTS);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>('bp-neural');
  
  // Input Workspace State
  const [syllabusText, setSyllabusText] = useState<string>('');
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(65);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('Initializing AI engine...');
  
  // App Preferences
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [userAvatarIndex, setUserAvatarIndex] = useState<number>(0);
  const [chatInitialTopic, setChatInitialTopic] = useState<string | undefined>(undefined);

  const activeBlueprint = blueprints[activeBlueprintId] || blueprints['bp-neural'];

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamically calculate readiness score based on input completeness
  useEffect(() => {
    let base = 65;
    if (syllabusText.length > 100) base += 10;
    if (syllabusText.length > 500) base += 10;
    if (files.length > 0) base += Math.min(15, files.length * 5);
    setReadinessScore(Math.min(100, base));
  }, [syllabusText, files]);

  // Handle Blueprint Generation
  const handleGenerateBlueprint = (templateId?: string) => {
    setIsGenerating(true);
    const steps = [
      'Parsing syllabus structure & exam dates...',
      'Extracting 12 core study task units...',
      'Synthesizing interactive flashcards...',
      'Optimizing weekly timeline & lab pacing...'
    ];
    
    let stepIdx = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setGenerationStep(steps[stepIdx]);
      }
    }, 700);

    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
      
      // If user typed custom text or used a template, update active blueprint or switch
      if (templateId && blueprints[templateId]) {
        setActiveBlueprintId(templateId);
      } else if (syllabusText.toLowerCase().includes('econ')) {
        setActiveBlueprintId('bp-econ');
      } else if (syllabusText.toLowerCase().includes('system') || syllabusText.toLowerCase().includes('design')) {
        setActiveBlueprintId('bp-sysdesign');
      } else {
        // Update neural networks blueprint readiness
        const updated = {
          ...activeBlueprint,
          readinessScore: Math.max(85, readinessScore),
          lastUpdated: 'Just now'
        };
        setBlueprints(prev => ({ ...prev, [activeBlueprint.id]: updated }));
      }

      setCurrentView('blueprint');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2800);
  };

  const handleUpdateBlueprint = (updated: Blueprint) => {
    setBlueprints(prev => ({
      ...prev,
      [updated.id]: updated
    }));
  };

  const handleOpenAIChatWithContext = (topic?: string) => {
    setChatInitialTopic(topic);
    setCurrentView('aichat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportAction = (format: 'pdf' | 'markdown' | 'copy') => {
    setCurrentView('export');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(true)}
        apiConnected={apiConnected}
        onToggleApi={() => setApiConnected(!apiConnected)}
        activeBlueprintId={activeBlueprintId}
        onSelectBlueprint={(id) => {
          setActiveBlueprintId(id);
          if (currentView === 'input') setCurrentView('blueprint');
        }}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userAvatarIndex={userAvatarIndex}
        onToggleAvatar={() => setUserAvatarIndex((prev) => (prev + 1) % 2)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentView === 'input' && (
          <InputWorkspace
            syllabusText={syllabusText}
            onSyllabusChange={setSyllabusText}
            onGenerateBlueprint={handleGenerateBlueprint}
            isGenerating={isGenerating}
            generationStep={generationStep}
            files={files}
            onAddFiles={(newFiles) => setFiles(prev => [...prev, ...newFiles])}
            onRemoveFile={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
            readinessScore={readinessScore}
          />
        )}

        {currentView === 'blueprint' && (
          <BlueprintResultsView
            blueprint={activeBlueprint}
            onUpdateBlueprint={handleUpdateBlueprint}
            onBackToInput={() => {
              setCurrentView('input');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAIChatWithContext={handleOpenAIChatWithContext}
            onExportAction={handleExportAction}
          />
        )}

        {currentView === 'track' && (
          <TrackView
            blueprints={blueprints}
            activeBlueprintId={activeBlueprintId}
            onSelectBlueprint={(id) => setActiveBlueprintId(id)}
            onNavigateToBlueprint={() => {
              setCurrentView('blueprint');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'export' && (
          <ExportView
            blueprint={activeBlueprint}
            onBackToBlueprint={() => {
              setCurrentView('blueprint');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'aichat' && (
          <AIChatView
            blueprint={activeBlueprint}
            onBackToBlueprint={() => {
              setCurrentView('blueprint');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialTopic={chatInitialTopic}
            userAvatarIndex={userAvatarIndex}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        readinessScore={activeBlueprint.readinessScore}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        blueprints={blueprints}
        activeBlueprintId={activeBlueprintId}
        onSelectBlueprint={(id) => setActiveBlueprintId(id)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        apiConnected={apiConnected}
        onToggleApi={() => setApiConnected(!apiConnected)}
        userAvatarIndex={userAvatarIndex}
      />
    </div>
  );
}

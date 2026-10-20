import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  AlertTriangle, 
  FileText, 
  Video, 
  MoreVertical, 
  Printer, 
  FileCode, 
  Copy, 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  Play, 
  CheckCircle2, 
  Plus, 
  Lightbulb,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Blueprint, TabMode } from '../types';

interface BlueprintResultsViewProps {
  blueprint: Blueprint;
  onUpdateBlueprint: (updated: Blueprint) => void;
  onBackToInput: () => void;
  onOpenAIChatWithContext: (topic?: string) => void;
  onExportAction: (format: 'pdf' | 'markdown' | 'copy') => void;
}

export const BlueprintResultsView: React.FC<BlueprintResultsViewProps> = ({
  blueprint,
  onUpdateBlueprint,
  onBackToInput,
  onOpenAIChatWithContext,
  onExportAction
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('roadmap');
  const [selectedWeek, setSelectedWeek] = useState<number>(2); // Default to Week 2 (Active)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [showMilestoneTip, setShowMilestoneTip] = useState<string | null>(null);
  const [activeTimerItem, setActiveTimerItem] = useState<string | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [showAddMilestone, setShowAddMilestone] = useState<boolean>(false);

  const flashcards = blueprint.flashcards || [];
  const currentCard = flashcards[currentCardIndex] || flashcards[0];

  // Handle milestone checkbox toggle
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = blueprint.criticalMilestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    
    // Also update inside weeklyTimeline
    const updatedTimeline = blueprint.weeklyTimeline.map(week => ({
      ...week,
      milestones: week.milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
    }));

    // Recalculate readiness
    const totalMilestones = updatedMilestones.length;
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newReadiness = Math.min(100, Math.max(20, Math.round((completedCount / totalMilestones) * 85) + 15));

    onUpdateBlueprint({
      ...blueprint,
      criticalMilestones: updatedMilestones,
      weeklyTimeline: updatedTimeline,
      readinessScore: newReadiness,
      lastUpdated: 'Just now'
    });
  };

  // Handle action plan item toggle
  const handleToggleActionItem = (itemId: string) => {
    const updatedItems = blueprint.actionPlan.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateBlueprint({
      ...blueprint,
      actionPlan: {
        ...blueprint.actionPlan,
        items: updatedItems
      },
      lastUpdated: 'Just now'
    });
  };

  // Handle adding custom milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const newM = {
      id: `cm-custom-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      completed: false,
      category: 'lab' as const,
      aiTip: 'Custom study target added by user.'
    };
    onUpdateBlueprint({
      ...blueprint,
      criticalMilestones: [...blueprint.criticalMilestones, newM],
      lastUpdated: 'Just now'
    });
    setNewMilestoneTitle('');
    setShowAddMilestone(false);
  };

  // Flashcard navigation
  const nextCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // Keyboard navigation for flashcards
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'flashcards') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isCardFlipped, currentCardIndex, flashcards.length]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBackToInput}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Input Workspace
          </button>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">{blueprint.title}</h2>
          <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-2">
            <span>{blueprint.subtitle}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
            <span className="text-primary font-medium">{blueprint.readinessScore}% Readiness</span>
          </p>
        </div>
        
        <button
          onClick={() => onOpenAIChatWithContext(`Help me plan my study schedule for ${blueprint.title}`)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-semibold transition-colors border border-secondary/20 shadow-sm"
        >
          <Brain className="w-4 h-4" />
          Ask Co-pilot
        </button>
      </div>

      {/* Tabbed Navigation (matching prototype) */}
      <div className="flex border-b border-outline-variant/60 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'roadmap'
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Roadmap</span>
          <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {blueprint.weeklyTimeline.length} wks
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'flashcards'
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Flashcards</span>
          <span className="text-[11px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
            {flashcards.length}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('actionplan')}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'actionplan'
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Action Plan</span>
          <span className="text-[11px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full">
            {blueprint.actionPlan.items.filter(i => !i.completed).length} left
          </span>
        </button>
      </div>

      {/* TAB 1: ROADMAP */}
      {activeTab === 'roadmap' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Weekly Timeline Card */}
          <div className="glass-card rounded-2xl p-5 shadow-sm border border-outline-variant/60 bg-white dark:bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Weekly Timeline</h3>
              <div className="flex items-center gap-1.5">
                {blueprint.weeklyTimeline.map((w) => (
                  <button
                    key={w.weekNumber}
                    onClick={() => setSelectedWeek(w.weekNumber)}
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                      selectedWeek === w.weekNumber 
                        ? 'bg-primary text-white shadow-sm' 
                        : w.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-primary-container/10 text-primary hover:bg-primary-container/20'
                    }`}
                  >
                    W{w.weekNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-surface-container-high pl-1">
              {blueprint.weeklyTimeline.map((item) => {
                const isSelected = selectedWeek === item.weekNumber;
                return (
                  <div 
                    key={item.weekNumber}
                    onClick={() => setSelectedWeek(item.weekNumber)}
                    className={`flex gap-4 relative cursor-pointer p-2.5 rounded-xl transition-all ${
                      isSelected ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-surface-container-low/60'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center z-10 shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    ) : item.status === 'active' ? (
                      <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-surface-container-lowest flex items-center justify-center z-10 shadow-md shrink-0 animate-pulse"></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center z-10 shrink-0"></div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold truncate ${item.status === 'active' ? 'text-primary' : 'text-on-surface'}`}>
                          Week {item.weekNumber}: {item.title}
                        </p>
                        {item.hoursTotal && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                            {item.hoursTotal} hrs
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.statusText}</p>

                      {/* Expand milestones if selected */}
                      {isSelected && item.milestones && item.milestones.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-outline-variant/40 space-y-2 animate-in fade-in duration-200">
                          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                            Week {item.weekNumber} Deliverables:
                          </p>
                          {item.milestones.map((ms) => (
                            <div key={ms.id} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${ms.completed ? 'text-emerald-500' : 'text-outline'}`} />
                              <span className={ms.completed ? 'line-through text-on-surface-variant/70' : 'text-on-surface font-medium'}>
                                {ms.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Critical Milestones Card (matching prototype with secondary purple left border) */}
          <div className="glass-card rounded-2xl p-5 shadow-sm border-l-4 border-l-secondary bg-white dark:bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="text-sm font-bold text-on-surface">AI Critical Milestones</h3>
              </div>
              <button 
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Target
              </button>
            </div>

            {/* Add milestone inline form */}
            {showAddMilestone && (
              <form onSubmit={handleAddMilestone} className="mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant flex gap-2">
                <input 
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="Enter custom study milestone..."
                  className="flex-1 bg-white dark:bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </form>
            )}

            <div className="space-y-2">
              {blueprint.criticalMilestones.map((ms) => (
                <div 
                  key={ms.id}
                  className="flex flex-col rounded-xl p-2.5 hover:bg-surface-container-low transition-colors group border border-transparent hover:border-outline-variant/50"
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                      <input 
                        type="checkbox"
                        checked={ms.completed}
                        onChange={() => handleToggleMilestone(ms.id)}
                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary cursor-pointer transition-transform active:scale-90"
                      />
                      <span className={`text-sm font-medium transition-all ${
                        ms.completed ? 'text-on-surface-variant/70 line-through' : 'text-on-surface'
                      }`}>
                        {ms.title}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      {ms.category && (
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          ms.category === 'core' ? 'bg-primary/10 text-primary' :
                          ms.category === 'lab' ? 'bg-secondary/10 text-secondary' :
                          'bg-amber-500/10 text-amber-700'
                        }`}>
                          {ms.category}
                        </span>
                      )}
                      {ms.aiTip && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMilestoneTip(showMilestoneTip === ms.id ? null : ms.id);
                          }}
                          className="p-1 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container"
                          title="View AI tip"
                        >
                          <Lightbulb className={`w-4 h-4 ${showMilestoneTip === ms.id ? 'text-amber-500 fill-amber-500/20' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Tip expandable box */}
                  {showMilestoneTip === ms.id && ms.aiTip && (
                    <div className="mt-2.5 ml-8 p-3 rounded-xl bg-secondary/5 border border-secondary/20 text-xs text-on-surface flex gap-2 items-start animate-in fade-in duration-150">
                      <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold text-secondary">AI Coach Tip: </span>
                        {ms.aiTip}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center py-4 gap-6"
        >
          {flashcards.length > 0 ? (
            <>
              {/* Interactive Flashcard with Framer Motion */}
              <div
                onClick={flipCard}
                className="w-full max-w-lg aspect-[4/5] max-h-[380px] glass-card rounded-3xl shadow-xl ai-glow p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 cursor-pointer group select-none bg-white dark:bg-surface-container-lowest border-2 border-outline-variant/60 hover:border-primary/50"
              >
                <div className="absolute top-4 left-5 flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    currentCard.difficulty === 'Hard' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                    currentCard.difficulty === 'Medium' ? 'bg-secondary/15 text-secondary font-semibold' :
                    'bg-emerald-500/15 text-emerald-700 font-semibold'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                    {currentCard.category}
                  </span>
                </div>

                <div className="absolute top-4 right-5">
                  <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/50">
                    Card {currentCardIndex + 1}/{flashcards.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {!isCardFlipped ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, rotateX: 90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      exit={{ opacity: 0, rotateX: -90 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 px-2 my-auto"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
                        Question
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-on-surface leading-relaxed">
                        {currentCard.question}
                      </h4>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, rotateX: -90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      exit={{ opacity: 0, rotateX: 90 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 px-2 my-auto"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">
                        Answer
                      </span>
                      <p className="text-base sm:text-lg font-medium text-on-surface-variant leading-relaxed">
                        {currentCard.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-5 left-0 w-full flex justify-center">
                  <button 
                    type="button"
                    className="text-primary font-bold text-xs tracking-wider flex items-center gap-1.5 bg-primary/5 hover:bg-primary/15 px-4 py-2 rounded-full transition-all group-hover:scale-105"
                  >
                    <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isCardFlipped ? 'rotate-180' : ''}`} />
                    <span>{isCardFlipped ? 'TAP TO SEE QUESTION' : 'TAP TO FLIP'}</span>
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full max-w-lg px-2">
                <button
                  onClick={prevCard}
                  className="w-12 h-12 rounded-full border border-outline-variant bg-white dark:bg-surface-container-low flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary active:scale-95"
                  title="Previous card (Left arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex gap-1.5">
                    {flashcards.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setIsCardFlipped(false); setCurrentCardIndex(idx); }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentCardIndex 
                            ? 'w-6 bg-primary shadow-sm' 
                            : 'w-2 bg-outline-variant/60 hover:bg-outline'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-on-surface-variant/70">
                    Use Spacebar or arrow keys to flip &amp; navigate
                  </span>
                </div>

                <button
                  onClick={nextCard}
                  className="w-12 h-12 rounded-full border border-outline-variant bg-white dark:bg-surface-container-low flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary active:scale-95"
                  title="Next card (Right arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Quick AI explanation prompt */}
              <div className="w-full max-w-lg mt-2 p-3 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-on-surface">
                  <Brain className="w-4 h-4 text-secondary" />
                  <span>Stuck on this card? Have Co-pilot break it down with simple analogies.</span>
                </div>
                <button
                  onClick={() => onOpenAIChatWithContext(`Explain ${currentCard.question} in simple terms with an analogy.`)}
                  className="px-3 py-1 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-secondary/90 shrink-0 transition-colors shadow-sm"
                >
                  Explain AI
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center glass-card rounded-2xl w-full">
              <Brain className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold text-on-surface">No flashcards available in this blueprint yet.</p>
              <button
                onClick={() => onOpenAIChatWithContext('Generate 5 flashcards for my study sprint')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Generate AI Flashcards
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: ACTION PLAN */}
      {activeTab === 'actionplan' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* AI Recommendation Box (matching prototype) */}
          <div className="bg-secondary-container/15 border border-secondary/30 rounded-2xl p-4 flex gap-3.5 shadow-sm">
            <Brain className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-on-secondary-container">{blueprint.actionPlan.recommendation.title}</p>
                {blueprint.actionPlan.recommendation.timeSavedMinutes && (
                  <span className="text-xs font-semibold bg-secondary text-white px-2 py-0.5 rounded-full shadow-xs">
                    Save {blueprint.actionPlan.recommendation.timeSavedMinutes}m
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {blueprint.actionPlan.recommendation.description}
              </p>
              <button
                onClick={() => {
                  alert('AI Schedule Optimization Applied! Automatically re-prioritized tasks to maximize study efficiency.');
                }}
                className="mt-2.5 text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span>{blueprint.actionPlan.recommendation.actionText || 'Apply AI Schedule Optimization'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Timer Banner if focus mode running */}
          {activeTimerItem && (
            <div className="p-3.5 rounded-2xl bg-primary text-white flex items-center justify-between shadow-lg animate-pulse">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <p className="text-xs font-bold">Focus Mode Active</p>
                  <p className="text-[11px] text-white/80">Working on: {activeTimerItem}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTimerItem(null)}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
              >
                Stop Timer
              </button>
            </div>
          )}

          {/* Priority List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Prioritized Action Items ({blueprint.actionPlan.items.length})
              </span>
              <span className="text-xs text-on-surface-variant">
                Sorted by AI Priority
              </span>
            </div>

            {blueprint.actionPlan.items.map((item) => (
              <div 
                key={item.id}
                className={`glass-card rounded-2xl p-4 flex items-center justify-between transition-all bg-white dark:bg-surface-container-lowest ${
                  item.completed ? 'opacity-60 bg-surface-container-low/40' : 'hover:shadow-md hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Priority icon matching HTML prototype */}
                  {item.priority === 'high' ? (
                    <div className="w-10 h-10 rounded-xl bg-error-container/40 flex items-center justify-center text-error shrink-0 shadow-xs">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : item.priority === 'medium' ? (
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0 shadow-xs">
                      <Video className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${item.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                        {item.title}
                      </p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        item.priority === 'high' ? 'bg-error/10 text-error' :
                        item.priority === 'medium' ? 'bg-primary/10 text-primary' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                      <span className="font-medium">Estimated: {item.estimatedMinutes} min</span>
                      {item.type && <span className="capitalize">• {item.type}</span>}
                    </div>

                    {item.notes && !item.completed && (
                      <p className="text-[11px] text-on-surface-variant/80 mt-1.5 bg-surface-container-low p-2 rounded-lg border border-outline-variant/30 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <button
                    onClick={() => handleToggleActionItem(item.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      item.completed 
                        ? 'bg-emerald-500 text-white' 
                        : 'border border-outline-variant hover:border-primary hover:text-primary'
                    }`}
                    title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTimerItem(item.title)}
                    className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-xs font-semibold flex items-center gap-1 hidden sm:flex"
                    title="Start 25-min focus timer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Focus</span>
                  </button>

                  <button
                    onClick={() => onOpenAIChatWithContext(`Give me a step-by-step tutorial for completing: ${item.title}`)}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    title="Get AI step-by-step help"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Export Workspace Section (matching prototype) */}
      <div className="mt-8 mb-6 pt-6 border-t border-outline-variant/60">
        <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <span>Export Workspace</span>
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onExportAction('pdf')}
            className="flex flex-col items-center justify-center gap-1.5 py-4 glass-card rounded-2xl hover:bg-primary/5 hover:border-primary/40 transition-all group shadow-xs active:scale-95"
          >
            <Printer className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary">PDF</span>
          </button>
          
          <button 
            onClick={() => onExportAction('markdown')}
            className="flex flex-col items-center justify-center gap-1.5 py-4 glass-card rounded-2xl hover:bg-primary/5 hover:border-primary/40 transition-all group shadow-xs active:scale-95"
          >
            <FileCode className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary">Markdown</span>
          </button>
          
          <button 
            onClick={() => onExportAction('copy')}
            className="flex flex-col items-center justify-center gap-1.5 py-4 glass-card rounded-2xl hover:bg-primary/5 hover:border-primary/40 transition-all group shadow-xs active:scale-95"
          >
            <Copy className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary">Copy</span>
          </button>
        </div>

        <div className="text-center py-4 mt-2">
          <p className="text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-widest flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 inline" />
            Last updated: {blueprint.lastUpdated || 'Today at 09:42 AM'}
          </p>
        </div>
      </div>
    </div>
  );
};

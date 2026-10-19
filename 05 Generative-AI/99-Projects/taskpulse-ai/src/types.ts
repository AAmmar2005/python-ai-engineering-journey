export type ViewMode = 'input' | 'blueprint' | 'track' | 'export' | 'aichat';
export type TabMode = 'roadmap' | 'flashcards' | 'actionplan';

export interface FileAttachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  uploadDate: string;
  progress?: number;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface WeeklyTimelineItem {
  weekNumber: number;
  totalWeeks: number;
  title: string;
  statusText: string;
  status: 'completed' | 'active' | 'scheduled';
  hoursTotal?: number;
  milestonesLeft?: number;
  milestones: TimelineMilestone[];
}

export interface CriticalMilestone {
  id: string;
  title: string;
  completed: boolean;
  category?: 'core' | 'lab' | 'theory';
  aiTip?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'Hard' | 'Medium' | 'Easy';
  category: string;
  reviewedCount?: number;
  lastRating?: 'correct' | 'review';
}

export interface ActionPlanItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  priority: 'high' | 'medium' | 'low';
  type: 'lab' | 'draft' | 'video' | 'reading';
  completed: boolean;
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  actionText?: string;
  timeSavedMinutes?: number;
}

export interface Blueprint {
  id: string;
  title: string;
  subtitle: string;
  readinessScore: number;
  createdAt: string;
  lastUpdated: string;
  syllabusText?: string;
  weeklyTimeline: WeeklyTimelineItem[];
  criticalMilestones: CriticalMilestone[];
  flashcards: Flashcard[];
  actionPlan: {
    recommendation: AIRecommendation;
    items: ActionPlanItem[];
  };
}

export interface SyllabusTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  briefText: string;
  sampleBlueprintId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

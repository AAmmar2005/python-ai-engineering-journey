import React from 'react';
import { Activity, Award, Clock, TrendingUp, CheckCircle2, Flame, Target, ArrowLeft, Calendar } from 'lucide-react';
import { Blueprint } from '../types';

interface TrackViewProps {
  blueprints: Record<string, Blueprint>;
  activeBlueprintId: string;
  onSelectBlueprint: (id: string) => void;
  onNavigateToBlueprint: () => void;
}

export const TrackView: React.FC<TrackViewProps> = ({
  blueprints,
  activeBlueprintId,
  onSelectBlueprint,
  onNavigateToBlueprint
}) => {
  const activeBp = blueprints[activeBlueprintId] || (Object.values(blueprints) as Blueprint[])[0];
  const allBlueprintsList = Object.values(blueprints) as Blueprint[];

  // Calculate aggregate metrics
  const totalHoursLogged = allBlueprintsList.reduce((acc, bp) => {
    const bpHours = bp.weeklyTimeline.reduce((h, w) => h + (w.status === 'completed' ? (w.hoursTotal || 4) : (w.status === 'active' ? (w.hoursTotal || 4) * 0.5 : 0)), 0);
    return acc + bpHours;
  }, 0);

  const totalMilestonesCompleted = allBlueprintsList.reduce((acc, bp) => {
    return acc + bp.criticalMilestones.filter(m => m.completed).length;
  }, 0);

  const averageReadiness = Math.round(
    allBlueprintsList.reduce((acc, bp) => acc + bp.readinessScore, 0) / (allBlueprintsList.length || 1)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Study Pulse &amp; Analytics</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time project readiness &amp; learning velocity across your sprints.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
          <Flame className="w-4 h-4 fill-secondary text-secondary animate-bounce" />
          <span>7-Day Streak!</span>
        </div>
      </div>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between bg-white dark:bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg Readiness</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-on-surface">{averageReadiness}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold ml-1.5 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3 inline" /> +12% this wk
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between bg-white dark:bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Time Logged</span>
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-on-surface">{totalHoursLogged.toFixed(1)}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">hours</span>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Across {allBlueprintsList.length} active blueprints</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between bg-white dark:bg-surface-container-lowest col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Milestones</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-on-surface">{totalMilestonesCompleted}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">achieved</span>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Top 10% learning pace</p>
          </div>
        </div>
      </div>

      {/* Active Blueprints Progress List */}
      <div className="space-y-3 mt-2">
        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>Active Study Blueprints</span>
        </h3>

        <div className="space-y-3">
          {allBlueprintsList.map((bp) => {
            const isCurrent = bp.id === activeBlueprintId;
            const completedCount = bp.criticalMilestones.filter(m => m.completed).length;
            const totalCount = bp.criticalMilestones.length;

            return (
              <div
                key={bp.id}
                onClick={() => {
                  onSelectBlueprint(bp.id);
                  onNavigateToBlueprint();
                }}
                className={`glass-card rounded-2xl p-5 transition-all cursor-pointer bg-white dark:bg-surface-container-lowest border-2 ${
                  isCurrent ? 'border-primary shadow-md bg-primary/5' : 'border-outline-variant/60 hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-on-surface">{bp.title}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                          Active Sprint
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{bp.subtitle}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-primary">{bp.readinessScore}%</span>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase">Readiness</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Milestones completed: {completedCount} of {totalCount}</span>
                    <span>{Math.round((completedCount / (totalCount || 1)) * 100)}% done</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${bp.readinessScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Velocity Chart Graphic */}
      <div className="glass-card rounded-2xl p-5 bg-white dark:bg-surface-container-lowest">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Weekly Learning Velocity (Hours / Day)</span>
          <span className="text-primary normal-case font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> This Week
          </span>
        </h3>

        <div className="flex items-end justify-between h-36 pt-4 px-2 gap-2">
          {[
            { day: 'Mon', hours: 2.5, height: '50%' },
            { day: 'Tue', hours: 3.8, height: '76%' },
            { day: 'Wed', hours: 4.5, height: '90%' },
            { day: 'Thu', hours: 1.5, height: '30%' },
            { day: 'Fri', hours: 5.0, height: '100%', highlight: true },
            { day: 'Sat', hours: 3.0, height: '60%' },
            { day: 'Sun', hours: 4.0, height: '80%' },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.hours}h
              </span>
              <div 
                className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                  bar.highlight ? 'bg-gradient-to-t from-primary to-secondary shadow-md' : 'bg-primary/20 group-hover:bg-primary/40'
                }`}
                style={{ height: bar.height }}
              />
              <span className={`text-xs font-semibold ${bar.highlight ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

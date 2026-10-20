import React, { useState } from 'react';
import { Share2, FileText, FileCode, Copy, Download, Check, Sparkles, Printer, Layers, ArrowLeft } from 'lucide-react';
import { Blueprint } from '../types';

interface ExportViewProps {
  blueprint: Blueprint;
  onBackToBlueprint: () => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  blueprint,
  onBackToBlueprint
}) => {
  const [format, setFormat] = useState<'markdown' | 'json' | 'anki' | 'summary'>('markdown');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate markdown representation
  const generateMarkdown = () => {
    let md = `# ${blueprint.title}\n`;
    md += `**${blueprint.subtitle}** | Readiness: ${blueprint.readinessScore}%\n\n`;
    md += `## 📅 Weekly Timeline\n`;
    blueprint.weeklyTimeline.forEach(w => {
      md += `### Week ${w.weekNumber}: ${w.title} (${w.statusText})\n`;
      w.milestones.forEach(m => {
        md += `- [${m.completed ? 'x' : ' '}] ${m.title}\n`;
      });
      md += `\n`;
    });
    md += `## ⚡ AI Critical Milestones\n`;
    blueprint.criticalMilestones.forEach(m => {
      md += `- [${m.completed ? 'x' : ' '}] **${m.title}** ${m.aiTip ? `*(Tip: ${m.aiTip})*` : ''}\n`;
    });
    md += `\n## 🧠 Study Flashcards (${blueprint.flashcards.length} cards)\n`;
    blueprint.flashcards.forEach((f, idx) => {
      md += `**Q${idx + 1}: ${f.question}**\n*A: ${f.answer}* (${f.difficulty})\n\n`;
    });
    md += `## 🚀 Action Plan\n`;
    md += `> **AI Insight:** ${blueprint.actionPlan.recommendation.description}\n\n`;
    blueprint.actionPlan.items.forEach(item => {
      md += `- [${item.completed ? 'x' : ' '}] **${item.title}** (~${item.estimatedMinutes}m, Priority: ${item.priority})\n`;
    });
    return md;
  };

  // Generate JSON representation
  const generateJSON = () => {
    return JSON.stringify(blueprint, null, 2);
  };

  // Generate Anki Flashcard CSV / TSV format
  const generateAnki = () => {
    let tsv = `# Question\tAnswer\tTags\tDifficulty\n`;
    blueprint.flashcards.forEach(f => {
      tsv += `"${f.question}"\t"${f.answer}"\t"${f.category}"\t"${f.difficulty}"\n`;
    });
    return tsv;
  };

  // Generate plain summary
  const generateSummary = () => {
    return `STUDY SPRINT SUMMARY: ${blueprint.title}\n` +
      `Readiness: ${blueprint.readinessScore}%\n` +
      `Total Task Units: ${blueprint.weeklyTimeline.length + blueprint.flashcards.length}\n` +
      `Completed Milestones: ${blueprint.criticalMilestones.filter(m => m.completed).length} / ${blueprint.criticalMilestones.length}\n` +
      `Next High Priority Action: ${blueprint.actionPlan.items.find(i => !i.completed && i.priority === 'high')?.title || 'None left!'}\n`;
  };

  const getExportContent = () => {
    switch (format) {
      case 'markdown': return generateMarkdown();
      case 'json': return generateJSON();
      case 'anki': return generateAnki();
      case 'summary': return generateSummary();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const ext = format === 'json' ? 'json' : format === 'anki' ? 'tsv' : 'md';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${blueprint.title.replace(/\s+/g, '_')}_export.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBackToBlueprint}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Results View
          </button>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Export Workspace</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Export your AI Study Blueprint into standard formats for Notion, Obsidian, Anki, or PDF printing.
          </p>
        </div>
      </div>

      {/* Format Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setFormat('markdown')}
          className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            format === 'markdown' 
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
              : 'glass-card text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <FileCode className="w-5 h-5" />
          <span className="text-xs">Markdown</span>
        </button>

        <button
          onClick={() => setFormat('json')}
          className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            format === 'json' 
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
              : 'glass-card text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">JSON Data</span>
        </button>

        <button
          onClick={() => setFormat('anki')}
          className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            format === 'anki' 
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
              : 'glass-card text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-xs">Anki Flashcards</span>
        </button>

        <button
          onClick={() => setFormat('summary')}
          className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            format === 'summary' 
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
              : 'glass-card text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs">Quick Summary</span>
        </button>
      </div>

      {/* Preview Box */}
      <div className="glass-card rounded-2xl p-5 bg-white dark:bg-surface-container-lowest border border-outline-variant/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Preview Output ({format.toUpperCase()})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-surface dark:bg-surface-container-low text-xs font-mono text-on-surface overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed border border-outline-variant/40">
          {getExportContent()}
        </pre>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Upload, FileText, Trash2, BookOpen, Sparkles, Cloud, Check, X, File, AlertCircle, ArrowRight } from 'lucide-react';
import { SYLLABUS_TEMPLATES } from '../data/mockData';
import { FileAttachment, SyllabusTemplate } from '../types';

interface InputWorkspaceProps {
  syllabusText: string;
  onSyllabusChange: (text: string) => void;
  onGenerateBlueprint: (templateId?: string) => void;
  isGenerating: boolean;
  generationStep: string;
  files: FileAttachment[];
  onAddFiles: (newFiles: FileAttachment[]) => void;
  onRemoveFile: (id: string) => void;
  readinessScore: number;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  syllabusText,
  onSyllabusChange,
  onGenerateBlueprint,
  isGenerating,
  generationStep,
  files,
  onAddFiles,
  onRemoveFile,
  readinessScore
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const charCount = syllabusText.length;
  const isOverLimit = charCount > 4500;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClear = () => {
    if (syllabusText.trim() === '' && files.length === 0) return;
    if (window.confirm('Are you sure you want to clear your input and attached files?')) {
      onSyllabusChange('');
      files.forEach(f => onRemoveFile(f.id));
      showToast('Workspace cleared');
    }
  };

  const handleSelectTemplate = (template: SyllabusTemplate) => {
    onSyllabusChange(template.briefText);
    setShowTemplateModal(false);
    showToast(`Loaded "${template.name}" template`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate adding dropped files
    const droppedFiles: FileAttachment[] = [];
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files as FileList).forEach((file: File, idx: number) => {
        droppedFiles.push({
          id: `file-${Date.now()}-${idx}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop()?.toUpperCase() || 'DOC',
          uploadDate: 'Just now'
        });
      });
    } else {
      // If user dropped something else, add a mock syllabus file
      droppedFiles.push({
        id: `file-${Date.now()}`,
        name: 'ECON_101_Syllabus_Fall2026.pdf',
        size: 1420000,
        type: 'PDF',
        uploadDate: 'Just now'
      });
    }
    onAddFiles(droppedFiles);
    showToast(`Attached ${droppedFiles.length} file(s)`);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileAttachment[] = Array.from(e.target.files as FileList).map((file: File, idx: number) => ({
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        uploadDate: 'Just now'
      }));
      onAddFiles(newFiles);
      showToast(`Attached ${newFiles.length} file(s)`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-inverse-surface text-on-tertiary px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Title & Subtitle */}
      <section>
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">Input Workspace</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Feed the AI your project materials to generate a smart blueprint.
        </p>
      </section>

      {/* Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`relative group cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'scale-[1.01] bg-primary/5 border-primary shadow-md' 
            : 'hover:bg-surface-container-low'
        }`}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          onChange={handleFileInputChange} 
          className="hidden" 
          accept=".pdf,.docx,.txt,.md,.csv" 
        />
        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
            isDragging ? 'bg-primary text-white shadow-lg' : 'bg-primary/10 text-primary'
          }`}>
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-on-surface">Drag &amp; drop files</h3>
            <p className="text-xs text-on-surface-variant mt-1">PDF, DOCX, or TXT up to 25MB</p>
          </div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
            className="bg-surface-container-highest text-on-surface-variant px-5 py-2 rounded-lg text-sm font-medium hover:bg-outline-variant hover:text-on-surface transition-colors shadow-sm"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Attached Files List */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
            <span>Attached Project Files ({files.length})</span>
            <button 
              onClick={() => files.forEach(f => onRemoveFile(f.id))}
              className="text-error hover:underline text-xs lowercase"
            >
              clear all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-container-low border border-outline-variant/60 shadow-sm hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                    {file.type}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-on-surface truncate">{file.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{formatFileSize(file.size)} • Attached</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Input Area */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="brief" className="text-sm font-medium text-on-surface flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            Paste your syllabus or project brief
          </label>
          <span className="text-xs text-on-surface-variant/70">
            Supports syllabus, assignment prompts &amp; course notes
          </span>
        </div>

        <div className="relative ai-glow-focus rounded-2xl bg-white dark:bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm transition-all">
          <textarea 
            id="brief" 
            value={syllabusText}
            onChange={(e) => onSyllabusChange(e.target.value)}
            placeholder="E.g., ECON 101 Syllabus - Weekly readings, midterms on Oct 12th, final project due Dec 1st..." 
            rows={8}
            maxLength={5000}
            className="w-full border-none focus:ring-0 focus:outline-none p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 bg-transparent resize-y min-h-[160px]"
          />
          <div className={`absolute bottom-2.5 right-3 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${
            isOverLimit ? 'text-error bg-error/10' : 'text-on-surface-variant/60 bg-surface/80'
          }`}>
            {charCount}/5000
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <button 
            type="button"
            onClick={handleClear}
            disabled={charCount === 0 && files.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              charCount === 0 && files.length === 0
                ? 'text-on-surface-variant/40 cursor-not-allowed'
                : 'text-error hover:bg-error/10'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>

          <button 
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20 shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Use Template
          </button>
        </div>
      </section>

      {/* Generation Trigger Button */}
      <section className="mt-2">
        <button 
          type="button"
          onClick={() => onGenerateBlueprint()}
          disabled={isGenerating || (charCount === 0 && files.length === 0)}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all duration-200 ${
            isGenerating 
              ? 'bg-gradient-to-r from-primary/80 to-secondary/80 cursor-wait animate-pulse text-white' 
              : charCount === 0 && files.length === 0
                ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed shadow-none opacity-60'
                : 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/25 hover:scale-[1.01] active:scale-95'
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold leading-none">{generationStep}</span>
                <span className="text-[10px] text-white/80 mt-0.5">TaskPulse AI engine synthesizing...</span>
              </div>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white/20 animate-bounce" />
              <span className="text-lg font-bold tracking-tight">Generate Blueprint</span>
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-on-surface-variant/70 italic flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-primary" />
          AI typically processes input in 5-10 seconds.
        </p>
      </section>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant max-h-[85vh] overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Select Study Blueprint Template</h3>
                  <p className="text-xs text-on-surface-variant">Pre-loaded academic &amp; architecture syllabi</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-low"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 my-1">
              {SYLLABUS_TEMPLATES.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className="p-4 rounded-xl border border-outline-variant/70 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                      {tpl.category}
                    </span>
                    <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Load &amp; Generate <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-outline-variant/40 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar (matching prototype) */}
      <footer className="fixed bottom-16 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant px-4 sm:px-8 py-2.5 z-40 flex flex-col gap-1.5 shadow-sm">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
              <Cloud className="w-4 h-4 text-emerald-500" />
              <span>Saved locally</span>
            </div>
            <div className="text-xs font-medium text-on-surface-variant">
              Project Readiness: <span className="text-primary font-bold">{readinessScore}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(70,72,212,0.4)]"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

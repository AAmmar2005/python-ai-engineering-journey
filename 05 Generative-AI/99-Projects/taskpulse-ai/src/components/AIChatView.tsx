import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, User, Bot, ArrowLeft, RefreshCw, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Blueprint, ChatMessage } from '../types';
import { USER_AVATAR_1, USER_AVATAR_2 } from '../data/mockData';

interface AIChatViewProps {
  blueprint: Blueprint;
  onBackToBlueprint: () => void;
  initialTopic?: string;
  userAvatarIndex: number;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  blueprint,
  onBackToBlueprint,
  initialTopic,
  userAvatarIndex
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I'm your TaskPulse Co-pilot for "${blueprint.title}". I've analyzed your 4-week timeline, 12 task units, and critical milestones. How can I help you study faster today?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Explain Backpropagation in simple terms',
        'Quiz me on Activation Functions',
        'How do I implement gradient descent?',
        'Give me a 10-minute study summary'
      ]
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAvatarUrl = userAvatarIndex === 0 ? USER_AVATAR_1 : USER_AVATAR_2;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // If we came in with an initial topic from another tab (e.g. "Explain Backpropagation")
  useEffect(() => {
    if (initialTopic) {
      handleSendPrompt(initialTopic);
    }
  }, [initialTopic]);

  const handleSendPrompt = (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate intelligent AI co-pilot response
    setTimeout(() => {
      let aiText = '';
      let suggestions: string[] = [];

      const lower = promptText.toLowerCase();
      if (lower.includes('vanishing') || lower.includes('gradient')) {
        aiText = `**The Vanishing Gradient Problem Explained Simple:**\n\nImagine a long line of people whispering a secret from the end of a hallway to the start. If each person speaks just 10% quieter than the last person, by the 10th person, the whisper is completely gone (zero sound).\n\nIn deep neural networks with **Sigmoid** activation functions, derivatives are at most 0.25. When backpropagation multiplies these small fractions backward through many layers ($0.25 \\times 0.25 \\times 0.25 ...$), the gradient shrinks to zero! Because $\\Delta w = -\\alpha \\cdot \\nabla L$, weights in the early layers stop updating.\n\n**Solution:** We switch to **ReLU** ($f(x) = \\max(0, x)$) which has a derivative of exactly $1.0$ for all positive inputs! No shrinking occurs.`;
        suggestions = ['Quiz me on ReLU vs Sigmoid', 'How does Batch Normalization help?', 'Show me code for gradient descent'];
      } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('flashcard')) {
        aiText = `Let's test your knowledge from your active sprint! Try answering this:\n\n**Question:** Why do we use mini-batch gradient descent instead of standard batch gradient descent on large datasets like MNIST?\n\n*Think about memory requirements and convergence speed, then reply with your answer!*`;
        suggestions = ['Because mini-batch adds stochastic noise to escape local minima', 'Because full batch is too slow to fit in GPU memory', 'Tell me the answer!'];
      } else if (lower.includes('backprop') || lower.includes('chain rule')) {
        aiText = `**Backpropagation Core Concept:**\n\nBackpropagation is literally just applying calculus's **Chain Rule** systematically from output to input.\n\nIf loss $L$ depends on activation $a$, which depends on linear combination $z = wx + b$, then:\n$$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$$\n\nNotice how we calculate error at the end and push it backwards! Would you like me to walk through a numeric 3-layer example?`;
        suggestions = ['Yes, show me a numeric example', 'What is Adam optimizer?', 'Let us go back to Roadmap'];
      } else {
        aiText = `Based on your current progress in **"${blueprint.title}"** (currently at ${blueprint.readinessScore}% readiness), you're doing great on Week 1 and Week 2 core milestones! \n\nMy top recommendation is to focus on **${blueprint.criticalMilestones.find(m => !m.completed)?.title || 'your practice exam'}** next. How can I clarify that topic for you?`;
        suggestions = [
          'Explain the math behind Adam optimizer',
          'Give me an analogy for Dropout regularization',
          'Generate 3 new study flashcards'
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-4 animate-in fade-in duration-300 min-h-[80vh] justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBlueprint}
            className="p-2 rounded-xl hover:bg-surface-container-high transition-colors text-primary"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center relative">
              <Brain className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                <span>TaskPulse Co-pilot</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">AI Assistant</span>
              </h2>
              <p className="text-xs text-on-surface-variant">Context: {blueprint.title}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
          title="Clear chat history"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {msg.sender === 'user' ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-primary shrink-0">
                <img src={currentAvatarUrl} alt="You" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-xs' 
                : 'glass-card bg-white dark:bg-surface-container-lowest text-on-surface rounded-tl-xs border border-outline-variant/60'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text.split('\n\n').map((para, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? 'mt-2.5' : ''}>
                    {para}
                  </p>
                ))}
              </div>

              <div className={`text-[10px] mt-2 flex items-center gap-1 ${
                msg.sender === 'user' ? 'text-white/70 justify-end' : 'text-on-surface-variant'
              }`}>
                <span>{msg.timestamp}</span>
              </div>

              {/* Suggested action pills */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(sug)}
                      className="text-xs font-medium bg-surface-container-low hover:bg-primary/10 hover:text-primary text-on-surface-variant px-3 py-1.5 rounded-xl border border-outline-variant/50 transition-colors text-left flex items-center gap-1"
                    >
                      <Lightbulb className="w-3 h-3 text-secondary shrink-0" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Co-pilot thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
        className="relative ai-glow-focus rounded-2xl bg-white dark:bg-surface-container-lowest border border-outline-variant shadow-sm p-2 flex items-center gap-2 mt-2"
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${blueprint.title} or request study tips...`}
          disabled={isTyping}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className={`p-2.5 rounded-xl transition-all ${
            input.trim() && !isTyping 
              ? 'bg-primary text-white shadow-md hover:scale-105 active:scale-95' 
              : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

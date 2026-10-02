import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  BrainCircuit, 
  Lightbulb, 
  FileText, 
  ArrowRight, 
  HelpCircle,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import type { AIChatMessage } from '../types';

export const AICopilotStudio: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello! I am NOVA CART's AI Turnaround Strategist. I have ingested the 6-month operational performance, the 2,000-customer survey, the 100 partner store interviews, and the ₹25 Lakh budget constraints.

Ask me any strategic question or choose a prompt below to explore how we rescue the business.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Suggested Prompts
  const suggestedPrompts = [
    {
      title: 'Analyze Ghost Inventory Impact',
      prompt: 'Analyze how eliminating Ghost Inventory by 70% directly impacts our monthly EBITDA and customer churn rate.'
    },
    {
      title: 'Reallocate ₹17L Promo Spend',
      prompt: 'Draft an executive policy to reallocate the ₹17 Lakh monthly marketing budget away from wasteful 1st-order discounts into the 3-order retention threshold.'
    },
    {
      title: 'Dark Stores vs Multi-Store Moat',
      prompt: 'How does our Multi-Store Micro-Bundling strategy create a defensible moat against dark stores like Blinkit and Zepto without spending on physical warehouses?'
    },
    {
      title: 'Resolve Executive Management Conflict',
      prompt: 'How should the CEO resolve the conflict between the Marketing Head (+30% budget request) and the Finance Head (quality/cost of growth)?'
    }
  ];

  // The 5 Key Prompt Journey Stages required by PromptWars
  const promptJourneyStages = [
    {
      step: '1. Root Cause Discovery',
      prompt: '“Analyze NOVA CART’s 6-month metrics: Users +46%, Revenue +20%, but Repeat Rate fell 41% → 27%, Cancellations doubled 6% → 11%, and Promo spend jumped 79%. Is this sustainable growth or a death spiral?”',
      insight: 'Identified the classic Leaky Bucket: NOVA CART spends ₹7.5L extra in marketing to gain only ₹4.3L in revenue. Churn is accelerating because 53% of cancellations occur before dispatch.'
    },
    {
      step: '2. The Ghost Stock Hypothesis',
      prompt: '“Why are 35% of cancellations caused by product unavailability when 620 stores are active? Cross-reference with partner store signals.”',
      insight: 'Uncovered that 39% of stores update inventory only once every 1–3 days due to manual POS friction. Shelf reality diverges from app reality, burning high-intent 4★ customers.'
    },
    {
      step: '3. Behavioral Lever Identification',
      prompt: '“Analyze customer behavioral cohorts: 54% complete order 1, only 31% complete order 2, but customers completing 3 orders have 72% repeat retention probability. Where should promotional spend go?”',
      insight: 'Breakthrough: Stop burning money on 1st-order discount tourists. Pivot the entire promotional engine to incentivize Order #2 and Order #3 via Multi-Store Curated Baskets.'
    },
    {
      step: '4. Capital Constraint Optimization',
      prompt: '“Given a hard budget cap of ₹25 Lakh over 6 months and zero warehouse/dark-store expansion, design an operational architecture to cut delivery delays (37m avg).”',
      insight: 'Formulated Multi-Store Micro-Route Bundling: 1 courier batches pickups across adjacent shops within 800m, cutting courier runs by 24% and delivery times to 24 mins.'
    },
    {
      step: '5. End-to-End Product Synthesis',
      prompt: '“Synthesize all findings into a unified digital intervention that solves store inventory, rush hour rejections, multi-store discovery, and instant refund support within ₹25L.”',
      insight: 'Architected Nexus OS: SnapSync 5s AI Bill Scanner + Rush Shield + Neighborhood Multi-Store Basket + 30s UPI Auto-Refund Desk, yielding a 1.5-month financial payback.'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/rescue-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          conversationHistory: messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: AIChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: 'Just now'
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Copilot request failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4" />
              <span>AI Turnaround Intelligence Suite</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Grounded in Gemini 3.8 Flash</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Rescue Copilot & Prompt Journey Studio
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Explore the strategic reasoning that built Nexus OS, or ask live questions to simulate policy trade-offs, 
              budget allocations, and competitive moats against dark-store operators.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Strategy Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all space-y-1.5 group"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
              <span>{p.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {p.prompt}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Live Strategy Dialogue</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Model: gemini-3.8-flash
          </span>
        </div>

        {/* Message Stream */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  AI
                </div>
              )}

              <div
                className={`p-4 rounded-xl max-w-2xl whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  You
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing turnaround economics with Gemini 3.8 Flash...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="pt-2 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything (e.g. How does Rush Shield prevent store churn? What is the 6-month EBITDA turnaround?)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The 5-Stage Prompt Journey Documentation (PromptWars Deliverable #2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            PromptWars Requirement #2: Prompt Journey
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>The 5-Stage Prompt Journey That Unlocked the Solution</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            How we used AI as a rigorous reasoning partner to dismantle assumptions, diagnose ghost inventory, 
            and design Nexus OS within the ₹25 Lakh budget constraint.
          </p>
        </div>

        <div className="space-y-4">
          {promptJourneyStages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-amber-400">
                  {stage.step}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Stage {idx + 1} of 5
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 italic">
                {stage.prompt}
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Crucial Breakthrough: </strong>
                  <span>{stage.insight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

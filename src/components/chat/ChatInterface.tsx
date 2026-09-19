import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Droplets, 
  HeartPulse, 
  Flame, 
  Loader2, 
  Trash2, 
  Sparkles,
  Bot,
  PanelLeftClose,
  Workflow
} from 'lucide-react';
import { ChatMessage, Incident, SupplyHub, Volunteer, AgentExecutionStep } from '../../types';
import { MessageBubble } from './MessageBubble';
import { VoiceControls } from './VoiceControls';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { processMultiAgentDispatch } from '../../core/agents/orchestrator';

interface ChatInterfaceProps {
  incidents: Incident[];
  supplyHubs: SupplyHub[];
  volunteers: Volunteer[];
  onIncidentCreated: (newInc: Incident, updatedHubs?: SupplyHub[], updatedVols?: Volunteer[]) => void;
  onNavigateToMap: (incidentId?: string) => void;
  onToggleCollapse?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  incidents,
  supplyHubs,
  volunteers,
  onIncidentCreated,
  onNavigateToMap,
  onToggleCollapse,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        senderName: 'SynapseAid Field Desk',
        text: '### 👋 Welcome to SynapseAid Crisis Desk\n\nI am listening for civilian distress reports, flood rescue requests, and medical logistics needs.\n\nClick any simulation scenario below or speak using Voice SOS to initiate rapid multi-agent relief coordination.',
        timestamp: 'Desk Active',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentStep, setCurrentAgentStep] = useState<AgentExecutionStep | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('synapse_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const {
    isListening,
    isSpeaking,
    supported,
    currentLang,
    setCurrentLang,
    toggleListening,
    speak,
    stopSpeaking,
  } = useVoiceAssistant((transcript) => {
    setInput(transcript);
    handleSend(transcript);
  });

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isProcessing) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'Field Officer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const result = await processMultiAgentDispatch(
        text,
        incidents,
        supplyHubs,
        volunteers,
        (step) => setCurrentAgentStep(step)
      );

      setMessages(prev => [...prev, result.message]);

      if (result.createdIncident) {
        onIncidentCreated(result.createdIncident, result.updatedHubs, result.updatedVolunteers);
      }

      speak(result.message.text);
    } catch (e) {
      console.error('Multi-agent dispatch error', e);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        senderName: 'SynapseAid Desk',
        text: '⚠️ An issue occurred while routing the request. Emergency manual protocol has been flagged.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsProcessing(false);
      setCurrentAgentStep(null);
    }
  };

  const clearChat = () => {
    if (confirm('Clear field conversation history?')) {
      setMessages([
        {
          id: 'msg-cleared',
          sender: 'assistant',
          senderName: 'SynapseAid Field Desk',
          text: '🔄 Conversation reset. Ready for incoming distress calls and aid dispatches.',
          timestamp: 'Just now',
        },
      ]);
      localStorage.removeItem('synapse_chat_history');
    }
  };

  // Multi-agent Pipeline Stages
  const pipelineStages = [
    { role: 'REPORT', label: 'Distress Signal', icon: '📡' },
    { role: 'TRIAGE', label: 'AI Triage', icon: '🤖' },
    { role: 'ORCHESTRATOR', label: 'RAG Retrieval', icon: '📚' },
    { role: 'LOGISTICS', label: 'Logistics Router', icon: '📦' },
    { role: 'VOLUNTEER', label: 'Volunteer Match', icon: '👥' },
    { role: 'AUDIT', label: 'Relief Dispatch', icon: '🚨' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden">
      
      {/* Header Bar with Collapse Button */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Field Coordination Assistant</h2>
            <p className="text-[11px] text-slate-500">Autonomous Multi-Agent Crisis Triage</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-all"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all hidden lg:flex items-center gap-1 text-xs"
              title="Hide Assistant (Expand Operations Studio)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Multi-Agent Decision Pipeline Stepper */}
      <div className="px-4 py-2 bg-emerald-950 text-white border-b border-emerald-900/40 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[420px] text-[10px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
            <Workflow className="w-3 h-3 text-emerald-400" />
            Pipeline:
          </span>

          <div className="flex items-center justify-between flex-1 gap-1">
            {pipelineStages.map((stage, idx) => {
              const isCurrent = isProcessing && currentAgentStep?.agentRole === stage.role;
              return (
                <div key={idx} className="flex items-center gap-1">
                  <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold ring-2 ring-emerald-300 animate-pulse'
                      : 'bg-emerald-900/60 text-emerald-200'
                  }`}>
                    <span>{stage.icon}</span>
                    <span className="hidden sm:inline font-medium">{stage.label}</span>
                  </div>
                  {idx < pipelineStages.length - 1 && (
                    <span className="text-emerald-700 text-[9px]">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulation Scenario Chips */}
      <div className="px-4 py-2 bg-slate-50/40 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Simulate:
        </span>

        <button
          onClick={() => handleSend('Flash flood levee breach in Riverside Ward 3, 35 families trapped on rooftops, urgently need rescue rafts, chlorine tablets and drinking water.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 shrink-0 text-xs font-medium transition-all shadow-2xs"
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-600" />
          <span>Riverside Flood</span>
        </button>

        <button
          onClick={() => handleSend('Mass casualty tremor collapse at Central Market, 14 casualties with open fractures and severe hemorrhage bleeding, need trauma surgeons and CAT tourniquets immediately.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 shrink-0 text-xs font-medium transition-all shadow-2xs"
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
          <span>Building Collapse</span>
        </button>

        <button
          onClick={() => handleSend('Industrial fire near Sector 4 residential sector, 60 families evacuating due to toxic smoke, urgent shelter tents and thermal blankets required.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 shrink-0 text-xs font-medium transition-all shadow-2xs"
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Shelter Evac</span>
        </button>
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/30">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onSpeak={speak}
            onViewIncidentOnMap={onNavigateToMap}
          />
        ))}

        {/* Real-time Multi-Agent Processing Stepper */}
        {isProcessing && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-md w-full bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold border-b border-emerald-100 pb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>AUTONOMOUS MULTI-AGENT TRIAGE IN PROGRESS</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ACTIVE MESH
                </span>
              </div>

              {currentAgentStep ? (
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800">
                      [{currentAgentStep.agentRole} AGENT]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentAgentStep.durationMs}ms
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold text-xs">{currentAgentStep.actionName}</p>
                  <p className="text-slate-500 text-[11px]">{currentAgentStep.details}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Synthesizing disaster SOP vectors and evaluating optimal resource allocations...
                </p>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Row & Voice SOS */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2">
          
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            supported={supported}
            currentLang={currentLang}
            onToggleListening={toggleListening}
            onStopSpeaking={stopSpeaking}
            onLangChange={setCurrentLang}
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type emergency distress report, casualty count, or supply request..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-50 font-sans"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

    </div>
  );
};

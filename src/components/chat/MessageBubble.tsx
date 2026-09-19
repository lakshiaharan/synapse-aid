import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Clock, 
  Truck, 
  FileCheck, 
  ExternalLink, 
  Volume2, 
  User, 
  ShieldAlert,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
  onViewIncidentOnMap?: (incidentId: string) => void;
}

function formatMarkdownText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    // Check for H3 heading: ### Heading
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-sm font-extrabold text-emerald-900 mt-2 mb-2 pb-1 border-b border-emerald-100 flex items-center gap-1.5">
          {trimmed.replace('### ', '')}
        </h4>
      );
    }

    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
    const cleanLine = isBullet ? trimmed.substring(1).trim() : line;

    // Replace **bold** with <strong>
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5 text-xs sm:text-sm">
          {renderedParts}
        </li>
      );
    }

    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }

    return (
      <p key={idx} className="mb-1 text-slate-700 leading-relaxed text-xs sm:text-sm">
        {renderedParts}
      </p>
    );
  });
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onSpeak,
  onViewIncidentOnMap,
}) => {
  const [showTrace, setShowTrace] = useState(false);
  const [showRAG, setShowRAG] = useState(false);
  const isUser = message.sender === 'user';

  const getSeverityBadge = () => {
    if (!message.severity) return null;
    const badgeClass =
      message.severity === 'CRITICAL'
        ? 'badge-critical'
        : message.severity === 'HIGH'
        ? 'badge-high'
        : message.severity === 'MEDIUM'
        ? 'badge-medium'
        : 'badge-low';

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
        {message.severity} Priority
      </span>
    );
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="max-w-md bg-emerald-800 text-white p-4 rounded-2xl rounded-tr-xs shadow-md">
          <div className="flex items-center justify-between gap-3 text-[11px] text-emerald-200 mb-1 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Field Officer Distress Signal
            </span>
            <span>{message.timestamp}</span>
          </div>
          <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-5 animate-in fade-in slide-in-from-bottom-2">
      <div className="max-w-xl w-full bg-white border border-emerald-900/10 rounded-2xl rounded-tl-xs p-5 shadow-sm">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-2xs">
              🌱
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {message.senderName}
              </span>
              <span className="text-[10px] text-slate-400">Autonomous Crisis Response</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getSeverityBadge()}
            {onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(message.text)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                title="Listen to audio read-out"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <span className="text-[11px] text-slate-400">{message.timestamp}</span>
          </div>
        </div>

        {/* Formatted Structured Markdown Body */}
        <div className="text-sm text-slate-700 leading-relaxed font-sans mb-3.5 space-y-0.5">
          {formatMarkdownText(message.text)}
        </div>

        {/* Dispatch Action Manifest Card */}
        {message.dispatchPayload && (
          <div className="mb-3.5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2.5">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                Relief Dispatch Allocation #{message.dispatchPayload.incidentId}
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                ETA: {message.dispatchPayload.etaMinutes} mins
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-3">
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">ALLOCATED RELIEF ITEMS:</span>
                <ul className="space-y-1 text-xs">
                  {message.dispatchPayload.allocatedSupplies.map((s, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-slate-700">{s.item}</span>
                      <span className="font-bold text-emerald-700">+{s.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">DEPLOYED VOLUNTEERS:</span>
                <p className="text-xs text-purple-700 font-semibold">
                  {message.dispatchPayload.matchedVolunteerIds.length} Verified Field Volunteers
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Auth Cryptographic Sign</span>
                </div>
              </div>
            </div>

            {onViewIncidentOnMap && (
              <button
                type="button"
                onClick={() => onViewIncidentOnMap(message.dispatchPayload!.incidentId)}
                className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Focus Incident on Operations GIS Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Collapsible Drawers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {message.ragSources && message.ragSources.length > 0 && (
            <button
              type="button"
              onClick={() => setShowRAG(!showRAG)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-emerald-800 border border-slate-200 font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>{message.ragSources.length} Aid Protocols Referenced</span>
              {showRAG ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {message.executionTrace && message.executionTrace.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 font-medium transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Multi-Agent Trace ({message.executionTrace.length})</span>
              {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Expanded RAG Context */}
        {showRAG && message.ragSources && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-emerald-100 space-y-2 text-xs animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Retrieved Crisis SOP Guidance (Dense Vector Match):
              </span>
            </div>
            {message.ragSources.map((src, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-bold">{src.docTitle}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {Math.round(src.similarityScore * 100)}% Sim
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{src.excerpt.slice(0, 180)}..."
                </p>
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Why matched:</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disaster SOP
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Emergency Triage
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expanded Agent Execution Trace */}
        {showTrace && message.executionTrace && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in">
            <span className="text-[11px] font-bold text-slate-700 block uppercase">
              Multi-Agent Orchestration Log:
            </span>
            {message.executionTrace.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-white border border-slate-200">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {step.agentRole}
                </span>
                <div className="flex-1">
                  <span className="text-slate-800 font-semibold">{step.actionName}</span>
                  <p className="text-slate-500 mt-0.5 text-[11px]">{step.details}</p>
                </div>
                <span className="text-slate-400 text-[10px] font-mono">{step.durationMs}ms</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

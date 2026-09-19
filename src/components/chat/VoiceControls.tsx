import React from 'react';
import { Mic, Volume2, Globe } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  supported: boolean;
  currentLang: string;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
  onLangChange: (lang: string) => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  supported,
  currentLang,
  onToggleListening,
  onStopSpeaking,
  onLangChange,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      
      {/* Language Selector */}
      <div className="relative flex items-center">
        <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
        <select
          value={currentLang}
          onChange={e => onLangChange(e.target.value)}
          className="pl-7 pr-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs outline-none focus:border-emerald-600 cursor-pointer font-medium"
        >
          <option value="en-US">EN (US)</option>
          <option value="en-IN">EN (IN)</option>
          <option value="hi-IN">हिन्दी</option>
          <option value="es-ES">ES</option>
          <option value="fr-FR">FR</option>
        </select>
      </div>

      {/* Audio Playback Stop Button */}
      {isSpeaking && (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold animate-pulse"
          title="Stop Audio Speech"
        >
          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          <span>Speaking...</span>
        </button>
      )}

      {/* Speech-to-Text Microphone Toggle */}
      {supported && (
        <button
          type="button"
          onClick={onToggleListening}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
          }`}
          title={isListening ? 'Listening for voice SOS...' : 'Click to Speak SOS'}
        >
          {isListening ? (
            <>
              <Mic className="w-3.5 h-3.5 animate-spin" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Voice SOS</span>
            </>
          )}
        </button>
      )}

    </div>
  );
};

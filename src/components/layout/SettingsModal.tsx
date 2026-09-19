import React, { useState } from 'react';
import { X, Cpu, Key, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { LLMConfig, getStoredLLMConfig, saveStoredLLMConfig } from '../../core/llmProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  const [config, setConfig] = useState<LLMConfig>(getStoredLLMConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredLLMConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg aid-card border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              System & AI Engine Settings
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* LLM Engine Selection */}
          <div>
            <label className="block text-slate-200 font-semibold mb-2 flex items-center gap-2 text-xs">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Reasoning & Triage Engine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: 'built-in' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  config.provider === 'built-in'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between text-xs">
                  <span>Built-in Heuristic Core</span>
                  {config.provider === 'built-in' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Fast deterministic triage, 100% offline with zero external API requirements.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: 'gemini' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  config.provider === 'gemini'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between text-xs">
                  <span>Google Gemini Flash</span>
                  {config.provider === 'gemini' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Connect live Gemini 1.5 Flash for natural conversational summaries.
                </p>
              </button>
            </div>
          </div>

          {/* API Key Input (if Gemini selected) */}
          {config.provider === 'gemini' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="Enter AIzaSy..."
                value={config.apiKey || ''}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-400 text-xs"
              />
              <p className="text-[11px] text-slate-400">
                Key is stored strictly inside your local browser storage.
              </p>
            </div>
          )}

          {/* Data Reset */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-slate-200 font-semibold mb-2 flex items-center gap-1.5 text-xs">
              <Database className="w-4 h-4 text-rose-400" />
              Reset Local Session State
            </label>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20">
              <div>
                <p className="text-slate-200 font-medium text-xs">Restore Default Data</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Resets all simulated incidents, relief hubs, and volunteers.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all field records and restore demo state?')) {
                    onResetData();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Local Storage</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

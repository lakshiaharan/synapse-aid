import React from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  BarChart2, 
  Users, 
  BookOpen, 
  Sliders, 
  FileText, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { SystemMetrics } from '../../types';

interface NavbarProps {
  activeRightTab: 'map' | 'analytics' | 'volunteers' | 'knowledge';
  setActiveRightTab: (tab: 'map' | 'analytics' | 'volunteers' | 'knowledge') => void;
  metrics: SystemMetrics;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRightTab,
  setActiveRightTab,
  metrics,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenReportModal,
}) => {
  return (
    <header className="border-b border-emerald-900/10 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-700/20 text-white">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Synapse<span className="text-emerald-600">Aid</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live Desk
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Community Humanitarian Relief & Resource Network
            </p>
          </div>
        </div>

        {/* Right Studio Navigation Pill Selector */}
        <div className="hidden md:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveRightTab('map')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'map'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Relief Map</span>
            {metrics.activeIncidents > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold">
                {metrics.activeIncidents}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRightTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'analytics'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Supplies & Metrics</span>
          </button>

          <button
            onClick={() => setActiveRightTab('volunteers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'volunteers'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Volunteers</span>
          </button>

          <button
            onClick={() => setActiveRightTab('knowledge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'knowledge'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Aid Protocols</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-all"
            title="Search actions (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 shadow-2xs">⌘K</kbd>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
            title="Download Mission Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export PDF</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all"
            title="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, Flame, Droplets, HeartPulse, Radio, BookOpen, MapPin, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionType: string, payload?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('TOGGLE_PALETTE');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'sim-flood',
      category: 'Crisis Simulation',
      icon: Droplets,
      title: 'Riverside Levee Breach & Flash Flood',
      desc: 'Simulates 35 stranded individuals, auto-allocates rescue boats and water purification kits',
      color: 'text-cyan-400',
      action: () => onSelectAction('SIMULATE', 'Major levee breach in Riverside Ward 3, 35 residents stranded on rooftops, urgently need rescue boats, drinking water and blankets.')
    },
    {
      id: 'sim-trauma',
      category: 'Crisis Simulation',
      icon: HeartPulse,
      title: 'Building Structural Collapse & Trauma',
      desc: 'Simulates trapped casualties with severe hemorrhage bleeding and open limb fractures',
      color: 'text-rose-400',
      action: () => onSelectAction('SIMULATE', 'Structural collapse at Old Market Colony, 12 casualties trapped, severe hemorrhages and trauma bleeding, need surgical tourniquets and trauma medics.')
    },
    {
      id: 'sim-fire',
      category: 'Crisis Simulation',
      icon: Flame,
      title: 'Industrial Fire & Community Evacuation',
      desc: 'Simulates toxic smoke hazard, 60 families requiring emergency shelter and burn packs',
      color: 'text-amber-400',
      action: () => onSelectAction('SIMULATE', 'Chemical storage fire spreading to Sector 4 residential zone, 80 families evacuating, need emergency family tents, rations and burn dressings.')
    },
    {
      id: 'nav-map',
      category: 'Navigation',
      icon: MapPin,
      title: 'Open Tactical Operations Map',
      desc: 'View live incident coordinates, forward supply bases, and volunteer routes',
      color: 'text-indigo-400',
      action: () => onSelectAction('NAVIGATE', 'map')
    },
    {
      id: 'nav-knowledge',
      category: 'Navigation',
      icon: BookOpen,
      title: 'Open Aid Protocol Studio (RAG)',
      desc: 'Search FEMA/WHO emergency guidelines and inspect vector similarity scores',
      color: 'text-purple-400',
      action: () => onSelectAction('NAVIGATE', 'knowledge')
    },
    {
      id: 'action-sos',
      category: 'Operations',
      icon: Radio,
      title: 'Broadcast Emergency Alert via Radio Mesh',
      desc: 'Pings active field volunteers and forward logistics hubs',
      color: 'text-emerald-400',
      action: () => onSelectAction('BROADCAST_SOS')
    }
  ];

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl aid-card border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search simulations, emergency protocols, or navigation..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2.5 divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching actions or simulations found.
            </div>
          ) : (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-start gap-3.5 p-3 rounded-xl text-left hover:bg-slate-800/60 transition-all group"
                >
                  <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 ${cmd.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {cmd.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                        {cmd.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {cmd.desc}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Navigate with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↓</kbd></span>
          <span>Close with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd></span>
        </div>

      </div>
    </div>
  );
};

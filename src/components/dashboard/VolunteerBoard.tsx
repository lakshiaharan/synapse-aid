import React, { useState } from 'react';
import { Star, Award, Phone, MapPin, Zap, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { Volunteer, Incident } from '../../types';
import { runVolunteerMatching, computeVolunteerMatchScore } from '../../core/agents/volunteerAgent';
import confetti from 'canvas-confetti';

interface VolunteerBoardProps {
  volunteers: Volunteer[];
  incidents: Incident[];
  onUpdateVolunteerStatus: (id: string, status: Volunteer['status']) => void;
}

export const VolunteerBoard: React.FC<VolunteerBoardProps> = ({
  volunteers,
  incidents,
  onUpdateVolunteerStatus,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const handleRunMatchmaker = () => {
    if (!selectedIncident) return;

    const result = runVolunteerMatching(selectedIncident.category, selectedIncident.coords, volunteers);
    setMatchResult(result.rationale);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#f43f5e', '#14b8a6'],
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* 1. Compact Matching Controls Header */}
      <div className="p-4 aid-card border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Gale-Shapley Volunteer Matching Engine
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Matches field responders based on role affinity, proximity distance matrix, and past mission performance.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedIncidentId}
              onChange={e => setSelectedIncidentId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500 flex-1 sm:flex-initial"
            >
              {activeIncidents.map(inc => (
                <option key={inc.id} value={inc.id}>
                  [{inc.severity}] {inc.title.slice(0, 30)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleRunMatchmaker}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Run Match ⚡</span>
            </button>
          </div>
        </div>

        {matchResult && (
          <div className="mt-3 p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{matchResult}</span>
          </div>
        )}
      </div>

      {/* 2. Volunteers Grid with AI Match Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {volunteers.map(vol => {
          const isDeployed = vol.status === 'DEPLOYED';
          const matchScore = selectedIncident ? computeVolunteerMatchScore(vol, selectedIncident) : 85;

          const getScoreColor = (score: number) => {
            if (score >= 90) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
            if (score >= 80) return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
            return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
          };

          return (
            <div
              key={vol.id}
              className="p-4 sm:p-5 aid-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3.5"
            >
              <div>
                {/* Card Top: Avatar, Name, and Status */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isDeployed ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {vol.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{vol.name}</h3>
                      <span className="text-xs text-indigo-400 font-medium">{vol.role}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isDeployed ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {vol.status}
                  </span>
                </div>

                {/* AI Match Score Progress Bar */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-indigo-400" />
                      AI MATCH SCORE
                    </span>
                    <span className={`px-2 py-0.2 rounded font-extrabold text-xs border ${getScoreColor(matchScore)}`}>
                      ⭐ {matchScore}% Match
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${matchScore}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        matchScore >= 90
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : matchScore >= 80
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Skills Tags with Checkmarks */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {vol.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1">
                      <span>{skill}</span>
                      <span className="text-emerald-400 text-[10px]">✓</span>
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{vol.rating.toFixed(2)} Rating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{vol.missionsCompleted} Missions</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 text-xs text-slate-400 truncate mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{vol.locationName}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span className="text-[11px]">{vol.phone}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateVolunteerStatus(vol.id, isDeployed ? 'AVAILABLE' : 'DEPLOYED')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    isDeployed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {isDeployed ? 'Recall to Base' : 'Deploy'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

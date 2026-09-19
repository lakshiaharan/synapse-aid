import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  HeartHandshake,
  Tent,
  Navigation,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { Incident, SupplyHub, Volunteer, IncidentStatus, SeverityLevel } from '../../types';
import { INITIAL_SHELTERS } from '../../data/mockSupplies';

interface LiveMapProps {
  incidents: Incident[];
  supplyHubs: SupplyHub[];
  volunteers: Volunteer[];
  selectedIncidentId?: string | null;
  onUpdateIncidentStatus: (id: string, newStatus: IncidentStatus) => void;
  onSelectIncident: (id: string | null) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  incidents,
  supplyHubs,
  volunteers,
  selectedIncidentId,
  onUpdateIncidentStatus,
  onSelectIncident,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showDepots, setShowDepots] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [hoveredPin, setHoveredPin] = useState<{ id: string; type: string; title: string; subtitle: string; score?: number } | null>(null);

  // If selectedIncidentId is passed or default to first active incident if none selected
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || (incidents.length > 0 ? incidents[0] : null);

  const filteredIncidents = incidents.filter(inc => {
    if (filterCategory === 'ALL') return true;
    return inc.category === filterCategory;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">🔴 CRITICAL PRIORITY</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🟠 HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">🟡 MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🟢 LOW</span>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 RESOLVED</span>;
      case 'DISPATCHED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">🔵 DISPATCHED</span>;
      case 'TRIAGED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">🟣 TRIAGED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">🟡 ACTIVE REPORT</span>;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col overflow-hidden select-none">
      
      {/* 1. Header Bar: GIS Operations & Layer Controls */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
        
        {/* Left: GIS Title & Incident Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 rounded-xl">
            <HeartHandshake className="w-4 h-4 text-indigo-400" />
            <span>Operations GIS</span>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Incident Category Filters */}
          <div className="flex items-center gap-1">
            {['ALL', 'FLOOD', 'MEDICAL', 'RESCUE', 'SUPPLY', 'SHELTER'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Layer Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] text-slate-500 font-bold px-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            LAYERS:
          </span>

          <button
            onClick={() => setShowDepots(!showDepots)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              showDepots ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Hubs ({supplyHubs.length})
          </button>

          <button
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              showVolunteers ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Responders ({volunteers.length})
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              showShelters ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Shelters ({INITIAL_SHELTERS.length})
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              showRoutes ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Routes
          </button>

          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              showZones ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Flood Zones
          </button>
        </div>

      </div>

      {/* 2. Interactive Map Container (Bounded, overflow: hidden, isolated relative stacking) */}
      <div className="relative flex-1 w-full bg-[#0a0f1d] overflow-hidden min-h-[340px]">
        
        {/* District Watermarks & Sector Boundaries (SVG Layer) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            {/* Grid Pattern */}
            <pattern id="gisGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeOpacity="0.6" />
              <circle cx="60" cy="60" r="1.5" fill="#334155" opacity="0.4" />
            </pattern>

            {/* Flood Inundation Gradient */}
            <linearGradient id="floodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.15" />
            </linearGradient>

            {/* Route Gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#gisGrid)" />

          {/* Sector Boundary Lines */}
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#334155" strokeWidth="1" strokeDasharray="8 6" strokeOpacity="0.4" />
          <line x1="0%" y1="52%" x2="100%" y2="52%" stroke="#334155" strokeWidth="1" strokeDasharray="8 6" strokeOpacity="0.4" />

          {/* District Sector Watermark Labels */}
          <text x="5%" y="8%" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1.5" opacity="0.6">
            SECTOR ALPHA — NORTH INDUSTRIAL & LOGISTICS
          </text>
          <text x="55%" y="8%" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1.5" opacity="0.6">
            SECTOR GAMMA — EAST RIDGE HIGHLAND LZ
          </text>
          <text x="5%" y="60%" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1.5" opacity="0.6">
            SECTOR DELTA — WEST RESIDENTIAL & SHELTERS
          </text>
          <text x="55%" y="60%" fill="#0284c7" fontSize="11" fontWeight="700" letterSpacing="1.5" opacity="0.7">
            SECTOR BRAVO — RIVERBANK BASIN (INUNDATION RISK)
          </text>

          {/* Flood Inundation Zone Polygon */}
          {showZones && (
            <g>
              <path
                d="M 380,180 Q 520,140 700,200 T 1100,240 L 1100,600 L 350,600 Z"
                fill="url(#floodGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />
              <path
                d="M 420,240 Q 580,210 760,270 T 1050,300"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.5"
              />
            </g>
          )}

          {/* Road / Deployment Route Vectors */}
          {showRoutes &&
            incidents.map(inc => {
              if (!inc.assignedHubId) return null;
              const hub = supplyHubs.find(h => h.id === inc.assignedHubId);
              if (!hub) return null;

              return (
                <g key={`route-${inc.id}`}>
                  {/* Route Glow */}
                  <line
                    x1={`${hub.coords.x}%`}
                    y1={`${hub.coords.y}%`}
                    x2={`${inc.coords.x}%`}
                    y2={`${inc.coords.y}%`}
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeOpacity="0.2"
                  />
                  {/* Route Dash Vector */}
                  <line
                    x1={`${hub.coords.x}%`}
                    y1={`${hub.coords.y}%`}
                    x2={`${inc.coords.x}%`}
                    y2={`${inc.coords.y}%`}
                    stroke="url(#routeGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  {/* Midpoint Arrow Indicator */}
                  <circle
                    cx={`${(hub.coords.x + inc.coords.x) / 2}%`}
                    cy={`${(hub.coords.y + inc.coords.y) / 2}%`}
                    r="4"
                    fill="#38bdf8"
                  />
                </g>
              );
            })}
        </svg>

        {/* 3. Interactive Map Pins Layer */}

        {/* Safe Shelters (🟢 Green) */}
        {showShelters &&
          INITIAL_SHELTERS.map(shelter => (
            <div
              key={shelter.id}
              style={{ left: `${shelter.coords.x}%`, top: `${shelter.coords.y}%` }}
              onMouseEnter={() =>
                setHoveredPin({
                  id: shelter.id,
                  type: 'Safe Shelter',
                  title: shelter.name,
                  subtitle: `Cap: ${shelter.occupancy}/${shelter.capacity} (${shelter.status}) • Emergency Contact: ${shelter.contact}`,
                })
              }
              onMouseLeave={() => setHoveredPin(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 shadow-lg group-hover:scale-125 transition-transform flex items-center justify-center">
                <Tent className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

        {/* Supply Hubs (🔵 Cyan) */}
        {showDepots &&
          supplyHubs.map(hub => (
            <div
              key={hub.id}
              style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
              onMouseEnter={() =>
                setHoveredPin({
                  id: hub.id,
                  type: 'Tactical Supply Hub',
                  title: hub.name,
                  subtitle: `Radio: ${hub.contactFreq} • Lead: ${hub.leadResponder} • Status: ${hub.status}`,
                })
              }
              onMouseLeave={() => setHoveredPin(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/60 text-cyan-300 shadow-lg group-hover:scale-125 transition-transform flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

        {/* Volunteers / Responders (🟣 Purple) */}
        {showVolunteers &&
          volunteers.map(vol => {
            const isDeployed = vol.status === 'DEPLOYED';
            return (
              <div
                key={vol.id}
                style={{ left: `${vol.coords.x}%`, top: `${vol.coords.y}%` }}
                onMouseEnter={() =>
                  setHoveredPin({
                    id: vol.id,
                    type: 'Field Responder',
                    title: `${vol.name} (${vol.role})`,
                    subtitle: `Rating: ⭐ ${vol.rating.toFixed(2)} • Status: ${vol.status} • Phone: ${vol.phone}`,
                  })
                }
                onMouseLeave={() => setHoveredPin(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                <div
                  className={`p-1.5 rounded-full border text-white shadow-md group-hover:scale-125 transition-transform flex items-center justify-center ${
                    isDeployed
                      ? 'bg-purple-600 border-purple-300 ring-4 ring-purple-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                </div>
              </div>
            );
          })}

        {/* Incidents (🔴 Critical / 🟠 High / 🟡 Medium) */}
        {filteredIncidents.map(inc => {
          const isSelected = selectedIncident?.id === inc.id;
          const isCritical = inc.severity === 'CRITICAL';
          const isResolved = inc.status === 'RESOLVED';

          const pinClass = isResolved
            ? 'bg-slate-800 border-slate-600 text-slate-400'
            : isCritical
            ? 'bg-rose-600 border-rose-300 text-white ring-4 ring-rose-500/30 shadow-rose-600/50'
            : inc.severity === 'HIGH'
            ? 'bg-amber-600 border-amber-300 text-white ring-4 ring-amber-500/30 shadow-amber-600/50'
            : 'bg-indigo-600 border-indigo-300 text-white ring-4 ring-indigo-500/30 shadow-indigo-600/50';

          return (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              onMouseEnter={() =>
                setHoveredPin({
                  id: inc.id,
                  type: `Incident (${inc.severity})`,
                  title: inc.title,
                  subtitle: `${inc.locationName} • Urgency: ${inc.urgencyScore} PTS • Status: ${inc.status}`,
                  score: inc.urgencyScore,
                })
              }
              onMouseLeave={() => setHoveredPin(null)}
              style={{ left: `${inc.coords.x}%`, top: `${inc.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-115'
              }`}
            >
              {/* Pulsing Beacon for Critical Active Incidents */}
              {!isResolved && isCritical && (
                <div className="absolute inset-0 -m-2.5 rounded-full bg-rose-500/40 animate-ping pointer-events-none" />
              )}

              <div
                className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shadow-xl ${pinClass} ${
                  isSelected ? 'border-2 border-white ring-4 ring-white/40' : ''
                }`}
              >
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* Hover Popover Tooltip (Pinned at Top-Center to avoid clipping) */}
        {hoveredPin && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 py-2 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in flex items-center gap-3 max-w-lg">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">{hoveredPin.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold uppercase">
                  {hoveredPin.type}
                </span>
                {hoveredPin.score && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 font-bold">
                    {hoveredPin.score} PTS
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{hoveredPin.subtitle}</p>
            </div>
          </div>
        )}

        {/* 4. Map Legend (Clean, compact glass card at bottom-left corner of the map) */}
        <div className="absolute bottom-3 left-3 z-30 px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-md shadow-xl text-xs flex flex-wrap items-center gap-x-4 gap-y-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="text-slate-300 text-[11px]">Critical Incident</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
            <span className="text-slate-300 text-[11px]">Active Emergency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">Safe Shelter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
            <span className="text-slate-300 text-[11px]">Supply Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-300 text-[11px]">Responder</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-400" />
            <span className="text-slate-300 text-[11px]">Deployment Route</span>
          </div>
        </div>

      </div>

      {/* 3. Dedicated Selected Incident Operations Panel (Non-overlapping, in-flow flex container below map) */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 z-20">
        {selectedIncident ? (
          <div className="max-w-6xl mx-auto space-y-3">
            
            {/* Header: Title, Badges, and Incident Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                  Selected Incident:
                </span>
                <h3 className="text-sm font-bold text-white">
                  {selectedIncident.title}
                </h3>
                <span className="text-xs text-slate-400">
                  • {selectedIncident.locationName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {getSeverityBadge(selectedIncident.severity)}
                {getStatusBadge(selectedIncident.status)}
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  #{selectedIncident.id}
                </span>
              </div>
            </div>

            {/* Description & Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              
              {/* Situation Brief */}
              <div className="md:col-span-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                  SITUATION BRIEF & CIVILIAN REPORT
                </span>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Urgency & Affected Count */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">AFFECTED</span>
                  <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    {selectedIncident.affectedPeople} People
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">TRIAGE SCORE</span>
                  <span className="text-sm font-bold text-amber-400">
                    {selectedIncident.urgencyScore} / 100
                  </span>
                </div>
              </div>

              {/* Assigned Responders */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">DEPLOYED RESPONDERS</span>
                {selectedIncident.assignedVolunteerIds.length === 0 ? (
                  <p className="text-xs text-amber-400 font-medium">Awaiting volunteer dispatch</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedIncident.assignedVolunteerIds.map(vid => {
                      const vol = volunteers.find(v => v.id === vid);
                      return (
                        <span key={vid} className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-semibold">
                          {vol ? `${vol.name.split(' ')[0]} (${vol.role})` : vid}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Switch Incident:</span>
                <div className="flex items-center gap-1">
                  {incidents.slice(0, 4).map(inc => (
                    <button
                      key={inc.id}
                      onClick={() => onSelectIncident(inc.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                        selectedIncident.id === inc.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {inc.category} #{inc.id.slice(-3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {selectedIncident.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => onUpdateIncidentStatus(selectedIncident.id, 'RESOLVED')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Relief Mission Complete
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateIncidentStatus(selectedIncident.id, 'DISPATCHED')}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
                  >
                    Re-Open Active Case
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-400">
            Click any incident marker or tactical depot on the map above to inspect live telemetry and dispatch controls.
          </div>
        )}
      </div>

    </div>
  );
};

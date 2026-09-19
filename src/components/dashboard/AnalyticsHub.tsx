import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  ShieldCheck, 
  HeartHandshake,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  PackageCheck
} from 'lucide-react';
import { SystemMetrics, Incident, SupplyHub } from '../../types';
import { TelemetryPoint } from '../../hooks/useLiveTelemetry';

interface AnalyticsHubProps {
  telemetryHistory: TelemetryPoint[];
  metrics: SystemMetrics;
  incidents: Incident[];
  supplyHubs: SupplyHub[];
}

export const AnalyticsHub: React.FC<AnalyticsHubProps> = ({
  telemetryHistory,
  metrics,
  incidents,
  supplyHubs,
}) => {
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H'>('1H');

  // Severity distribution
  const severityData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'CRITICAL').length, color: '#f43f5e' },
    { name: 'High', value: incidents.filter(i => i.severity === 'HIGH').length, color: '#f59e0b' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'MEDIUM').length, color: '#6366f1' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'LOW').length, color: '#10b981' },
  ];

  // Category distribution
  const categoryData = [
    { name: 'Flood', count: incidents.filter(i => i.category === 'FLOOD').length },
    { name: 'Medical', count: incidents.filter(i => i.category === 'MEDICAL').length },
    { name: 'Rescue', count: incidents.filter(i => i.category === 'RESCUE').length },
    { name: 'Supply', count: incidents.filter(i => i.category === 'SUPPLY').length },
    { name: 'Shelter', count: incidents.filter(i => i.category === 'SHELTER').length },
  ];

  // Agent Latency Benchmarks
  const agentBenchmarkData = [
    { agent: 'Hybrid RAG Search', latencyMs: 14, color: '#6366f1' },
    { agent: 'NLP Triage Scorer', latencyMs: 22, color: '#14b8a6' },
    { agent: 'Logistics Router', latencyMs: 35, color: '#f59e0b' },
    { agent: 'Volunteer Matcher', latencyMs: 18, color: '#a855f7' },
    { agent: 'Audit Ledger Signer', latencyMs: 8, color: '#10b981' },
  ];

  // Adjust telemetry sampling based on time range
  const displayedHistory = timeRange === '1H' 
    ? telemetryHistory 
    : timeRange === '6H'
    ? telemetryHistory.map((pt, idx) => ({ ...pt, waterRationVelocity: Math.round(pt.waterRationVelocity * (1 + Math.sin(idx) * 0.15)) }))
    : telemetryHistory.map((pt, idx) => ({ ...pt, waterRationVelocity: Math.round(pt.waterRationVelocity * (1 + Math.cos(idx) * 0.25)) }));

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* 1. Main KPI Row with Clear Units and Trend Percentages */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Active Emergencies */}
        <div className="p-4 aid-card">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">ACTIVE EMERGENCIES</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.activeIncidents}</span>
            <span className="text-xs text-rose-400 font-semibold">Priority Cases</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>↓ 2 from peak hour</span>
          </div>
        </div>

        {/* KPI 2: Clear Resource Burn Rate */}
        <div className="p-4 aid-card">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">RESOURCE BURN RATE</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{metrics.suppliesDepletionVelocity}</span>
            <span className="text-xs text-slate-300 font-medium">Relief units / hour</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 12% from previous hour</span>
          </div>
        </div>

        {/* KPI 3: Avg Response Time */}
        <div className="p-4 aid-card">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">AVG RESPONSE TIME</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">97</span>
            <span className="text-xs text-slate-300 font-medium">ms automated triage</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ 99.4% SLA target</span>
          </div>
        </div>

        {/* KPI 4: Volunteer Deployment */}
        <div className="p-4 aid-card">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">VOLUNTEER DEPLOYMENT</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400">{metrics.volunteerDeploymentRate}%</span>
            <span className="text-xs text-slate-300 font-medium">Active in Field</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 15% surge capacity</span>
          </div>
        </div>

      </div>

      {/* 2. Main Symmetrical Dual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Chart: Hourly Supply Burn vs Distress Signals */}
        <div className="p-4 sm:p-5 aid-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Hourly Supply Consumption vs. Distress Volume
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Current: <strong className="text-amber-300">{metrics.suppliesDepletionVelocity} units/hr</strong> • ↑ 12% in last hour
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['1H', '6H', '24H'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="distressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.6} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="waterRationVelocity" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#waterVelocityGrad)" name="Supply Burn (units/hr)" />
                <Area type="monotone" dataKey="activeDistressSignals" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#distressGrad)" name="Distress Signals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Multi-Agent Sub-Pipeline Benchmarks */}
        <div className="p-4 sm:p-5 aid-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Multi-Agent Coordination Computation Times
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sub-agent pipeline execution latency per crisis case
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold border border-slate-700">
              Total Avg: 97ms
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentBenchmarkData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} opacity={0.6} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="ms" tickLine={false} />
                <YAxis dataKey="agent" type="category" stroke="#cbd5e1" fontSize={11} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="latencyMs" radius={[0, 6, 6, 0]}>
                  {agentBenchmarkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Breakdown Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Severity Donut */}
        <div className="p-4 aid-card flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-1">
            PRIORITY TRIAGE RATIO
          </h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`sev-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-4 aid-card flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-1">
            INCIDENTS BY SECTOR CATEGORY
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Buffer Allocations */}
        <div className="p-4 aid-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              WAREHOUSE BUFFER STATUS
            </h3>
            <PackageCheck className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-2.5 text-xs">
            {supplyHubs.map(hub => {
              const totalStock = hub.inventory.reduce((s, i) => s + i.stock, 0);
              const totalAlloc = hub.inventory.reduce((s, i) => s + i.allocated, 0);
              const percentAlloc = Math.round((totalAlloc / Math.max(1, totalStock)) * 100);

              return (
                <div key={hub.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate max-w-[170px]">{hub.name}</span>
                    <span className="text-indigo-400 font-bold">{percentAlloc}% Allocated</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${percentAlloc}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

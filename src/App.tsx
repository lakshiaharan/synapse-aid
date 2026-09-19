import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { SettingsModal } from './components/layout/SettingsModal';
import { DispatchReportModal } from './components/reports/DispatchReportModal';
import { ChatInterface } from './components/chat/ChatInterface';
import { LiveMap } from './components/dashboard/LiveMap';
import { AnalyticsHub } from './components/dashboard/AnalyticsHub';
import { VolunteerBoard } from './components/dashboard/VolunteerBoard';
import { KnowledgeStudio } from './components/knowledge/KnowledgeStudio';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { Incident, SupplyHub, Volunteer, IncidentStatus } from './types';
import { Bot, PanelLeftOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeRightTab, setActiveRightTab] = useState<'map' | 'analytics' | 'volunteers' | 'knowledge'>('map');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);

  const {
    incidents,
    setIncidents,
    supplyHubs,
    setSupplyHubs,
    volunteers,
    setVolunteers,
    telemetryHistory,
    metrics,
    resetToDefault,
  } = useLiveTelemetry();

  // Handle new incident creation from agentic chat
  const handleIncidentCreated = (
    newInc: Incident,
    updatedHubs?: SupplyHub[],
    updatedVols?: Volunteer[]
  ) => {
    setIncidents(prev => [newInc, ...prev]);
    if (updatedHubs) setSupplyHubs(updatedHubs);
    if (updatedVols) setVolunteers(updatedVols);

    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#15803d', '#ea580c', '#4f46e5'],
    });
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
  };

  const handleUpdateVolunteerStatus = (id: string, status: Volunteer['status']) => {
    setVolunteers(prev =>
      prev.map(vol => (vol.id === id ? { ...vol, status } : vol))
    );
  };

  const handleCommandAction = (actionType: string, payload?: string) => {
    if (actionType === 'TOGGLE_PALETTE') {
      setIsCommandPaletteOpen(prev => !prev);
    } else if (actionType === 'NAVIGATE' && payload) {
      setActiveRightTab(payload as typeof activeRightTab);
    } else if (actionType === 'BROADCAST_SOS') {
      alert('🚨 Emergency broadcast transmitted across all local volunteer channels.');
    }
  };

  const handleNavigateToMap = (incidentId?: string) => {
    if (incidentId) setFocusedIncidentId(incidentId);
    setActiveRightTab('map');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeRightTab={activeRightTab}
        setActiveRightTab={setActiveRightTab}
        metrics={metrics}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Left Column: Field Coordination Desk */}
        {!isAssistantCollapsed ? (
          <section className="w-full lg:w-[42%] h-[580px] lg:h-[calc(100vh-95px)] shrink-0 transition-all duration-300">
            <ChatInterface
              incidents={incidents}
              supplyHubs={supplyHubs}
              volunteers={volunteers}
              onIncidentCreated={handleIncidentCreated}
              onNavigateToMap={handleNavigateToMap}
              onToggleCollapse={() => setIsAssistantCollapsed(true)}
            />
          </section>
        ) : (
          /* Collapsed Floating Trigger for Assistant */
          <div className="hidden lg:flex flex-col items-center justify-start pt-3 shrink-0">
            <button
              onClick={() => setIsAssistantCollapsed(false)}
              className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg transition-all flex flex-col items-center gap-2 group"
              title="Show Field Assistant"
            >
              <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <PanelLeftOpen className="w-4 h-4 text-emerald-200" />
              <span className="text-[10px] font-bold tracking-wider [writing-mode:vertical-lr] rotate-180 text-emerald-100 uppercase mt-1">
                Assistant
              </span>
            </button>
          </div>
        )}

        {/* Right Column: Interactive Operations Studio */}
        <section className={`flex-1 h-[620px] lg:h-[calc(100vh-95px)] bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
          isAssistantCollapsed ? 'w-full' : ''
        }`}>
          
          {/* Mobile Tab Bar */}
          <div className="flex md:hidden items-center justify-around border-b border-slate-100 p-2 bg-slate-50">
            <button
              onClick={() => setActiveRightTab('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                activeRightTab === 'map' ? 'bg-emerald-700 text-white' : 'text-slate-600'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setActiveRightTab('analytics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                activeRightTab === 'analytics' ? 'bg-emerald-700 text-white' : 'text-slate-600'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveRightTab('volunteers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                activeRightTab === 'volunteers' ? 'bg-emerald-700 text-white' : 'text-slate-600'
              }`}
            >
              Volunteers
            </button>
            <button
              onClick={() => setActiveRightTab('knowledge')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                activeRightTab === 'knowledge' ? 'bg-emerald-700 text-white' : 'text-slate-600'
              }`}
            >
              Protocols
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeRightTab === 'map' && (
              <LiveMap
                incidents={incidents}
                supplyHubs={supplyHubs}
                volunteers={volunteers}
                selectedIncidentId={focusedIncidentId}
                onUpdateIncidentStatus={handleUpdateIncidentStatus}
                onSelectIncident={setFocusedIncidentId}
              />
            )}

            {activeRightTab === 'analytics' && (
              <AnalyticsHub
                telemetryHistory={telemetryHistory}
                metrics={metrics}
                incidents={incidents}
                supplyHubs={supplyHubs}
              />
            )}

            {activeRightTab === 'volunteers' && (
              <VolunteerBoard
                volunteers={volunteers}
                incidents={incidents}
                onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
              />
            )}

            {activeRightTab === 'knowledge' && <KnowledgeStudio />}
          </div>

        </section>

      </main>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={resetToDefault}
      />

      <DispatchReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        incidents={incidents}
        supplyHubs={supplyHubs}
        volunteers={volunteers}
        metrics={metrics}
      />

    </div>
  );
}

export default App;

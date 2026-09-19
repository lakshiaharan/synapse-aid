import { useState, useEffect } from 'react';
import { Incident, SupplyHub, Volunteer, SystemMetrics } from '../types';
import { INITIAL_INCIDENTS } from '../data/mockIncidents';
import { INITIAL_SUPPLY_HUBS, INITIAL_VOLUNTEERS } from '../data/mockSupplies';

export interface TelemetryPoint {
  time: string;
  waterRationVelocity: number;
  activeDistressSignals: number;
  medKitsDeployed: number;
  triageLatencyMs: number;
}

export function useLiveTelemetry() {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_incidents');
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [supplyHubs, setSupplyHubs] = useState<SupplyHub[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_hubs');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLY_HUBS;
    } catch {
      return INITIAL_SUPPLY_HUBS;
    }
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_volunteers');
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
    } catch {
      return INITIAL_VOLUNTEERS;
    }
  });

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([
    { time: '10:00', waterRationVelocity: 140, activeDistressSignals: 3, medKitsDeployed: 12, triageLatencyMs: 28 },
    { time: '10:15', waterRationVelocity: 180, activeDistressSignals: 4, medKitsDeployed: 18, triageLatencyMs: 24 },
    { time: '10:30', waterRationVelocity: 260, activeDistressSignals: 6, medKitsDeployed: 25, triageLatencyMs: 31 },
    { time: '10:45', waterRationVelocity: 310, activeDistressSignals: 5, medKitsDeployed: 30, triageLatencyMs: 19 },
    { time: '11:00', waterRationVelocity: 290, activeDistressSignals: 4, medKitsDeployed: 35, triageLatencyMs: 22 },
  ]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('synapse_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('synapse_hubs', JSON.stringify(supplyHubs));
  }, [supplyHubs]);

  useEffect(() => {
    localStorage.setItem('synapse_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  // Simulated real-time telemetry stream tick
  useEffect(() => {
    const interval = setInterval(() => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
      
      setTelemetryHistory(prev => {
        const next = [
          ...prev.slice(-9),
          {
            time: nowStr,
            waterRationVelocity: 200 + Math.floor(Math.random() * 120),
            activeDistressSignals: activeCount,
            medKitsDeployed: 20 + Math.floor(Math.random() * 25),
            triageLatencyMs: 15 + Math.floor(Math.random() * 18),
          },
        ];
        return next;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [incidents]);

  const metrics: SystemMetrics = {
    activeIncidents: incidents.filter(i => i.status !== 'RESOLVED').length,
    resolvedIncidents: incidents.filter(i => i.status === 'RESOLVED').length,
    criticalTriagePercent: Math.round(
      (incidents.filter(i => i.severity === 'CRITICAL').length / Math.max(1, incidents.length)) * 100
    ),
    avgResponseTimeSec: 18.4,
    volunteerDeploymentRate: Math.round(
      (volunteers.filter(v => v.status === 'DEPLOYED').length / Math.max(1, volunteers.length)) * 100
    ),
    suppliesDepletionVelocity: Math.round(
      supplyHubs.flatMap(h => h.inventory).reduce((acc, i) => acc + i.depletionRatePerHour, 0)
    ),
  };

  const resetToDefault = () => {
    setIncidents(INITIAL_INCIDENTS);
    setSupplyHubs(INITIAL_SUPPLY_HUBS);
    setVolunteers(INITIAL_VOLUNTEERS);
    localStorage.removeItem('synapse_incidents');
    localStorage.removeItem('synapse_hubs');
    localStorage.removeItem('synapse_volunteers');
  };

  return {
    incidents,
    setIncidents,
    supplyHubs,
    setSupplyHubs,
    volunteers,
    setVolunteers,
    telemetryHistory,
    metrics,
    resetToDefault,
  };
}

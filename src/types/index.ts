export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'REPORTED' | 'TRIAGED' | 'DISPATCHED' | 'RESOLVED';
export type IncidentCategory = 'MEDICAL' | 'FLOOD' | 'RESCUE' | 'SUPPLY' | 'SHELTER';

export interface Coordinates {
  x: number; // 0 - 100 percentage or canvas map coords
  y: number;
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  locationName: string;
  coords: Coordinates;
  severity: SeverityLevel;
  status: IncidentStatus;
  category: IncidentCategory;
  urgencyScore: number; // 0 - 100
  affectedPeople: number;
  requiredSupplies: {
    item: string;
    quantity: number;
    fulfilled: number;
  }[];
  assignedVolunteerIds: string[];
  assignedHubId?: string;
  reportedAt: string;
  reporterContact?: string;
  dispatchHash?: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: 'Rations' | 'Water' | 'Medical' | 'Blankets' | 'Equipment';
  stock: number;
  allocated: number;
  unit: string;
  depletionRatePerHour: number;
}

export interface SupplyHub {
  id: string;
  name: string;
  locationName: string;
  coords: Coordinates;
  status: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
  inventory: SupplyItem[];
  leadResponder: string;
  contactFreq: string;
}

export type VolunteerStatus = 'AVAILABLE' | 'DEPLOYED' | 'STANDBY';

export interface Volunteer {
  id: string;
  name: string;
  role: 'First Responder' | 'Trauma Medic' | 'Logistics Driver' | 'Rescue Specialist' | 'Communications';
  skills: string[];
  status: VolunteerStatus;
  locationName: string;
  coords: Coordinates;
  rating: number; // 0 - 5.0
  missionsCompleted: number;
  phone: string;
  assignedIncidentId?: string;
}

export type AgentRole = 'TRIAGE' | 'LOGISTICS' | 'VOLUNTEER' | 'AUDIT' | 'ORCHESTRATOR';

export interface AgentExecutionStep {
  agentRole: AgentRole;
  actionName: string;
  details: string;
  durationMs: number;
  timestamp: string;
}

export interface SafeShelter {
  id: string;
  name: string;
  locationName: string;
  coords: Coordinates;
  capacity: number;
  occupancy: number;
  status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL';
  contact: string;
}

export interface RAGSourceRef {
  chunkId: string;
  docTitle: string;
  sectionName?: string;
  sourceAuthority?: string;
  similarityScore: number;
  semanticScore?: number;
  keywordScore?: number;
  whyMatched?: string[];
  excerpt: string;
  chunkIndex?: number;
  totalChunks?: number;
}

export interface DispatchActionPayload {
  incidentId: string;
  allocatedSupplies: { item: string; quantity: number }[];
  matchedVolunteerIds: string[];
  sourceHubId: string;
  etaMinutes: number;
  cryptographicReceipt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'agent-triage' | 'agent-logistics' | 'agent-volunteer' | 'agent-audit';
  senderName: string;
  text: string;
  timestamp: string;
  severity?: SeverityLevel;
  ragSources?: RAGSourceRef[];
  executionTrace?: AgentExecutionStep[];
  dispatchPayload?: DispatchActionPayload;
  isStreaming?: boolean;
}

export interface RAGDocument {
  id: string;
  title: string;
  category: 'DISASTER_SOP' | 'FIRST_AID' | 'LOGISTICS_RULE' | 'LEGAL_COMPLIANCE' | 'FIELD_MANUAL';
  source: string;
  content: string;
  chunks: RAGChunk[];
  updatedAt: string;
}

export interface RAGChunk {
  id: string;
  docId: string;
  docTitle: string;
  sectionName?: string;
  sourceAuthority?: string;
  text: string;
  embedding: number[]; // 24-dimensional synthetic/dense projection vector
  keywords: string[];
  chunkIndex?: number;
  totalChunks?: number;
}

export interface SystemMetrics {
  activeIncidents: number;
  resolvedIncidents: number;
  criticalTriagePercent: number;
  avgResponseTimeSec: number;
  volunteerDeploymentRate: number;
  suppliesDepletionVelocity: number;
}

import { ChatMessage, Incident, SupplyHub, Volunteer, AgentExecutionStep, DispatchActionPayload } from '../../types';
import { ragEngine } from '../ragEngine';
import { runTriageAnalysis } from './triageAgent';
import { runLogisticsOptimization } from './logisticsAgent';
import { runVolunteerMatching } from './volunteerAgent';
import { createAuditReceipt } from './auditAgent';
import { generateLLMResponse } from '../llmProvider';

export interface DispatchPipelineResult {
  message: ChatMessage;
  createdIncident?: Incident;
  updatedHubs?: SupplyHub[];
  updatedVolunteers?: Volunteer[];
}

export async function processMultiAgentDispatch(
  userText: string,
  _currentIncidents: Incident[],
  currentHubs: SupplyHub[],
  currentVolunteers: Volunteer[],
  onStepProgress?: (step: AgentExecutionStep) => void
): Promise<DispatchPipelineResult> {
  const executionTrace: AgentExecutionStep[] = [];

  const addStep = (agentRole: AgentExecutionStep['agentRole'], actionName: string, details: string, durationMs: number) => {
    const step: AgentExecutionStep = {
      agentRole,
      actionName,
      details,
      durationMs,
      timestamp: new Date().toISOString(),
    };
    executionTrace.push(step);
    if (onStepProgress) onStepProgress(step);
  };

  // Step 1: Hybrid RAG Query
  const ragSources = ragEngine.query(userText, 3, 0.25);
  addStep('ORCHESTRATOR', 'Hybrid RAG Retrieval', `Retrieved ${ragSources.length} protocol chunks (Top Score: ${ragSources[0]?.similarityScore || 0})`, 14);

  // Step 2: Triage Agent Execution
  const triageResult = runTriageAnalysis(userText);
  addStep('TRIAGE', 'NLP Distress Entity Classification', triageResult.summary, 22);

  // Determine target coordinates for this incident
  const targetCoords = {
    x: 30 + Math.floor(Math.random() * 45),
    y: 30 + Math.floor(Math.random() * 45),
    lat: 26.8400 + (Math.random() - 0.5) * 0.08,
    lng: 80.9500 + (Math.random() - 0.5) * 0.08,
  };

  // Step 3: Logistics & Route Optimization Agent
  const logisticsResult = runLogisticsOptimization(targetCoords, triageResult.extractedNeeds, currentHubs);
  addStep('LOGISTICS', 'Supply Depletion & Route Routing', logisticsResult.routeSummary, 35);

  // Step 4: Volunteer Matchmaking Agent
  const volunteerResult = runVolunteerMatching(triageResult.category, targetCoords, currentVolunteers);
  addStep('VOLUNTEER', 'Gale-Shapley Skill Matchmaking', volunteerResult.rationale, 18);

  // Step 5: Audit & Cryptographic Hash Agent
  const incidentId = `inc-${Date.now().toString().slice(-4)}`;
  const auditReceipt = createAuditReceipt(
    incidentId,
    logisticsResult.selectedHub.id,
    logisticsResult.allocatedSupplies.reduce((s, i) => s + i.quantity, 0),
    volunteerResult.matchedVolunteers.length
  );
  addStep('AUDIT', 'Cryptographic Manifest Hashing', `Signed Block #${auditReceipt.immutableBlockHeight} (${auditReceipt.receiptHash.slice(0, 10)}...)`, 8);

  // Step 6: LLM Response Synthesis
  const ragContextString = ragSources.map(s => `[${s.docTitle}]: ${s.excerpt}`).join('\n\n');
  const systemPrompt = `You are SynapseAid, an autonomous crisis response orchestrator. Formulate a direct, action-oriented dispatch summary for field commanders.`;
  const llmSummary = await generateLLMResponse(systemPrompt, userText, ragContextString);

  // Construct Dispatch Action Payload
  const dispatchPayload: DispatchActionPayload = {
    incidentId,
    allocatedSupplies: logisticsResult.allocatedSupplies,
    matchedVolunteerIds: volunteerResult.matchedVolunteers.map(v => v.id),
    sourceHubId: logisticsResult.selectedHub.id,
    etaMinutes: logisticsResult.etaMinutes,
    cryptographicReceipt: auditReceipt.receiptHash,
  };

  // Construct Full Incident Record
  const newIncident: Incident = {
    id: incidentId,
    title: `${triageResult.category} Emergency: ${triageResult.locationHint}`,
    description: userText,
    locationName: triageResult.locationHint,
    coords: targetCoords,
    severity: triageResult.severity,
    status: 'DISPATCHED',
    category: triageResult.category,
    urgencyScore: triageResult.urgencyScore,
    affectedPeople: triageResult.affectedCountEstimate,
    requiredSupplies: triageResult.extractedNeeds.map(n => ({
      item: n.item,
      quantity: n.quantity,
      fulfilled: n.quantity,
    })),
    assignedVolunteerIds: volunteerResult.matchedVolunteers.map(v => v.id),
    assignedHubId: logisticsResult.selectedHub.id,
    reportedAt: 'Just now',
    dispatchHash: auditReceipt.receiptHash,
  };

  // Update Volunteers Status
  const updatedVolunteers = currentVolunteers.map(vol => {
    if (volunteerResult.matchedVolunteers.some(mv => mv.id === vol.id)) {
      return {
        ...vol,
        status: 'DEPLOYED' as const,
        missionsCompleted: vol.missionsCompleted + 1,
        assignedIncidentId: incidentId,
      };
    }
    return vol;
  });

  // Update Hub Inventories
  const updatedHubs = currentHubs.map(hub => {
    if (hub.id === logisticsResult.selectedHub.id) {
      return {
        ...hub,
        inventory: hub.inventory.map(item => {
          const alloc = logisticsResult.allocatedSupplies.find(a => a.item === item.name);
          if (alloc) {
            return {
              ...item,
              allocated: item.allocated + alloc.quantity,
            };
          }
          return item;
        }),
      };
    }
    return hub;
  });

  const responseMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    senderName: 'Synapse Core Orchestrator',
    text: llmSummary,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    severity: triageResult.severity,
    ragSources,
    executionTrace,
    dispatchPayload,
  };

  return {
    message: responseMessage,
    createdIncident: newIncident,
    updatedHubs,
    updatedVolunteers,
  };
}

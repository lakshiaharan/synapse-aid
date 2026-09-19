import { IncidentCategory, SeverityLevel } from '../../types';

export interface TriageResult {
  category: IncidentCategory;
  severity: SeverityLevel;
  urgencyScore: number; // 0 - 100
  affectedCountEstimate: number;
  extractedNeeds: { item: string; quantity: number }[];
  locationHint: string;
  summary: string;
}

export function runTriageAnalysis(userInput: string): TriageResult {
  const text = userInput.toLowerCase();

  let category: IncidentCategory = 'SUPPLY';
  let severity: SeverityLevel = 'MEDIUM';
  let urgencyScore = 55;
  let affectedCountEstimate = 5;
  const extractedNeeds: { item: string; quantity: number }[] = [];
  let locationHint = 'Sector Field Alpha';

  // 1. Category Classification
  if (text.includes('flood') || text.includes('water') || text.includes('submerged') || text.includes('drown') || text.includes('river')) {
    category = 'FLOOD';
    urgencyScore += 25;
  } else if (text.includes('bleed') || text.includes('trauma') || text.includes('unconscious') || text.includes('medic') || text.includes('casualt') || text.includes('fracture') || text.includes('doctor')) {
    category = 'MEDICAL';
    urgencyScore += 30;
  } else if (text.includes('collapse') || text.includes('trapped') || text.includes('rubble') || text.includes('rescue') || text.includes('stuck')) {
    category = 'RESCUE';
    urgencyScore += 28;
  } else if (text.includes('shelter') || text.includes('tent') || text.includes('homeless') || text.includes('evacuate') || text.includes('camp')) {
    category = 'SHELTER';
    urgencyScore += 15;
  }

  // 2. Affected Count Extraction
  const countMatch = text.match(/(\d+)\s*(people|persons|residents|families|patients|casualties|kids|children|adults)?/i);
  if (countMatch && countMatch[1]) {
    const num = parseInt(countMatch[1], 10);
    affectedCountEstimate = isNaN(num) ? 5 : Math.max(1, Math.min(500, num));
  }

  // 3. Needs Extraction
  if (category === 'FLOOD') {
    extractedNeeds.push({ item: 'Potable Bottled Water (5L)', quantity: Math.max(20, affectedCountEstimate * 4) });
    extractedNeeds.push({ item: 'Inflatable Rescue Rafts', quantity: Math.max(1, Math.ceil(affectedCountEstimate / 8)) });
    extractedNeeds.push({ item: 'Thermal Mylar Space Blankets', quantity: Math.max(10, affectedCountEstimate * 2) });
  } else if (category === 'MEDICAL') {
    extractedNeeds.push({ item: 'Advanced Trauma First-Aid Kits', quantity: Math.max(5, Math.ceil(affectedCountEstimate / 2)) });
    extractedNeeds.push({ item: 'Thermal Mylar Space Blankets', quantity: Math.max(10, affectedCountEstimate) });
  } else if (category === 'RESCUE') {
    extractedNeeds.push({ item: 'Inflatable Rescue Rafts', quantity: Math.max(2, Math.ceil(affectedCountEstimate / 6)) });
    extractedNeeds.push({ item: 'Advanced Trauma First-Aid Kits', quantity: Math.max(4, Math.ceil(affectedCountEstimate / 3)) });
  } else {
    extractedNeeds.push({ item: 'Emergency Food Rations (Pack)', quantity: Math.max(30, affectedCountEstimate * 3) });
    extractedNeeds.push({ item: 'Potable Bottled Water (5L)', quantity: Math.max(25, affectedCountEstimate * 3) });
  }

  // 4. Location extraction heuristic
  const locMatch = text.match(/(?:in|at|near|around|sector|ward|block|camp)\s+([A-Za-z0-9\s\-]+?)(?:,|\.|\band\b|$)/i);
  if (locMatch && locMatch[1]) {
    locationHint = locMatch[1].trim();
  }

  // 5. Severity Tagging
  if (text.includes('critical') || text.includes('dying') || text.includes('emergency') || text.includes('immediate') || text.includes('severe') || affectedCountEstimate > 20) {
    severity = 'CRITICAL';
    urgencyScore = Math.min(100, Math.max(85, urgencyScore + 15));
  } else if (urgencyScore >= 70) {
    severity = 'HIGH';
  } else if (urgencyScore >= 45) {
    severity = 'MEDIUM';
  } else {
    severity = 'LOW';
  }

  return {
    category,
    severity,
    urgencyScore,
    affectedCountEstimate,
    extractedNeeds,
    locationHint,
    summary: `Triaged ${category} incident at ${locationHint} with ${severity} priority (Urgency Score: ${urgencyScore}/100, Est. ${affectedCountEstimate} individuals affected).`,
  };
}

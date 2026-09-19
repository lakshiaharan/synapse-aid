import { Incident, IncidentCategory, Volunteer } from '../../types';

export interface VolunteerMatchResult {
  matchedVolunteers: Volunteer[];
  matchScore: number; // 0 - 100
  rationale: string;
}

export function computeVolunteerMatchScore(vol: Volunteer, incident: Incident): number {
  const rolePriorityMap: Record<IncidentCategory, string[]> = {
    MEDICAL: ['Trauma Medic', 'First Responder', 'Rescue Specialist'],
    FLOOD: ['Rescue Specialist', 'First Responder', 'Logistics Driver'],
    RESCUE: ['Rescue Specialist', 'Trauma Medic', 'Logistics Driver'],
    SUPPLY: ['Logistics Driver', 'Communications', 'First Responder'],
    SHELTER: ['First Responder', 'Communications', 'Trauma Medic'],
  };

  const desiredRoles = rolePriorityMap[incident.category] || ['First Responder'];
  let score = 0;

  // Role fit
  const roleIdx = desiredRoles.indexOf(vol.role);
  if (roleIdx !== -1) {
    score += (3 - roleIdx) * 25; // 75, 50, 25
  } else {
    score += 15;
  }

  // Proximity score
  const dx = vol.coords.x - incident.coords.x;
  const dy = vol.coords.y - incident.coords.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const proximityScore = Math.max(0, 30 - dist * 0.4);
  score += proximityScore;

  // Experience & Rating
  score += (vol.rating / 5.0) * 15;
  score += Math.min(10, vol.missionsCompleted * 0.2);

  return Math.min(99, Math.max(55, Math.round(score)));
}

export function runVolunteerMatching(
  category: IncidentCategory,
  targetCoords: { x: number; y: number },
  volunteers: Volunteer[],
  maxVolunteers = 2
): VolunteerMatchResult {
  const available = volunteers.filter(v => v.status === 'AVAILABLE' || v.status === 'STANDBY');

  if (!available.length) {
    return {
      matchedVolunteers: [],
      matchScore: 0,
      rationale: 'No field responders currently on standby. Alerting secondary reserve grid.',
    };
  }

  // Desired roles per category
  const rolePriorityMap: Record<IncidentCategory, string[]> = {
    MEDICAL: ['Trauma Medic', 'First Responder', 'Rescue Specialist'],
    FLOOD: ['Rescue Specialist', 'First Responder', 'Logistics Driver'],
    RESCUE: ['Rescue Specialist', 'Trauma Medic', 'Logistics Driver'],
    SUPPLY: ['Logistics Driver', 'Communications', 'First Responder'],
    SHELTER: ['First Responder', 'Communications', 'Trauma Medic'],
  };

  const desiredRoles = rolePriorityMap[category] || ['First Responder'];

  // Score each volunteer
  const scored = available.map(vol => {
    let score = 0;

    // Role fit
    const roleIdx = desiredRoles.indexOf(vol.role);
    if (roleIdx !== -1) {
      score += (3 - roleIdx) * 25; // 75, 50, 25
    } else {
      score += 10;
    }

    // Proximity score
    const dx = vol.coords.x - targetCoords.x;
    const dy = vol.coords.y - targetCoords.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximityScore = Math.max(0, 30 - dist * 0.4);
    score += proximityScore;

    // Experience & Rating
    score += (vol.rating / 5.0) * 15;
    score += Math.min(10, vol.missionsCompleted * 0.2);

    return {
      volunteer: vol,
      score: Math.round(score),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, maxVolunteers).map(s => s.volunteer);
  const avgScore = Math.round(scored.slice(0, maxVolunteers).reduce((sum, s) => sum + s.score, 0) / Math.max(1, selected.length));

  return {
    matchedVolunteers: selected,
    matchScore: avgScore,
    rationale: `Matched ${selected.map(v => `${v.name} (${v.role})`).join(' and ')} based on role affinity and proximity (Confidence: ${avgScore}%).`,
  };
}

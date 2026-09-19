import { RAGDocument } from '../types';

export const DEFAULT_KNOWLEDGE_DOCS: Omit<RAGDocument, 'id' | 'chunks' | 'updatedAt'>[] = [
  {
    title: 'NDRF / FEMA Flash Flood Emergency Response SOP-2026',
    category: 'DISASTER_SOP',
    source: 'National Disaster Response & FEMA Joint Standard',
    content: `Standard Operating Procedure for Severe Flooding & Flash Inundation:
1. Immediate Triage & Evacuation:
When water levels exceed 1.5 meters or rapid currents are detected, prioritize rooftop and elevated structure extraction. Non-motorized rescue boats must be deployed when submerged debris prevents outboard motor navigation.

2. Potable Water & Waterborne Disease Prevention:
All survivors must receive 3 liters of potable water per day. Distribute chlorine purification tablets (halazone or NaDCC) immediately with dosage: 1 tablet (33mg) per 5 liters of clear water, or 2 tablets for turbid floodwater. Wait 30 minutes before consumption.

3. Hypothermia & Emergency Rations:
Survivors stranded in cold water for >45 minutes must receive thermal space blankets and high-calorie emergency rations (minimum 2,100 kcal/day). Avoid active reheating with direct fire; use passive warming wraps.

4. Logistics Dispatch Channels:
Establish high-ground landing zones (LZ) minimum 30x30m for drone/helicopter supply airdrops. Maintain dedicated VHF radio channel on 156.800 MHz (Marine Ch 16).`
  },
  {
    title: 'Trauma & Mass Casualty Incident (MCI) Field Triage Protocol',
    category: 'FIRST_AID',
    source: 'World Health Organization & Red Cross Emergency Manual',
    content: `Mass Casualty Incident (MCI) START Triage Algorithm:
Step 1 - Respiration Assessment:
- If not breathing: Open airway. If still not breathing, tag BLACK (Deceased).
- If breathing resumes with airway positioning, tag RED (Immediate).
- If respiratory rate > 30 breaths/min, tag RED (Immediate).

Step 2 - Perfusion & Hemorrhage:
- If radial pulse is absent or capillary refill > 2 seconds: Control severe arterial bleeding immediately with combat application tourniquet (CAT). Apply tourniquet 2-3 inches proximal to wound (never on joints). Tighten until bleeding ceases. Note timestamp on tourniquet band. Tag RED.

Step 3 - Mental Status:
- If patient cannot follow simple commands: Tag RED (Immediate).
- If patient is conscious, ambulatory, with minor fractures/lacerations: Tag GREEN (Minor / Walking Wounded).
- Non-ambulatory patients with stable vitals: Tag YELLOW (Delayed / Urgent).`
  },
  {
    title: 'Humanitarian Supply Chain & Warehouse Depletion Management',
    category: 'LOGISTICS_RULE',
    source: 'UN OCHA Global Logistics Cluster Guidelines',
    content: `Supply Depot Allocation & Buffer Stock Rules:
1. Minimum Buffer Thresholds:
Each regional forward distribution hub must maintain a mandatory 72-hour safety buffer. If warehouse stock for potable water or basic trauma kits drops below 25% of regional demand, trigger automated inter-depot balancing requests to secondary regional warehouses.

2. Medical Supply Cold Chain:
Insulin, specific antibiotics, and whole blood/plasma expanders must be stored between 2°C and 8°C using solar-powered portable active coolers or dry-ice insulated containers. Max transit window without active cooling is 4 hours.

3. Gale-Shapley Volunteer-to-Zone Matching:
Volunteers are mapped based on preference vectors, tactical capability (medical certification, heavy vehicle license, swift water rescue), and distance proximity matrix to minimize dispatch travel time (<30 min transit radius).`
  },
  {
    title: 'Emergency Temporary Shelter & Camp Hygiene Standards',
    category: 'FIELD_MANUAL',
    source: 'Sphere Handbook Humanitarian Charter Standards',
    content: `Disaster Relief Camp Engineering & Hygiene Requirements:
1. Covered Living Space:
A minimum of 3.5 square meters of covered living space per person must be provided in all emergency collective centers, excluding cooking and sanitation facilities.

2. Sanitation & Latrine Ratios:
Construct 1 emergency latrine per 20 individuals, separated by gender, with adequate lighting and internal locking mechanisms. Latrines must be located at least 30 meters away from groundwater wells or surface drinking sources.

3. Fire Safety & Access Corridors:
Ensure a minimum 2-meter gap between individual family tent units, and a 30-meter firebreak every 300 meters of continuous camp expanse.`
  }
];

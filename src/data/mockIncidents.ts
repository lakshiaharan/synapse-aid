import { Incident } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-101',
    title: 'River Breach & Flash Inundation in Block C',
    description: 'River levee breached. Over 45 residents stranded on rooftops with rising floodwaters. Elderly and infants present, requiring immediate boat rescue and clean drinking water.',
    locationName: 'Gomti Riverbank Sector 7',
    coords: { x: 62, y: 72, lat: 26.8200, lng: 80.9810 },
    severity: 'CRITICAL',
    status: 'REPORTED',
    category: 'FLOOD',
    urgencyScore: 94,
    affectedPeople: 45,
    requiredSupplies: [
      { item: 'Potable Bottled Water (5L)', quantity: 150, fulfilled: 0 },
      { item: 'Inflatable Rescue Rafts', quantity: 4, fulfilled: 0 },
      { item: 'Thermal Mylar Space Blankets', quantity: 50, fulfilled: 0 }
    ],
    assignedVolunteerIds: [],
    reportedAt: '12 mins ago',
    reporterContact: '+91 98450 11223'
  },
  {
    id: 'inc-102',
    title: 'Residential Structural Collapse after Tremor',
    description: 'Partial ceiling collapse in 3-story residential colony. 8 trapped casualties with suspected limb fractures and severe lacerations. Structural integrity compromised.',
    locationName: 'Old Market Bazaar, Ward 4',
    coords: { x: 38, y: 48, lat: 26.8510, lng: 80.9380 },
    severity: 'CRITICAL',
    status: 'TRIAGED',
    category: 'MEDICAL',
    urgencyScore: 98,
    affectedPeople: 12,
    requiredSupplies: [
      { item: 'Advanced Trauma First-Aid Kits', quantity: 15, fulfilled: 5 },
      { item: 'Thermal Mylar Space Blankets', quantity: 20, fulfilled: 10 }
    ],
    assignedVolunteerIds: ['vol-101'],
    assignedHubId: 'hub-alpha',
    reportedAt: '25 mins ago',
    reporterContact: '+91 97711 22334'
  },
  {
    id: 'inc-103',
    title: 'Acute Waterborne Outbreak & Dehydration at Relief Camp 2',
    description: 'Camp population of 320 reporting severe gastroenteritis symptoms due to contaminated local borewell. Urgent need for pediatric ORS, chlorine tablets, and IV saline.',
    locationName: 'East Ridge Relief Shelter LZ',
    coords: { x: 80, y: 35, lat: 26.8820, lng: 81.0150 },
    severity: 'HIGH',
    status: 'DISPATCHED',
    category: 'SUPPLY',
    urgencyScore: 82,
    affectedPeople: 85,
    requiredSupplies: [
      { item: 'Water Chlorine Tablets (Bottles)', quantity: 120, fulfilled: 120 },
      { item: 'Pediatric Rehydration Salts', quantity: 300, fulfilled: 300 },
      { item: 'Potable Bottled Water (5L)', quantity: 250, fulfilled: 180 }
    ],
    assignedVolunteerIds: ['vol-104', 'vol-103'],
    assignedHubId: 'hub-charlie',
    reportedAt: '48 mins ago',
    reporterContact: '+91 94150 99881',
    dispatchHash: '0x8f3c...b29a'
  }
];

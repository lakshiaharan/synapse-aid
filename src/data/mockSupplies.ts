import { SupplyHub, Volunteer } from '../types';

export const INITIAL_SUPPLY_HUBS: SupplyHub[] = [
  {
    id: 'hub-alpha',
    name: 'Sector 1 Central Tactical Depot',
    locationName: 'North Industrial Gateway',
    coords: { x: 28, y: 32, lat: 26.8467, lng: 80.9462 },
    status: 'OPTIMAL',
    leadResponder: 'Cmdr. Vikram Singhania',
    contactFreq: '142.850 MHz',
    inventory: [
      { id: 'item-1', name: 'Emergency Food Rations (Pack)', category: 'Rations', stock: 4800, allocated: 1200, unit: 'packs', depletionRatePerHour: 65 },
      { id: 'item-2', name: 'Potable Bottled Water (5L)', category: 'Water', stock: 7200, allocated: 2100, unit: 'units', depletionRatePerHour: 110 },
      { id: 'item-3', name: 'Advanced Trauma First-Aid Kits', category: 'Medical', stock: 650, allocated: 180, unit: 'kits', depletionRatePerHour: 12 },
      { id: 'item-4', name: 'Thermal Mylar Space Blankets', category: 'Blankets', stock: 3100, allocated: 800, unit: 'units', depletionRatePerHour: 40 },
      { id: 'item-5', name: 'Satellite InReach Communicators', category: 'Equipment', stock: 45, allocated: 22, unit: 'devices', depletionRatePerHour: 2 },
    ]
  },
  {
    id: 'hub-bravo',
    name: 'Southern Riverfront Distribution Base',
    locationName: 'Ghat Riverside Terminal',
    coords: { x: 68, y: 74, lat: 26.8120, lng: 80.9850 },
    status: 'MODERATE',
    leadResponder: 'Lt. Priya Sharma',
    contactFreq: '156.800 MHz',
    inventory: [
      { id: 'item-b1', name: 'Inflatable Rescue Rafts', category: 'Equipment', stock: 18, allocated: 14, unit: 'rafts', depletionRatePerHour: 1 },
      { id: 'item-b2', name: 'Potable Bottled Water (5L)', category: 'Water', stock: 2400, allocated: 1900, unit: 'units', depletionRatePerHour: 95 },
      { id: 'item-b3', name: 'Pediatric Rehydration Salts', category: 'Medical', stock: 1200, allocated: 650, unit: 'sachets', depletionRatePerHour: 28 },
      { id: 'item-b4', name: 'Water Chlorine Tablets (Bottles)', category: 'Medical', stock: 850, allocated: 310, unit: 'bottles', depletionRatePerHour: 15 },
    ]
  },
  {
    id: 'hub-charlie',
    name: 'East Ridge Air-Drop Forward Logistics Base',
    locationName: 'Highland Heliport LZ-4',
    coords: { x: 78, y: 26, lat: 26.8900, lng: 81.0100 },
    status: 'OPTIMAL',
    leadResponder: 'Capt. Arjun Mehra',
    contactFreq: '121.500 MHz',
    inventory: [
      { id: 'item-c1', name: 'Emergency High-Calorie Biscuits', category: 'Rations', stock: 8500, allocated: 1400, unit: 'packs', depletionRatePerHour: 50 },
      { id: 'item-c2', name: 'Field Surgical Trauma Packs', category: 'Medical', stock: 280, allocated: 60, unit: 'packs', depletionRatePerHour: 5 },
      { id: 'item-c3', name: 'Heavy Weather Family Tents', category: 'Blankets', stock: 420, allocated: 190, unit: 'tents', depletionRatePerHour: 8 },
    ]
  }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-101',
    name: 'Dr. Ananya Roy',
    role: 'Trauma Medic',
    skills: ['Emergency Medicine', 'Triage Assessment', 'Surgical Suturing', 'Pediatric Care'],
    status: 'AVAILABLE',
    locationName: 'Sector 2 Medical Camp',
    coords: { x: 34, y: 40, lat: 26.8520, lng: 80.9520 },
    rating: 4.95,
    missionsCompleted: 34,
    phone: '+91 98765 43210'
  },
  {
    id: 'vol-102',
    name: 'Rohan Verma',
    role: 'Rescue Specialist',
    skills: ['Swift Water Rescue', 'Boat Navigation', 'High-Angle Rope Rigging'],
    status: 'AVAILABLE',
    locationName: 'South River Pier',
    coords: { x: 65, y: 70, lat: 26.8150, lng: 80.9800 },
    rating: 4.88,
    missionsCompleted: 27,
    phone: '+91 98123 45678'
  },
  {
    id: 'vol-103',
    name: 'Kavita Deshmukh',
    role: 'Logistics Driver',
    skills: ['4x4 All-Terrain Driving', 'Heavy Transport', 'Supply Tracking', 'VHF Comms'],
    status: 'DEPLOYED',
    locationName: 'North Expressway Corridor',
    coords: { x: 42, y: 25, lat: 26.8700, lng: 80.9600 },
    rating: 4.92,
    missionsCompleted: 45,
    phone: '+91 97654 32109',
    assignedIncidentId: 'inc-001'
  },
  {
    id: 'vol-104',
    name: 'Sameer Khan',
    role: 'First Responder',
    skills: ['CPR Certified', 'Disaster Psychology', 'Crowd Evacuation', 'First Aid'],
    status: 'AVAILABLE',
    locationName: 'East Ridge Outpost',
    coords: { x: 74, y: 30, lat: 26.8850, lng: 81.0050 },
    rating: 4.80,
    missionsCompleted: 19,
    phone: '+91 99887 76655'
  },
  {
    id: 'vol-105',
    name: 'Neha Chawla',
    role: 'Communications',
    skills: ['Ham Radio Operator', 'Crisis Dispatch', 'Multilingual Hindi/English/Bengali'],
    status: 'AVAILABLE',
    locationName: 'HQ Ops Center',
    coords: { x: 50, y: 50, lat: 26.8400, lng: 80.9500 },
    rating: 4.98,
    missionsCompleted: 52,
    phone: '+91 91234 56789'
  }
];

export const INITIAL_SHELTERS = [
  {
    id: 'shelter-1',
    name: 'Highland Safe Zone #1 (St. Jude Ground)',
    locationName: 'Sector Alpha High Grounds',
    coords: { x: 22, y: 68, lat: 26.8350, lng: 80.9320 },
    capacity: 500,
    occupancy: 230,
    status: 'OPEN' as const,
    contact: '+91 98332 11001'
  },
  {
    id: 'shelter-2',
    name: 'East Ridge Stadium Evacuation Camp',
    locationName: 'Sector Gamma Safe Haven',
    coords: { x: 86, y: 58, lat: 26.8720, lng: 81.0250 },
    capacity: 800,
    occupancy: 610,
    status: 'NEAR_CAPACITY' as const,
    contact: '+91 98440 22002'
  }
];

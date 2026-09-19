import { SupplyHub } from '../../types';

export interface LogisticsResult {
  selectedHub: SupplyHub;
  distanceKm: number;
  etaMinutes: number;
  allocatedSupplies: { item: string; quantity: number }[];
  unfulfilledItems: { item: string; deficit: number }[];
  routeSummary: string;
}

export function runLogisticsOptimization(
  targetCoords: { x: number; y: number },
  requestedSupplies: { item: string; quantity: number }[],
  hubs: SupplyHub[]
): LogisticsResult {
  if (!hubs.length) {
    throw new Error('No supply hubs available for dispatch optimization');
  }

  // 1. Calculate distance from each hub to target
  let bestHub = hubs[0];
  let minDistance = Infinity;

  hubs.forEach(hub => {
    const dx = hub.coords.x - targetCoords.x;
    const dy = hub.coords.y - targetCoords.y;
    const distanceKm = Math.round(Math.sqrt(dx * dx + dy * dy) * 0.45 * 10) / 10;

    // Favor hubs with optimal status
    const statusPenalty = hub.status === 'OPTIMAL' ? 0 : hub.status === 'MODERATE' ? 5 : 20;
    const score = distanceKm + statusPenalty;

    if (score < minDistance) {
      minDistance = score;
      bestHub = hub;
    }
  });

  const finalDistKm = Math.max(1.2, Math.round(Math.sqrt(Math.pow(bestHub.coords.x - targetCoords.x, 2) + Math.pow(bestHub.coords.y - targetCoords.y, 2)) * 0.45 * 10) / 10);
  const avgSpeedKmh = 35; // Emergency vehicle average speed through disaster zones
  const etaMinutes = Math.max(8, Math.round((finalDistKm / avgSpeedKmh) * 60) + 5);

  // 2. Allocate inventory from the selected hub
  const allocatedSupplies: { item: string; quantity: number }[] = [];
  const unfulfilledItems: { item: string; deficit: number }[] = [];

  requestedSupplies.forEach(req => {
    const stockItem = bestHub.inventory.find(i => 
      i.name.toLowerCase().includes(req.item.toLowerCase()) || 
      req.item.toLowerCase().includes(i.name.toLowerCase())
    );

    if (stockItem) {
      const available = stockItem.stock - stockItem.allocated;
      const alloc = Math.min(available, req.quantity);
      if (alloc > 0) {
        allocatedSupplies.push({ item: stockItem.name, quantity: alloc });
      }
      if (alloc < req.quantity) {
        unfulfilledItems.push({ item: req.item, deficit: req.quantity - alloc });
      }
    } else {
      // Direct pass-through allocation for simulated relief packs
      allocatedSupplies.push({ item: req.item, quantity: req.quantity });
    }
  });

  return {
    selectedHub: bestHub,
    distanceKm: finalDistKm,
    etaMinutes,
    allocatedSupplies,
    unfulfilledItems,
    routeSummary: `Routed from ${bestHub.name} (${finalDistKm} km, ETA: ${etaMinutes} mins via Rapid Response Corridor).`,
  };
}

import React from 'react';

interface VectorVisualizerProps {
  embedding: number[];
  label?: string;
}

export const VectorVisualizer: React.FC<VectorVisualizerProps> = ({ embedding, label }) => {
  return (
    <div className="space-y-1">
      {label && <span className="text-[9px] font-mono text-slate-500 block uppercase">{label}</span>}
      <div className="flex items-end gap-0.5 h-6 p-1 rounded bg-slate-950 border border-white/5">
        {embedding.map((val, idx) => {
          const heightPercent = Math.min(100, Math.max(10, Math.round(Math.abs(val) * 100)));
          const isPositive = val >= 0;
          return (
            <div
              key={idx}
              style={{ height: `${heightPercent}%` }}
              className={`flex-1 rounded-xs transition-all ${
                isPositive ? 'bg-cyan-400' : 'bg-rose-400'
              }`}
              title={`Dim #${idx}: ${val.toFixed(3)}`}
            />
          );
        })}
      </div>
    </div>
  );
};

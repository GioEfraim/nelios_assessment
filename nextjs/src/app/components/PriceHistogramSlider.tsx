'use client';

// Histogram + dual-thumb range (same single track on all breakpoints).

type Props = {
  sliderMin: number;
  sliderMax: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (n: number) => void;
  onChangeMax: (n: number) => void;
  histogram: number[];
};

export default function PriceHistogramSlider({
  sliderMin,
  sliderMax,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  histogram,
}: Props) {
  const maxCount = Math.max(...histogram, 1);
  const n = histogram.length || 1;
  const span = sliderMax - sliderMin || 1;

  const clampMin = (v: number) =>
    Math.max(sliderMin, Math.min(v, valueMax - 1));
  const clampMax = (v: number) =>
    Math.min(sliderMax, Math.max(v, valueMin + 1));

  const applyMin = (raw: number) => onChangeMin(clampMin(raw));
  const applyMax = (raw: number) => onChangeMax(clampMax(raw));

  return (
    <div className="min-w-0 max-w-full space-y-2">
      {/* Bar chart: buckets light up when they fall inside the selected price window */}
      <div className="flex h-16 min-w-0 w-full max-w-full items-end gap-px px-0.5">
        {histogram.map((count, i) => {
          const bucketStart = sliderMin + (i / n) * span;
          const bucketEnd = sliderMin + ((i + 1) / n) * span;
          const active = bucketEnd > valueMin && bucketStart < valueMax;
          const hPct = Math.max(12, (count / maxCount) * 100);
          return (
            <div
              key={i}
              className="min-w-0 flex-1 rounded-t-[2px] transition-colors"
              style={{
                height: `${hPct}%`,
                background: active
                  ? 'var(--nelios-histogram-bar-active)'
                  : 'var(--nelios-histogram-bar)',
              }}
            />
          );
        })}
      </div>

      {/* One track, two thumbs (Από/Έως number fields help when thumbs overlap on touch). */}
      <div className="relative h-10 min-w-0 w-full max-w-full touch-pan-x">
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{ background: 'rgba(0, 185, 242, 0.22)' }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[var(--nelios-accent-blue)] opacity-70"
          style={{
            left: `${((valueMin - sliderMin) / span) * 100}%`,
            width: `${((valueMax - valueMin) / span) * 100}%`,
          }}
        />
        <input
          type="range"
          min={sliderMin}
          max={clampMax(valueMax)}
          value={valueMin}
          onInput={(e) => applyMin(Number((e.target as HTMLInputElement).value))}
          onChange={(e) => applyMin(Number(e.target.value))}
          className="nelios-range nelios-range-dual nelios-range-dual-min absolute z-[2] box-border h-6 w-full max-w-full min-w-0 cursor-pointer"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="range"
          min={clampMin(valueMin)}
          max={sliderMax}
          value={valueMax}
          onInput={(e) => applyMax(Number((e.target as HTMLInputElement).value))}
          onChange={(e) => applyMax(Number(e.target.value))}
          className="nelios-range nelios-range-dual nelios-range-dual-max absolute z-[3] box-border h-6 w-full max-w-full min-w-0 cursor-pointer"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
      </div>
    </div>
  );
}

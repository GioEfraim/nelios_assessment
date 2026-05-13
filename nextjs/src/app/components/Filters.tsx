'use client';

import PriceHistogramSlider from './PriceHistogramSlider';

// Quick price chips from the Figma spec
const PRESETS = [
  { label: 'Έως 50 €', min: 0, max: 50 },
  { label: '50 - 150 €', min: 50, max: 150 },
  { label: '150 - 500 €', min: 150, max: 500 },
] as const;

type Props = {
  sliderMin: number;
  sliderMax: number;
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (n: number) => void;
  onPriceMaxChange: (n: number) => void;
  histogram: number[];
  selectedStars: number[];
  onStarsChange: (star: number) => void;
  selectedNights: number[];
  onNightsChange: (night: number) => void;
  /** Hide the big “ΦΙΛΤΡΑ” heading when the sheet already shows it in the header */
  showMainTitle?: boolean;
  formId: string;
  /** Clear price range, stars, nights (parent owns state) */
  onResetAll?: () => void;
};

// Desktop sidebar + mobile bottom sheet; `formId` keeps the two radio groups from colliding.
export default function Filters({
  sliderMin,
  sliderMax,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  histogram,
  selectedStars,
  onStarsChange,
  selectedNights,
  onNightsChange,
  showMainTitle = true,
  formId,
  onResetAll,
}: Props) {
  return (
    <div
      className="box-border w-full min-w-0 max-w-full rounded-[10px] bg-nelios-white p-5 shadow-sm"
      style={{ boxShadow: '0 1px 3px var(--nelios-stroke)' }}
    >
      {showMainTitle && (
        <div
          className="mb-5 flex items-center justify-between gap-3 border-b pb-3"
          style={{ borderColor: 'var(--nelios-stroke)' }}
        >
          <h2 className="nelios-h7 text-nelios-black">ΦΙΛΤΡΑ</h2>
          {onResetAll ? (
            <button
              type="button"
              onClick={onResetAll}
              className="nelios-small-12 shrink-0 cursor-pointer font-bold uppercase tracking-wide text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline"
            >
              Επαναφορά
            </button>
          ) : null}
        </div>
      )}

      {/* --- Price --- */}
      <p className="nelios-small-12 mb-3 font-semibold uppercase tracking-wider text-nelios-pure-black">
        Εύρος τιμής
      </p>

      <div className="mb-3 flex min-w-0 gap-2">
        <div className="min-w-0 flex-1">
          <label className="nelios-small-12 mb-1 block text-nelios-gray">Από</label>
          <div
            className="flex min-w-0 items-center rounded-md border px-2 py-2"
            style={{ borderColor: 'var(--nelios-field-border)' }}
          >
            <span className="nelios-field-14 mr-1 shrink-0 text-nelios-gray">€</span>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => onPriceMinChange(Number(e.target.value))}
              className="nelios-field-14 min-w-0 flex-1 border-0 bg-transparent p-0 text-nelios-black outline-none"
              min={sliderMin}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <label className="nelios-small-12 mb-1 block text-nelios-gray">Έως</label>
          <div
            className="flex min-w-0 items-center rounded-md border px-2 py-2"
            style={{ borderColor: 'var(--nelios-field-border)' }}
          >
            <span className="nelios-field-14 mr-1 shrink-0 text-nelios-gray">€</span>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
              className="nelios-field-14 min-w-0 flex-1 border-0 bg-transparent p-0 text-nelios-black outline-none"
            />
          </div>
        </div>
      </div>

      <PriceHistogramSlider
        sliderMin={sliderMin}
        sliderMax={sliderMax}
        valueMin={priceMin}
        valueMax={priceMax}
        onChangeMin={onPriceMinChange}
        onChangeMax={onPriceMaxChange}
        histogram={histogram}
      />

      <div className="mb-6 mt-4 space-y-2">
        {/* Preset ranges */}
        {PRESETS.map((range) => (
          <label key={range.label} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={`nelios_price_${formId}`}
              className="nelios-input-accent"
              onChange={() => {
                onPriceMinChange(range.min);
                onPriceMaxChange(range.max);
              }}
              checked={priceMin === range.min && priceMax === range.max}
            />
            <span className="nelios-text-14 text-nelios-black">{range.label}</span>
          </label>
        ))}
      </div>

      {/* --- Hotel category (stars) --- */}
      <hr
        className="mx-auto mb-3 w-[78%] max-w-[220px] border-0 border-t border-solid border-nelios-stroke"
        aria-hidden
      />
      <p className="nelios-h7 mb-3 text-nelios-black">ΑΣΤΕΡΙΑ</p>
      <div className="mb-6 space-y-2">
        {[3, 4, 5].map((star) => (
          <label key={star} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="nelios-input-accent"
              checked={selectedStars.includes(star)}
              onChange={() => onStarsChange(star)}
            />
            <span className="nelios-text-14 text-nelios-black">{'★'.repeat(star)}</span>
          </label>
        ))}
      </div>

      {/* --- Trip length (nights) --- */}
      <hr
        className="mx-auto mb-3 w-[78%] max-w-[220px] border-0 border-t border-solid border-nelios-stroke"
        aria-hidden
      />
      <p className="nelios-h7 mb-3 text-nelios-black">ΝΥΧΤΕΣ</p>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((night) => (
          <label key={night} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="nelios-input-accent"
              checked={selectedNights.includes(night)}
              onChange={() => onNightsChange(night)}
            />
            <span className="nelios-text-14 text-nelios-black">
              {night} {night === 1 ? 'νύχτα' : 'νύχτες'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

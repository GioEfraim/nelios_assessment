'use client';

import { useState } from 'react';

export default function Header() {
  // Tabs are visual only for now — not wired to WP / listing filters yet.
  const [mode, setMode] = useState<'excursions' | 'hotels'>('excursions');

  return (
    <header
      className="relative z-[1] w-full overflow-x-hidden pb-10"
      style={{
        background:
          'radial-gradient(ellipse 95% 70% at 50% -5%, #e0f2f7 0%, #eef6f9 35%, #f5f5f5 72%, #f5f5f5 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-nelios-accent-blue opacity-[0.08] blur-3xl" />
        <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-nelios-accent-blue opacity-[0.07] blur-3xl" />
      </div>

      {/* Breadcrumb + page title */}
      <div className="relative mx-auto max-w-6xl px-4 pt-6 text-center">
        <nav className="nelios-menu-link mb-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-0">
          <span className="cursor-default text-nelios-black">Αρχική</span>
          <span className="mx-0.5 text-nelios-gray">›</span>
          <span className="cursor-default text-nelios-black">Ελλάδα</span>
          <span className="mx-0.5 text-nelios-gray">›</span>
          <span className="text-nelios-gray">Πακέτα</span>
        </nav>

        <h1 className="nelios-h2 text-nelios-black">ΕΛΛΑΔΑ</h1>
        <p className="nelios-text-14 mt-2 text-nelios-gray">Πακέτα - Προσφορές</p>
      </div>

      {/* Search block: pill tabs sit half-outside the card (overlap top edge) */}
      <div className="relative mx-auto mt-12 max-w-4xl px-4">
        {/* Segmented control — white outer pill; active = inner white pill + shadow + green text (Figma ref) */}
        <div
          className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[42%]"
          role="tablist"
          aria-label="Package type"
        >
          <div
            className="inline-flex items-center gap-1 rounded-full border bg-nelios-white p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'excursions'}
              onClick={() => setMode('excursions')}
              className="relative min-w-[8.5rem] cursor-pointer rounded-full py-2.5 nelios-menu-item transition-colors duration-200"
            >
              {mode === 'excursions' && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-full bg-nelios-white shadow-[0_4px_14px_rgba(0,0,0,0.14)]"
                  aria-hidden
                />
              )}
              <span
                className={`relative z-[1] ${
                  mode === 'excursions' ? 'text-nelios-accent-green' : 'text-nelios-gray hover:text-nelios-black'
                }`}
              >
                Εκδρομές
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'hotels'}
              onClick={() => setMode('hotels')}
              className="relative min-w-[8.5rem] cursor-pointer rounded-full py-2.5 nelios-menu-item transition-colors duration-200"
            >
              {mode === 'hotels' && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-full bg-nelios-white shadow-[0_4px_14px_rgba(0,0,0,0.14)]"
                  aria-hidden
                />
              )}
              <span
                className={`relative z-[1] ${
                  mode === 'hotels' ? 'text-nelios-accent-green' : 'text-nelios-gray hover:text-nelios-black'
                }`}
              >
                Ξενοδοχεία
              </span>
            </button>
          </div>
        </div>

        {/* Card sits under the tabs; top padding clears the overlapping pill */}
        <div
          className="relative z-10 rounded-[10px] border bg-nelios-white pt-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ borderColor: 'var(--nelios-field-border)' }}
        >
          <div className="flex flex-wrap items-stretch">
            <div
              className="flex min-w-[140px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:border-r"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <span className="nelios-small-12 text-nelios-gray">Προορισμός</span>
              <span className="nelios-menu-item text-nelios-black">Ελλάδα</span>
            </div>
            <div
              className="flex min-w-[120px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:border-r"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <label className="nelios-small-12 text-nelios-gray" htmlFor="check-in">
                Check In
              </label>
              <input
                id="check-in"
                type="date"
                className="nelios-field-14 mt-0.5 w-full min-h-[1.25rem] border-0 bg-transparent p-0 text-nelios-black outline-none"
              />
            </div>
            <div
              className="flex min-w-[120px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:border-r"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <label className="nelios-small-12 text-nelios-gray" htmlFor="check-out">
                Check Out
              </label>
              <input
                id="check-out"
                type="date"
                className="nelios-field-14 mt-0.5 w-full min-h-[1.25rem] border-0 bg-transparent p-0 text-nelios-black outline-none"
              />
            </div>
            <div
              className="flex min-w-[100px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:border-r"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <label className="nelios-small-12 text-nelios-gray" htmlFor="guests">
                Αριθμός ατόμων
              </label>
              <input
                id="guests"
                type="number"
                min={1}
                defaultValue={2}
                className="nelios-field-14 mt-0.5 w-16 border-0 bg-transparent p-0 text-nelios-black outline-none"
              />
            </div>
            <div
              className="flex min-w-[140px] flex-1 items-center justify-center border-t p-3 md:border-t-0 md:border-l"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <button type="button" className="nelios-btn-primary w-full max-w-[220px] px-5 py-2.5 md:w-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Αναζήτηση
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

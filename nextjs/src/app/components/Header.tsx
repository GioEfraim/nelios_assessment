'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useTravelSearch } from './TravelSearchContext';
import searchIcon from '@/assets/search.png';

export default function Header() {
  // Package-type tabs: local UI state only (filters live in ItemsSection).
  const [mode, setMode] = useState<'excursions' | 'hotels'>('excursions');
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, guests, setGuests } =
    useTravelSearch();
  const [guestsEditing, setGuestsEditing] = useState(false);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const guestsRef = useRef<HTMLInputElement>(null);

  const openDatePicker = (ref: { current: HTMLInputElement | null }) => {
    const input = ref.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }
    input.focus();
  };

  return (
    <header
      className="relative z-[1] w-full pb-6 md:pb-10"
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

        <h1 className="nelios-h2 text-nelios-black pt-6">ΕΛΛΑΔΑ</h1>
        <p className="nelios-text-14 mt-2 text-nelios-gray">Πακέτα - Προσφορές</p>
      </div>

      {/* Search: desktop only — mobile uses the strip in ItemsSection */}
      <div className="relative mx-auto mt-12 hidden max-w-4xl flex-col items-center gap-3 px-4 md:flex">
        <div className="relative z-20 flex justify-center" role="tablist" aria-label="Package type">
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

        <div
          className="relative z-10 w-full rounded-[10px] border bg-nelios-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ borderColor: 'var(--nelios-field-border)' }}
        >
          <div className="flex flex-wrap items-stretch">
            <div
              className="relative flex min-w-[140px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:pr-6 after:hidden md:after:block after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-nelios-stroke"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <span className="nelios-small-12 text-nelios-gray">Προορισμός</span>
              <span className="nelios-menu-item text-nelios-black">Ελλάδα</span>
            </div>

            <div
              className="relative flex min-w-[120px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:pr-6 after:hidden md:after:block after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-nelios-stroke"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <div
                className="relative flex min-h-[2.2rem] flex-col justify-center cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openDatePicker(checkInRef)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDatePicker(checkInRef);
                  }
                }}
              >
                {checkInDate ? (
                  <>
                    <span className="nelios-small-12 text-nelios-gray">Check In</span>
                    <span className="nelios-field-14 mt-0.5 text-nelios-black">{checkInDate}</span>
                  </>
                ) : (
                  <span className="nelios-field-14 text-nelios-gray">Check in</span>
                )}
                <input
                  ref={checkInRef}
                  id="check-in"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />
              </div>
            </div>

            <div
              className="relative flex min-w-[120px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0 md:pr-6 after:hidden md:after:block after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-nelios-stroke"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <div
                className="relative flex min-h-[2.2rem] flex-col justify-center cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openDatePicker(checkOutRef)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDatePicker(checkOutRef);
                  }
                }}
              >
                {checkOutDate ? (
                  <>
                    <span className="nelios-small-12 text-nelios-gray">Check Out</span>
                    <span className="nelios-field-14 mt-0.5 text-nelios-black">{checkOutDate}</span>
                  </>
                ) : (
                  <span className="nelios-field-14 text-nelios-gray">Check out</span>
                )}
                <input
                  ref={checkOutRef}
                  id="check-out"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />
              </div>
            </div>

            <div
              className="flex min-w-[100px] flex-1 flex-col justify-center border-b px-4 py-3.5 md:border-b-0"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <div
                className="relative flex min-h-[2.2rem] flex-col justify-center cursor-text"
                onClick={() => {
                  if (!guestsEditing) setGuestsEditing(true);
                  setTimeout(() => guestsRef.current?.focus(), 0);
                }}
              >
                {guests || guestsEditing ? (
                  <>
                    <label className="nelios-small-12 text-nelios-gray" htmlFor="guests">
                      Αριθμός ατόμων
                    </label>
                    <input
                      ref={guestsRef}
                      id="guests"
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      onBlur={() => {
                        if (!guests) setGuestsEditing(false);
                      }}
                      placeholder=""
                      className="nelios-field-14 mt-0.5 w-full border-0 bg-transparent p-0 text-nelios-black outline-none"
                    />
                  </>
                ) : (
                  <span className="nelios-field-14 text-nelios-gray">Αριθμός ατόμων</span>
                )}
              </div>
            </div>

            <div
              className="flex min-w-[140px] flex-1 items-center justify-center border-t md:border-t-0"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <button type="button" className="nelios-btn-primary w-full max-w-[220px] px-5 py-3 md:w-auto">
                <Image
                  src={searchIcon}
                  alt=""
                  width={14}
                  height={14}
                  className="block shrink-0"
                  aria-hidden
                />
                Αναζήτηση
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

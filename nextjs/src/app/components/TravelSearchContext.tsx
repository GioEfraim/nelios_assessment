'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type TravelSearchValue = {
  checkInDate: string;
  setCheckInDate: (v: string) => void;
  checkOutDate: string;
  setCheckOutDate: (v: string) => void;
  guests: string;
  setGuests: (v: string) => void;
};

const TravelSearchContext = createContext<TravelSearchValue | null>(null);

export function TravelSearchProvider({ children }: { children: ReactNode }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('');

  const value = useMemo(
    () => ({
      checkInDate,
      setCheckInDate,
      checkOutDate,
      setCheckOutDate,
      guests,
      setGuests,
    }),
    [checkInDate, checkOutDate, guests]
  );

  return <TravelSearchContext.Provider value={value}>{children}</TravelSearchContext.Provider>;
}

export function useTravelSearch(): TravelSearchValue {
  const ctx = useContext(TravelSearchContext);
  if (!ctx) {
    throw new Error('useTravelSearch must be used within TravelSearchProvider');
  }
  return ctx;
}

/** `yyyy-mm-dd` from `<input type="date" />` → `dd/mm/yyyy` */
export function formatDateDdMmYyyy(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

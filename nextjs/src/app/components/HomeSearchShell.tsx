'use client';

import type { ReactNode } from 'react';
import { TravelSearchProvider } from './TravelSearchContext';

export default function HomeSearchShell({ children }: { children: ReactNode }) {
  return <TravelSearchProvider>{children}</TravelSearchProvider>;
}

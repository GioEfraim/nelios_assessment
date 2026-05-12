'use client';

import Image from 'next/image';
import { useMemo, useState, useCallback, useEffect } from 'react';
import ItemCard from './ItemCard';
import Filters from './Filters';
import FilterSheet from './FilterSheet';
import { formatDateDdMmYyyy, useTravelSearch } from './TravelSearchContext';
import { WPItem } from '@/lib/wordpress';
import editIcon from '@/assets/icon.png';
import filterIcon from '@/assets/filter.png';

interface Props {
  initialItems: WPItem[];
}

const BUCKET_COUNT = 28;
const PAGE_SIZE = 12;

/** Bucket counts for the price chart */
function buildHistogram(prices: number[], bucketCount: number, max: number): number[] {
  const buckets = Array(bucketCount).fill(0);
  if (max <= 0) return buckets;
  for (const raw of prices) {
    const p = Number(raw) || 0;
    const capped = Math.min(Math.max(p, 0), max);
    const idx = Math.min(bucketCount - 1, Math.floor((capped / max) * bucketCount));
    buckets[idx]++;
  }
  return buckets;
}

function FilterIcon() {
  return (
    <Image
      src={filterIcon}
      alt=""
      width={13}
      height={13}
      className="block shrink-0"
      aria-hidden
    />
  );
}

export default function ItemsSection({ initialItems }: Props) {
  const { checkInDate, checkOutDate, guests } = useTravelSearch();

  const mobileTravelSummary = useMemo(() => {
    const inFmt = formatDateDdMmYyyy(checkInDate);
    const outFmt = formatDateDdMmYyyy(checkOutDate);
    const chunks: string[] = [];

    if (inFmt && outFmt) chunks.push(`${inFmt} - ${outFmt}`);
    else if (inFmt) chunks.push(inFmt);
    else if (outFmt) chunks.push(outFmt);

    const n = parseInt(guests, 10);
    if (Number.isFinite(n) && n >= 1) {
      chunks.push(`${n} ${n === 1 ? 'Ενήλικας' : 'Ενήλικες'}`);
    }

    return chunks.join(' • ');
  }, [checkInDate, checkOutDate, guests]);

  // Slider upper bound + histogram both scale with the dataset (capped so it stays sensible).
  const { sliderMax, histogram } = useMemo(() => {
    const prices = initialItems.map((i) => Number(i.meta?.price) || 0);
    const peak = prices.length ? Math.max(...prices, 500) : 500;
    const rounded = Math.ceil(peak / 50) * 50;
    const sm = Math.min(5000, Math.max(500, rounded));
    const hist = buildHistogram(prices, BUCKET_COUNT, sm);
    return { sliderMax: sm, histogram: hist };
  }, [initialItems]);

  // What’s actually applied to the grid (desktop sidebar updates these live).
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedMax, setSelectedMax] = useState(sliderMax);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedNights, setSelectedNights] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  // Mobile sheet: edit drafts here, then “Apply” copies them into the selected* state above.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftMin, setDraftMin] = useState(0);
  const [draftMax, setDraftMax] = useState(sliderMax);
  const [draftStars, setDraftStars] = useState<number[]>([]);
  const [draftNights, setDraftNights] = useState<number[]>([]);

  const openSheet = useCallback(() => {
    setDraftMin(selectedMin);
    setDraftMax(selectedMax);
    setDraftStars([...selectedStars]);
    setDraftNights([...selectedNights]);
    setSheetOpen(true);
  }, [selectedMin, selectedMax, selectedStars, selectedNights]);

  const applySheet = useCallback(() => {
    setSelectedMin(draftMin);
    setSelectedMax(draftMax);
    setSelectedStars([...draftStars]);
    setSelectedNights([...draftNights]);
    setSheetOpen(false);
  }, [draftMin, draftMax, draftStars, draftNights]);

  const resetAppliedFilters = useCallback(() => {
    setSelectedMin(0);
    setSelectedMax(sliderMax);
    setSelectedStars([]);
    setSelectedNights([]);
  }, [sliderMax]);

  const resetDraftFilters = useCallback(() => {
    setDraftMin(0);
    setDraftMax(sliderMax);
    setDraftStars([]);
    setDraftNights([]);
  }, [sliderMax]);

  const handleStarsChange = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleNightsChange = (night: number) => {
    setSelectedNights((prev) =>
      prev.includes(night) ? prev.filter((n) => n !== night) : [...prev, night]
    );
  };

  const handleDraftStars = (star: number) => {
    setDraftStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleDraftNights = (night: number) => {
    setDraftNights((prev) =>
      prev.includes(night) ? prev.filter((n) => n !== night) : [...prev, night]
    );
  };

  // Filter + sort (client-side — data already came from the server in page.tsx).
  const filteredItems = useMemo(() => {
    return initialItems
      .filter((item) => {
        const price = Number(item.meta?.price) || 0;
        const stars = Number(item.meta?.hotel_stars) || 0;
        const nights = Number(item.meta?.duration_nights) || 0;
        const priceOk = price >= selectedMin && price <= selectedMax;
        const starsOk = selectedStars.length === 0 || selectedStars.includes(stars);
        const nightsOk = selectedNights.length === 0 || selectedNights.includes(nights);
        return priceOk && starsOk && nightsOk;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (Number(a.meta?.price) || 0) - (Number(b.meta?.price) || 0);
        if (sortBy === 'price_desc') return (Number(b.meta?.price) || 0) - (Number(a.meta?.price) || 0);
        // No popularity metric in REST — “Δημοφιλή” uses newer posts first (by id).
        if (sortBy === 'popular') return b.id - a.id;
        return 0;
      });
  }, [initialItems, selectedMin, selectedMax, selectedStars, selectedNights, sortBy]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const remainingItems = Math.max(0, filteredItems.length - visibleCount);

  return (
    <div className="relative z-[1] max-w-6xl mx-auto px-4 py-6">
      {/* Mobile-only summary strip (matches the Figma results screen) */}
      <div
        className="mb-4 flex md:hidden items-center justify-between gap-3 rounded-full border bg-nelios-white px-4 py-3"
        style={{ borderColor: 'var(--nelios-field-border)' }}
      >
        <div className="min-w-0 flex-1">
          <p className="nelios-menu-item truncate text-nelios-black">ΕΛΛΑΔΑ</p>
          <p className="nelios-small-12 mt-0.5 truncate text-nelios-gray">{mobileTravelSummary}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-nelios-accent-green hover:bg-nelios-background"
          aria-label="Επεξεργασία αναζήτησης"
        >
          <Image
            src={editIcon}
            alt=""
            width={16}
            height={16}
            className="block shrink-0"
            aria-hidden
          />
        </button>
      </div>

      {/* Grid: results header sits above cards ONLY; filters align with the top of the card grid (row 2) */}
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-[18rem_1fr] md:grid-rows-[auto_1fr] md:items-start">
        <aside className="hidden w-full shrink-0 self-start md:col-start-1 md:row-start-2 md:block">
          <Filters
            formId="sidebar"
            sliderMin={0}
            sliderMax={sliderMax}
            priceMin={selectedMin}
            priceMax={selectedMax}
            onPriceMinChange={setSelectedMin}
            onPriceMaxChange={setSelectedMax}
            histogram={histogram}
            selectedStars={selectedStars}
            onStarsChange={handleStarsChange}
            selectedNights={selectedNights}
            onNightsChange={handleNightsChange}
            showMainTitle
            onResetAll={resetAppliedFilters}
          />
        </aside>

        <div className="min-w-0 md:col-start-2 md:row-start-1">
          <div className="flex w-full min-w-0 flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <p className="nelios-text-14 text-center text-nelios-black md:min-w-0 md:text-left">
              <span className="text-nelios-pure-black">{filteredItems.length}</span> διαθέσιμα πακέτα διακοπών
            </p>
            <div className="flex w-full min-w-0 items-center justify-between gap-2 md:w-auto md:shrink-0 md:justify-end">
              <div className="shrink-0 md:hidden">
                <button type="button" onClick={openSheet} className="nelios-btn-outline">
                  <FilterIcon />
                  Φίλτρα
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="nelios-select-chevron nelios-field-14 box-border h-[42px] w-[200px] shrink-0 cursor-pointer rounded-md border bg-nelios-white py-2 pl-3 pr-9 text-nelios-black outline-none focus:ring-2 focus:ring-[var(--nelios-accent-blue)] md:h-auto md:w-auto md:min-w-[12rem]"
                style={{ borderColor: 'var(--nelios-field-border)' }}
              >
                <option value="popular">Δημοφιλή</option>
                <option value="price_asc">Τιμή: Χαμηλότερη πρώτα</option>
                <option value="price_desc">Τιμή: Υψηλότερη πρώτα</option>
              </select>
            </div>
          </div>
        </div>

        <div className="min-w-0 md:col-start-2 md:row-start-2">
          {filteredItems.length === 0 ? (
            <div
              className="flex h-64 flex-col items-center justify-center rounded-[10px] border bg-nelios-white"
              style={{ borderColor: 'var(--nelios-stroke)' }}
            >
              <p className="nelios-text-16-bold mb-2 text-nelios-black">Δεν βρέθηκαν αποτελέσματα</p>
              <p className="nelios-text-14 text-nelios-gray">Δοκιμάστε διαφορετικά φίλτρα</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {remainingItems > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="nelios-btn-outline px-8 py-3"
                  >
                    Δείτε περισσότερα ({remainingItems})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Same <Filters /> UI as the sidebar, but driven by draft* until Apply */}
      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onApply={applySheet}
        onResetAll={resetDraftFilters}
      >
        <Filters
          formId="sheet"
          sliderMin={0}
          sliderMax={sliderMax}
          priceMin={draftMin}
          priceMax={draftMax}
          onPriceMinChange={setDraftMin}
          onPriceMaxChange={setDraftMax}
          histogram={histogram}
          selectedStars={draftStars}
          onStarsChange={handleDraftStars}
          selectedNights={draftNights}
          onNightsChange={handleDraftNights}
          showMainTitle={false}
        />
      </FilterSheet>
    </div>
  );
}

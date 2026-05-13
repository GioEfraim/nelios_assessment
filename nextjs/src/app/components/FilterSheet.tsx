'use client';

// Mobile filter sheet: full-screen opaque shell; title row scrolls with filters; frosted “Εφαρμογή” over the list.

import Image from 'next/image';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import closeIcon from '@/assets/Vector 3.png';

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  children: React.ReactNode;
};

/** Space for the 80px bar + gap + home indicator — last rows stay scrollable above the chrome */
const SCROLL_END_PADDING =
  'calc(80px + 1.5rem + max(12px, env(safe-area-inset-bottom, 0px)))';

export default function FilterSheet({ open, onClose, onApply, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex w-full max-w-[100dvw] flex-col overflow-hidden overscroll-none bg-nelios-background md:hidden"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100dvh',
        height: '100dvh',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
    >
      <div className="relative flex w-full min-h-0 flex-1 flex-col overflow-hidden bg-nelios-background">
        {/* One scroll column: header + filters move together (not sticky) */}
        <div
          className="relative z-0 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch]"
          style={{
            paddingBottom: SCROLL_END_PADDING,
          }}
        >
          <div
            className="px-4"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}
          >
            <div className="flex w-full min-w-0 items-center justify-between gap-2 py-4">
              <h2 id="filter-sheet-title" className="nelios-h7 min-w-0 flex-1 truncate text-nelios-black">
                ΦΙΛΤΡΑ
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 backdrop-blur-[32px] transition-all duration-200 ease-out [-webkit-backdrop-filter:blur(32px)] hover:brightness-[1.03] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nelios-accent-blue)] focus-visible:ring-offset-2"
                  style={{
                    background: '#FFFFFFCC',
                    boxShadow: '0px 24px 32px -12px #00000080',
                  }}
                  aria-label="Κλείσιμο"
                >
                  <Image
                    src={closeIcon}
                    alt=""
                    width={12}
                    height={12}
                    className="block h-[12px] w-[12px] object-contain opacity-70 transition-[opacity,transform] duration-200 ease-out group-hover:scale-105 group-hover:opacity-100"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">{children}</div>
        </div>

        {/* Frosted apply — over scroll; sheet behind stays white so the underlying route does not show through */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pt-2"
          style={{
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div
            className="pointer-events-auto box-border flex h-20 w-full max-w-[328px] flex-col justify-center rounded-[12px] border border-solid px-4 backdrop-blur-[32px] [-webkit-backdrop-filter:blur(32px)]"
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              background: 'var(--translucent-bg, #ffffffcc)',
              borderColor: 'var(--nelios-stroke)',
            }}
          >
            <button type="button" className="nelios-btn-primary w-full py-2.5" onClick={onApply}>
              Εφαρμογή
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

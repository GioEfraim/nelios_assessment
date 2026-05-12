'use client';

// Mobile-only bottom sheet: dim backdrop, scrollable body, sticky “Apply” (Figma).

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  children: React.ReactNode;
};

export default function FilterSheet({ open, onClose, onApply, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
    >
      {/* Full-screen tap target to dismiss (doesn’t apply filters — that’s the green button) */}
      <button
        type="button"
        className="absolute inset-0 z-0 border-0 bg-[rgba(0,0,0,0.35)] cursor-pointer"
        aria-label="Κλείσιμο φίλτρων"
        onClick={onClose}
      />
      <div className="relative z-10 mt-auto flex max-h-[92vh] min-h-[50vh] flex-col rounded-t-2xl bg-nelios-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div
          className="flex shrink-0 items-center justify-between border-b px-4 py-4"
          style={{ borderColor: 'var(--nelios-stroke)' }}
        >
          <h2 id="filter-sheet-title" className="nelios-h7 text-nelios-black">
            ΦΙΛΤΡΑ
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-nelios-black transition-colors hover:bg-nelios-background"
            style={{ borderColor: 'var(--nelios-field-border)' }}
            aria-label="Κλείσιμο"
          >
            <span className="nelios-text-16 leading-none">✕</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </div>
        <div
          className="shrink-0 bg-nelios-white p-4 pt-2"
          style={{ borderTop: '1px solid var(--nelios-stroke)' }}
        >
          <button type="button" className="nelios-btn-primary w-full py-3" onClick={onApply}>
            Εφαρμογή
          </button>
        </div>
      </div>
    </div>
  );
}

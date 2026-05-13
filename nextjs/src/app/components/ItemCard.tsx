import { WPItem } from '@/lib/wordpress';

interface Props {
  item: WPItem;
}

// WP titles sometimes ship with markup — strip so we don’t need dangerouslySetInnerHTML.
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDaysNights(days: number, nights: number): string {
  const d = Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 0;
  const n = Number.isFinite(nights) ? Math.max(0, Math.floor(nights)) : 0;
  const dayPart = d === 1 ? '1 ημέρα' : `${d} ημέρες`;
  const nightPart = n === 1 ? '1 νύχτα' : `${n} νύχτες`;
  return `${dayPart} / ${nightPart}`;
}

export default function ItemCard({ item }: Props) {
  const { title, meta, featured_image_url } = item;
  const duration = formatDaysNights(meta.duration_days, meta.duration_nights);
  const titlePlain = stripHtml(title.rendered);
  const booking = typeof meta.booking_url === 'string' ? meta.booking_url.trim() : '';

  return (
    <article
      className="mx-auto flex h-[479px] w-[312px] max-w-full flex-col overflow-hidden rounded-[12px] border bg-[rgba(255,255,255,0.88)] shadow-[0px_24px_32px_-12px_#0000001A] backdrop-blur-[32px] transition-shadow duration-200"
      style={{ borderColor: 'var(--nelios-stroke)' }}
    >
      <div className="relative h-[275px] w-full max-w-[312px] shrink-0 overflow-hidden rounded-t-[12px]">
        {featured_image_url ? (
          <img
            src={featured_image_url}
            alt={titlePlain}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-nelios-background"
            style={{ color: 'var(--nelios-gray)' }}
          >
            <span className="nelios-text-14">Δεν υπάρχει εικόνα</span>
          </div>
        )}
      </div>

      <div className="box-border flex h-[204px] w-full max-w-[312px] shrink-0 flex-col gap-2 pt-5 px-6 pb-6">
        <p className="nelios-small-12 shrink-0 text-nelios-gray">{duration}</p>

        <h3
          className="nelios-h7 min-h-0 flex-1 break-words pb-1 text-nelios-black line-clamp-3 [overflow-wrap:anywhere]"
          style={{ lineHeight: 1.45 }}
        >
          {titlePlain}
        </h3>

        <div className="flex shrink-0 items-center justify-between gap-2">
          <div>
            <span className="nelios-small-12 uppercase text-nelios-gray">από </span>
            <span className="nelios-text-16-bold text-nelios-black">{meta.price}€</span>
          </div>
          <button
            type="button"
            className={`nelios-btn-primary shrink-0 px-4 py-2${booking ? '' : ' opacity-60'}`}
            disabled={!booking}
          >
            Κράτηση
          </button>
        </div>
      </div>
    </article>
  );
}

import { WPItem } from '@/lib/wordpress';

interface Props {
  item: WPItem;
}

// WP titles sometimes ship with markup — strip so we don’t need dangerouslySetInnerHTML.
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function ItemCard({ item }: Props) {
  const { title, meta, featured_image_url } = item;
  const duration = `${meta.duration_days} ημέρες / ${meta.duration_nights} νύχτα`;
  const titlePlain = stripHtml(title.rendered);
  const booking = typeof meta.booking_url === 'string' ? meta.booking_url.trim() : '';

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[10px] border bg-nelios-white transition-shadow duration-200 hover:shadow-md"
      style={{ borderColor: 'var(--nelios-stroke)' }}
    >
      {/* Featured image from REST (`featured_image_url` comes from the small WP plugin filter) */}
      <div className="relative h-48 w-full shrink-0">
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

      <div className="flex flex-1 flex-col p-4">
        {/* Meta: duration / title / price / booking CTA */}
        <p className="nelios-small-12 mb-1 text-nelios-gray">{duration}</p>

        <h3 className="nelios-h7 mb-3 min-h-[3.4rem] line-clamp-2 leading-snug text-nelios-black">{titlePlain}</h3>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="nelios-small-12 uppercase text-nelios-gray">από </span>
            <span className="nelios-text-16-bold text-nelios-black">{meta.price}€</span>
          </div>
          {/* booking_url is optional in WP — no link means disabled CTA */}
          {booking ? (
            <a
              href={booking}
              target="_blank"
              rel="noopener noreferrer"
              className="nelios-btn-primary shrink-0 px-4 py-2 no-underline"
            >
              Κράτηση
            </a>
          ) : (
            <button type="button" className="nelios-btn-primary shrink-0 px-4 py-2 opacity-60" disabled>
              Κράτηση
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

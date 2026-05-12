import type { FooterCtaPayload } from '@/lib/wordpress';

type Props = {
  data: FooterCtaPayload;
};

function PaperPlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bottom marketing CTA — copy + image from WordPress; layout in Next (Figma). */
export default function FooterCta({ data }: Props) {
  const { image_url, title, button_label, button_url } = data;

  return (
    <section className="relative z-[1] w-full px-4 mt-[10rem] mb-[10rem]">
      {/*
        Figma: 1320 × 468, radius 12px. Photo fills this inner frame (full width + height of the box) via object-cover.
      */}
      <div className="relative mx-auto h-[468px] w-full max-w-[1320px] overflow-hidden rounded-xl bg-nelios-black shadow-[0_8px_30px_rgba(15,23,42,0.12)] max-md:h-[min(468px,58vw)] max-md:min-h-[220px]">
        <img
          src={image_url}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-center opacity-100"
          loading="lazy"
          decoding="async"
        />
        {/* Light wash — Figma feels bright; keep only a soft bottom read for white type */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-100"
          aria-hidden
        />
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-5 px-6 text-center">
          <h2 className="nelios-h6 max-w-3xl text-nelios-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">{title}</h2>
          <a
            href={button_url}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-7 py-3 nelios-menu-item text-nelios-white opacity-100 transition-colors hover:bg-white/10"
          >
            {button_label}
            <PaperPlaneIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

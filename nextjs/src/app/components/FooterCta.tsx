import Image from 'next/image';
import type { FooterCtaPayload } from '@/lib/wordpress';
import sendIcon from '@/assets/send.png';

type Props = {
  data: FooterCtaPayload;
};

/** Bottom marketing CTA — copy + image from WordPress; layout in Next (Figma). */
export default function FooterCta({ data }: Props) {
  const { image_url, title, button_label, button_url } = data;

  return (
    <section className="relative z-[1] mt-[6rem] md:mt-[10rem] mb-[10rem] w-full px-4">
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-xl bg-nelios-black shadow-[0_8px_30px_rgba(15,23,42,0.12)] max-md:h-[492px] max-md:w-[328px] max-md:max-w-full max-md:rounded-[12px] md:h-[580px]">
        <img
          src={image_url}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-80"
          loading="lazy"
          decoding="async"
        />
        
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-100"
          aria-hidden
        />
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-5 px-6 text-center max-md:gap-2 max-md:px-4">
          <h2 className="nelios-h6 max-w-3xl text-nelios-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">{title}</h2>
          <a
            href={button_url}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-7 py-3 nelios-menu-item text-nelios-white opacity-100 transition-colors hover:bg-white/10"
          >
            {button_label}
            <Image
              src={sendIcon}
              alt=""
              width={18}
              height={18}
              className="block shrink-0"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </section>
  );
}

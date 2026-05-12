import Header from './components/Header';
import ItemsSection from './components/ItemsSection';
import FooterCta from './components/FooterCta';
import { getFooterCta, WPItem } from '@/lib/wordpress';

// Pull packages from WP REST (paginated — WP caps per_page at 100). Docker: nelios_wordpress.
async function getItems(): Promise<WPItem[]> {
  try {
    const all: WPItem[] = [];
    let page = 1;
    const perPage = 100;
    for (;;) {
      const res = await fetch(
        `http://nelios_wordpress/wp-json/wp/v2/items?per_page=${perPage}&page=${page}`,
        { next: { revalidate: 60 } }
      );
      if (!res.ok) break;
      const batch: WPItem[] = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      all.push(...batch);
      const totalPages = Number(res.headers.get('x-wp-totalpages') || '1');
      if (page >= totalPages) break;
      page += 1;
    }
    return all;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [items, footerCta] = await Promise.all([getItems(), getFooterCta()]);

  return (
    <main className="relative min-h-screen bg-nelios-background">
      {/* Top: hero + search bar (Figma) */}
      <Header />
      {/* Below: filters + package cards */}
      <ItemsSection initialItems={items} />
      {footerCta ? <FooterCta data={footerCta} /> : null}
    </main>
  );
}

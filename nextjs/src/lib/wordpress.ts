const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json/wp/v2';

/** Server-side Docker hostname; browser uses NEXT_PUBLIC_WP_API_URL host. */
const WP_INTERNAL_ORIGIN =
  process.env.WORDPRESS_INTERNAL_ORIGIN || 'http://nelios_wordpress';

export interface FooterCtaPayload {
  image_url: string;
  title: string;
  button_label: string;
  button_url: string;
}

export interface WPItem {
  id: number;
  title: { rendered: string };
  meta: {
    price: number;
    duration_days: number;
    duration_nights: number;
    location: string;
    hotel_stars: number;
    booking_url: string;
  };
  featured_image_url: string | null;
  'package-types': number[];
  destinations: number[];
}

export async function getItems(): Promise<WPItem[]> {
  const res = await fetch(`${WP_API_URL}/items?per_page=100&_embed`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function getPackageTypes() {
  const res = await fetch(`${WP_API_URL}/package-types`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getDestinations() {
  const res = await fetch(`${WP_API_URL}/destinations`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getFooterCta(): Promise<FooterCtaPayload | null> {
  try {
    const res = await fetch(`${WP_INTERNAL_ORIGIN}/wp-json/nelios/v1/footer-cta`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<FooterCtaPayload>;
  } catch {
    return null;
  }
}
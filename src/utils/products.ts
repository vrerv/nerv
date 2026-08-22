/**
 * Product / open source / membership directory shown on the home page.
 *
 * Copy lives in `public/locales/{ko,en}/home.json` under the same ids so both
 * locales stay in sync. Only structure (links, images, colors) is here.
 *
 * Tailwind class names must be written out in full — the JIT scanner reads this
 * file as text, so `text-${accent}-600` would never be generated.
 */

export type ProductStatus = 'live' | 'beta';

export type Product = {
  id: string;
  name: string;
  /** Used when the Korean name carries a Korean word (e.g. 댄스방). */
  nameEn?: string;
  href: string;
  image: string;
  status: ProductStatus;
  /** Fully-spelled Tailwind classes, per product accent color. */
  cardHover: string;
  badge: string;
  link: string;
};

export const FEATURED_PRODUCT: Product = {
  id: 'collavre',
  name: 'Collavre',
  href: 'https://collavre.com/landing',
  image: '/assets/images/products/collavre.webp',
  status: 'live',
  cardHover:
    'hover:border-primary-600/60 hover:shadow-xl hover:shadow-primary-600/5',
  badge:
    'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  link: 'text-primary-600 dark:text-primary-400',
};

export const PRODUCTS: Product[] = [
  {
    id: 'danvre',
    name: 'Danvre 댄스방',
    nameEn: 'Danvre',
    href: 'https://dance.vrerv.com',
    image: '/assets/images/products/dance.webp',
    status: 'beta',
    cardHover: 'hover:border-rose-500/60 hover:shadow-xl hover:shadow-rose-500/5',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400',
    link: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'tank',
    name: 'Tank Echo',
    href: 'https://tank.vrerv.com',
    image: '/assets/images/products/tank.webp',
    status: 'live',
    cardHover:
      'hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400',
    link: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'magic',
    name: 'Magic Duel: Prism',
    href: 'https://magic.vrerv.com',
    image: '/assets/images/products/magic.webp',
    status: 'beta',
    cardHover:
      'hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-500/5',
    badge:
      'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-400',
    link: 'text-violet-600 dark:text-violet-400',
  },
];

export const productName = (product: Product, locale?: string) =>
  locale === 'en' && product.nameEn ? product.nameEn : product.name;

export type Repo = {
  id: string;
  name: string;
  href: string;
  language: string;
};

export const GITHUB_ORG_URL = 'https://github.com/vrerv';

export const REPOS: Repo[] = [
  {
    id: 'rails_mcp_engine',
    name: 'rails_mcp_engine',
    href: 'https://github.com/vrerv/rails_mcp_engine',
    language: 'Ruby',
  },
  {
    id: 'md-to-notion',
    name: 'md-to-notion',
    href: 'https://github.com/vrerv/md-to-notion',
    language: 'TypeScript',
  },
  {
    id: 'openapi-markdown',
    name: 'openapi-markdown',
    href: 'https://github.com/vrerv/openapi-markdown',
    language: 'Python',
  },
  {
    id: 'cli-openai-proxy',
    name: 'cli-openai-proxy',
    // TODO: update once the repo is transferred to the vrerv org.
    href: 'https://github.com/sh1nj1/cli-openai-proxy',
    language: 'TypeScript',
  },
];

export type MembershipService = {
  id: string;
  href: string;
};

/**
 * Members-only services behind /membership. The authoritative list is the
 * Supabase `services` table (see `listServices()`), but that needs a session,
 * so the public home page lists the routes shipped in `src/pages/service/*`.
 * Keep both in sync when a service is added or removed.
 */
export const MEMBERSHIP_SERVICES: MembershipService[] = [
  { id: 'drawing', href: '/service/drawing' },
  { id: 'learn', href: '/service/learn' },
  { id: 'mentalcare', href: '/service/mentalcare' },
  { id: 'magic-is-coming', href: '/service/magic-is-coming' },
];

export const COMPANY_STATS = [
  { id: 'founded', value: '2022' },
  { id: 'repos', value: '14' },
  { id: 'services', value: '4' },
];

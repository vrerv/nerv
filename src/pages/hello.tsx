import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import {
  COMPANY_STATS,
  FEATURED_PRODUCT,
  GITHUB_ORG_URL,
  MEMBERSHIP_SERVICES,
  PRODUCTS,
  productName,
  REPOS,
} from '@/utils/products';
// @ts-ignore - plain JS module
import { getAllFilesFrontMatter } from '@/lib/mdx';
// @ts-ignore - plain JS module
import formatDate from '@/lib/utils/formatDate';

const LATEST_POST_COUNT = 3;

type Post = {
  slug: string;
  title: string;
  date: string | null;
  summary?: string;
  tags?: string[];
};

type IHelloProps = {
  posts: Post[];
  locale: string;
};

const Arrow = () => <span aria-hidden="true">&rarr;</span>;

const Hello = ({ posts, locale }: IHelloProps) => {
  const { t } = useTranslation('home');

  const statusLabel = (status: string) =>
    status === 'live' ? t('statusLive') : t('statusBeta');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VReRV',
    url: 'https://www.vrerv.com',
    logo: 'https://www.vrerv.com/assets/images/vrerv-logo.svg',
    foundingDate: '2022',
    description: t('metaDescription'),
    sameAs: [GITHUB_ORG_URL],
    makesOffer: [FEATURED_PRODUCT, ...PRODUCTS].map((product) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'SoftwareApplication',
        name: productName(product, locale),
        url: product.href,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
      },
    })),
  };

  return (
    <Main
      meta={
        <Meta
          title={t('metaTitle')}
          description={t('metaDescription')}
          jsonLd={jsonLd}
        />
      }
    >
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-ink-200/70 dark:border-ink-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,.10),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(245,158,11,.08),transparent_40%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 md:pt-24 md:pb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-[13px] font-medium text-primary-700 dark:border-primary-600/20 dark:bg-primary-600/10 dark:text-primary-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
            {t('heroBadge')}
          </span>
          <h1 className="mt-6 max-w-3xl text-[36px] font-bold leading-[1.12] tracking-tighter2 sm:text-[44px] md:text-[64px] md:leading-[1.08]">
            {t('heroTitleLine1')}
            <br />
            {t('heroTitleLine2')}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-600 sm:text-[18px] md:text-[20px] dark:text-ink-300">
            {t('heroBodyBefore')}
            <b className="font-semibold text-ink-900 dark:text-white">Collavre</b>
            {t('heroBodyAfter')}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={FEATURED_PRODUCT.href}
              className="inline-flex h-12 items-center rounded-lg bg-primary-600 px-6 font-medium text-white no-underline hover:bg-primary-700"
            >
              {t('heroPrimaryCta')}
            </a>
            <a
              href="#products"
              className="inline-flex h-12 items-center rounded-lg border border-ink-300 px-6 font-medium no-underline hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
            >
              {t('heroSecondaryCta')}
            </a>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-ink-500">
            <span className="text-[11px] uppercase tracking-widest">
              {t('heroStripLabel')}
            </span>
            {[FEATURED_PRODUCT, ...PRODUCTS].map((product) => (
              <span key={product.id} className="font-semibold text-ink-700 dark:text-ink-300">
                {productName(product, locale)}
              </span>
            ))}
            {REPOS.slice(0, 2).map((repo) => (
              <span key={repo.id} className="font-semibold text-ink-700 dark:text-ink-300">
                {repo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRODUCTS ---------- */}
      <section id="products" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 md:py-24">
        <h2 className="mb-10 text-[32px] font-bold tracking-tighter2 md:text-[38px]">
          {t('productsHeading')}
        </h2>

        <a
          href={FEATURED_PRODUCT.href}
          className={`group block overflow-hidden rounded-2xl border border-ink-200 no-underline transition dark:border-ink-800 ${FEATURED_PRODUCT.cardHover}`}
        >
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col p-8 sm:p-9 md:p-12">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-[18px] font-bold text-white">
                  C
                </span>
                <span className="text-[22px] font-semibold tracking-tighter2">
                  {FEATURED_PRODUCT.name}
                </span>
                <span
                  className={`ml-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${FEATURED_PRODUCT.badge}`}
                >
                  {statusLabel(FEATURED_PRODUCT.status)}
                </span>
              </div>
              <h3 className="mt-6 text-[24px] font-bold leading-snug tracking-tighter2 md:text-[30px]">
                {t('product.collavre.tagline')}
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-600 dark:text-ink-300">
                {t('product.collavre.body')}
              </p>
              <ul className="mt-6 space-y-2 text-[15px] text-ink-600 dark:text-ink-300">
                {['bullet1', 'bullet2', 'bullet3'].map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-primary-600" aria-hidden="true">
                      &rarr;
                    </span>
                    {t(`product.collavre.${key}`)}
                  </li>
                ))}
              </ul>
              <span
                className={`mt-8 inline-flex items-center gap-2 text-[15px] font-medium transition-all group-hover:gap-3 ${FEATURED_PRODUCT.link}`}
              >
                {t('product.collavre.cta')} <Arrow />
              </span>
            </div>
            <div className="relative min-h-[240px] border-ink-200 bg-ink-100 md:min-h-[380px] md:border-l dark:border-ink-800 dark:bg-ink-900">
              <Image
                src={FEATURED_PRODUCT.image}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </a>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={product.href}
              className={`group flex flex-col overflow-hidden rounded-2xl border border-ink-200 no-underline transition dark:border-ink-800 ${product.cardHover}`}
            >
              <div className="relative h-52 shrink-0 bg-ink-100 dark:bg-ink-900">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="text-[19px] font-semibold tracking-tighter2">
                    {productName(product, locale)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${product.badge}`}
                  >
                    {statusLabel(product.status)}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
                  {t(`product.${product.id}.body`)}
                </p>
                <span
                  className={`mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-medium transition-all group-hover:gap-3 ${product.link}`}
                >
                  {t(`product.${product.id}.cta`)} <Arrow />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- OPEN SOURCE ---------- */}
      <section
        id="opensource"
        className="scroll-mt-24 border-y border-ink-200/70 bg-ink-50 dark:border-ink-800 dark:bg-ink-900/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-bold tracking-tighter2 md:text-[38px]">
                {t('opensourceHeading')}
              </h2>
              <p className="mt-3 text-[17px] text-ink-600 dark:text-ink-300">
                {t('opensourceSubtitle')}
              </p>
            </div>
            <a
              href={GITHUB_ORG_URL}
              className="text-[15px] font-medium text-primary-600 no-underline hover:underline"
            >
              {t('opensourceAll')}
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPOS.map((repo) => (
              <a
                key={repo.id}
                href={repo.href}
                className="group flex flex-col rounded-xl border border-ink-200 bg-white p-5 no-underline transition hover:border-primary-600/50 dark:border-ink-800 dark:bg-ink-950"
              >
                <div className="font-mono text-[14px] font-semibold group-hover:text-primary-600">
                  {repo.name}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600 dark:text-ink-400">
                  {t(`repo.${repo.id}`)}
                </p>
                <div className="mt-auto pt-4 text-[12px] text-ink-500">{repo.language}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BLOG ---------- */}
      {posts.length > 0 && (
        <section id="blog" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 md:py-24">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[32px] font-bold tracking-tighter2 md:text-[38px]">
              {t('blogHeading')}
            </h2>
            <Link
              href="/blog"
              className="text-[15px] font-medium text-primary-600 no-underline hover:underline"
            >
              {t('blogAll')}
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <div className="text-[12px] uppercase tracking-widest text-ink-500">
                  {post.date ? formatDate(post.date, locale) : ''}
                  {post.tags?.[0] ? ` · ${post.tags[0]}` : ''}
                </div>
                <h3 className="mt-3 text-[19px] font-semibold leading-snug tracking-tighter2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="no-underline group-hover:text-primary-600"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.summary && (
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
                    {post.summary}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---------- COMPANY + MEMBERSHIP ---------- */}
      <section
        id="company"
        className="scroll-mt-24 border-t border-ink-200/70 bg-ink-50 dark:border-ink-800 dark:bg-ink-900/40"
      >
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="text-[32px] font-bold tracking-tighter2 md:text-[38px]">
              {t('companyHeading')}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-600 dark:text-ink-300">
              {t('companyBody')}
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-6">
              {COMPANY_STATS.map((stat) => (
                <div key={stat.id}>
                  <dt className="text-[13px] text-ink-500">{t(`stat.${stat.id}`)}</dt>
                  <dd className="mt-1 text-[22px] font-semibold tracking-tighter2">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col rounded-2xl border border-ink-200 bg-white p-8 sm:p-9 dark:border-ink-800 dark:bg-ink-950">
            <h3 className="text-[22px] font-semibold tracking-tighter2">
              {t('membershipHeading')}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              {t('membershipBody')}
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {MEMBERSHIP_SERVICES.map((service) => (
                <li key={service.id} className="flex items-baseline gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 -translate-y-px rounded-full bg-primary-600" />
                  <span>
                    <Link
                      href={service.href}
                      className="font-medium no-underline hover:text-primary-600"
                    >
                      {t(`service.${service.id}.name`)}
                    </Link>
                    <span className="text-ink-500"> — {t(`service.${service.id}.desc`)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/membership"
              className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-medium text-primary-600 no-underline transition-all hover:gap-3"
            >
              {t('membershipCta')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default Hello;

export async function getStaticProps({ locale }: { locale: string }) {
  const allPosts: Post[] = await getAllFilesFrontMatter('blog', locale);

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
      posts: allPosts.slice(0, LATEST_POST_COUNT),
      locale,
    },
  };
}

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useTranslation } from 'next-i18next';

import { AppConfig } from '@/utils/AppConfig';
import {
  FEATURED_PRODUCT,
  GITHUB_ORG_URL,
  PRODUCTS,
  productName,
} from '@/utils/products';

type IMainProps = {
  meta: ReactNode;
  children?: ReactNode;
};

const HOME_PATH = '/hello';
const STATUS_URL = 'https://vrerv.instatus.com/';

// Section anchors live on the home page, so link there explicitly — these have
// to work from /blog and /membership too.
const NAV = [
  { key: 'navProducts', href: `${HOME_PATH}#products` },
  { key: 'navOpensource', href: `${HOME_PATH}#opensource` },
  { key: 'blog', href: '/blog' },
  { key: 'navCompany', href: `${HOME_PATH}#company` },
];

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
  </svg>
);

const Main = (props: IMainProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // Theme is only known on the client; render the light logo until it resolves
  // so server and first client render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoImage = isDark
    ? '/assets/images/vrerv-logo-light-blue.svg'
    : '/assets/images/vrerv-logo.svg';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const otherLocales = router.locales?.filter((l) => l !== router.locale) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      {props.meta}

      <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link href={HOME_PATH} className="flex shrink-0 items-center gap-2 no-underline">
            <Image src={logoImage} alt={AppConfig.title} width={26} height={26} />
            <span className="text-[17px] font-semibold tracking-tighter2">{AppConfig.title}</span>
          </Link>

          <nav className="hidden items-center gap-1 text-[15px] text-ink-600 md:flex dark:text-ink-300">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-3 py-2 no-underline hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label={t('toggleTheme')}
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            {otherLocales.map((locale) => (
              <Link
                key={locale}
                href={router.asPath}
                locale={locale}
                className="hidden h-9 items-center rounded-md px-2.5 text-[13px] text-ink-500 no-underline hover:bg-ink-100 sm:inline-flex dark:hover:bg-ink-800"
              >
                {locale.toUpperCase()}
              </Link>
            ))}
            <a
              href={FEATURED_PRODUCT.href}
              className="inline-flex h-9 items-center rounded-md bg-primary-600 px-3 text-[14px] font-medium text-white no-underline hover:bg-primary-700 sm:px-4"
            >
              {t('ctaCollavre')}
            </a>
          </div>
        </div>

        {/* Mobile nav — a scrollable row instead of a drawer, so it needs no JS. */}
        <nav className="flex gap-1 overflow-x-auto border-t border-ink-200/70 px-4 py-1.5 text-[14px] text-ink-600 md:hidden dark:border-ink-800 dark:text-ink-300">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 no-underline hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </header>

      <main className="grow">{props.children}</main>

      <footer className="border-t border-ink-200/70 dark:border-ink-800">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 text-[14px] sm:px-6 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image src={logoImage} alt="" width={22} height={22} />
              <span className="font-semibold tracking-tighter2">{AppConfig.title}</span>
            </div>
            <p className="mt-3 leading-relaxed text-ink-500">{t('footerTagline')}</p>
          </div>

          <div>
            <div className="mb-3 font-semibold">{t('footerProducts')}</div>
            <ul className="space-y-2 text-ink-600 dark:text-ink-400">
              {[FEATURED_PRODUCT, ...PRODUCTS].map((product) => (
                <li key={product.id}>
                  <a className="no-underline hover:text-primary-600" href={product.href}>
                    {productName(product, router.locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 font-semibold">{t('footerDevelopers')}</div>
            <ul className="space-y-2 text-ink-600 dark:text-ink-400">
              <li>
                <a className="no-underline hover:text-primary-600" href={GITHUB_ORG_URL}>
                  GitHub
                </a>
              </li>
              <li>
                <Link className="no-underline hover:text-primary-600" href="/blog">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link className="no-underline hover:text-primary-600" href={`${HOME_PATH}#opensource`}>
                  {t('navOpensource')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-semibold">{t('footerCompany')}</div>
            <ul className="space-y-2 text-ink-600 dark:text-ink-400">
              <li>
                <Link className="no-underline hover:text-primary-600" href={`${HOME_PATH}#company`}>
                  {t('footerAbout')}
                </Link>
              </li>
              <li>
                <Link className="no-underline hover:text-primary-600" href="/membership">
                  {t('membership')}
                </Link>
              </li>
              <li>
                <a className="no-underline hover:text-primary-600" href={STATUS_URL}>
                  {t('footerStatus')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-semibold">{t('footerLanguage')}</div>
            <ul className="space-y-2 text-ink-600 dark:text-ink-400">
              {router.locales?.map((locale) => (
                <li key={locale}>
                  <Link
                    className="no-underline hover:text-primary-600"
                    href={router.asPath}
                    locale={locale}
                  >
                    {locale === 'ko' ? '한국어' : 'English'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-200/70 dark:border-ink-800">
          <div className="mx-auto max-w-6xl px-4 py-6 text-[13px] text-ink-500 sm:px-6">
            © {new Date().getFullYear()} {AppConfig.title}. {t('footerRights')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export { Main };

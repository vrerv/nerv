import '../styles/global.css';
import '../styles/prism.css';

import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'jotai';
import React from 'react';

import { GoogleAnalyticsScripts } from '@/components/GoogleAnalyticsScripts';
import { Toaster } from '@/components/ui/toaster';

const WithAuth = dynamic(
  () => import('@/components/with-auth').then(({ WithAuth: AuthGuard }) => AuthGuard),
  { ssr: false }
);

const PUBLIC_ROUTES = [
  '/',
  '/_error',
  '/hello',
  '/blog',
  '/blog/[...slug]',
  '/membership',
  '/membership/auth/[slug]',
  '/membership/auth/reset-password',
];

const AUTH_PATH = '/membership/auth/login';
const AUTH_CALLBACK_ROUTES = ['/membership'];

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
  const initializesAuth = AUTH_CALLBACK_ROUTES.includes(router.pathname);
  const page = (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Component {...pageProps} />
      <GoogleAnalyticsScripts gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      <Toaster />
    </ThemeProvider>
  );
  const content = !isPublicRoute || initializesAuth ? (
    <WithAuth
      authPath={AUTH_PATH}
      locale={pageProps.locale}
      requireAuth={!isPublicRoute}
    >
      {page}
    </WithAuth>
  ) : (
    page
  );

  return <Provider>{content}</Provider>;
};

export default appWithTranslation(MyApp);

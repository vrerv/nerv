import '../styles/global.css';
import '../styles/prism.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
// @ts-ignore
import { Mermaid } from '@/components/Mermaid';
import { GoogleAnalyticsScripts } from "@/components/GoogleAnalyticsScripts";
import React from "react";
import { appWithTranslation } from 'next-i18next'
import { WithAuth } from "@/components/with-auth";
import { Provider } from "jotai";
import { Toaster } from "@/components/ui/toaster"

const PUBLIC_ROUTES = [
  '/',
  '/_error',
  '/hello',
  '/blog',
  '/blog/[...slug]',
  '/hangul-game',
  '/membership',
  '/membership/auth/[slug]',
  '/membership/auth/reset-password',
];

const MyApp = ({ Component, pageProps }: AppProps) => (

  <Provider>
    <WithAuth whiteList={PUBLIC_ROUTES} authPath={'/membership/auth/login'} locale={pageProps.locale}>
      {/* @ts-ignore */}
      <ThemeProvider attribute="class" defaultTheme="system">
        <Component {...pageProps} />
        <GoogleAnalyticsScripts gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        <Toaster />
      </ThemeProvider>
    </WithAuth>
  </Provider>
);

export default appWithTranslation(MyApp);

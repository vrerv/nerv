import '../styles/global.css';
import '../styles/prism.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
// @ts-ignore
import { Mermaid } from '@/components/Mermaid';
import { GoogleAnalyticsScripts } from "@/components/GoogleAnalyticsScripts";
import React from "react";
import { appWithTranslation } from 'next-i18next'

const MyApp = ({ Component, pageProps }: AppProps) => (

  <ThemeProvider attribute="class" defaultTheme="system">
    <Component {...pageProps} />
    <GoogleAnalyticsScripts gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
  </ThemeProvider>
);

export default appWithTranslation(MyApp);

import '../styles/global.css';
import '../styles/prism.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
// @ts-ignore
import { Mermaid } from '../components/Mermaid';
import React from "react";
import Script from "next/script";

const MyApp = ({ Component, pageProps }: AppProps) => (

  <ThemeProvider attribute="class" defaultTheme="system">
    <Component {...pageProps} />
    {/* Following nextjs doc - https://nextjs.org/docs/messages/next-script-for-ga */}
    <div>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></Script>
      <Script id="google-analytics">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `}
      </Script>
    </div>
  </ThemeProvider>
);

export default MyApp;

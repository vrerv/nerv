import '../styles/global.css';
import '../styles/prism.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
// @ts-ignore
import { Mermaid } from '../components/Mermaid';

const MyApp = ({ Component, pageProps }: AppProps) => (

  <ThemeProvider attribute="class" defaultTheme="system">
    <Component {...pageProps} />
  </ThemeProvider>
);

export default MyApp;

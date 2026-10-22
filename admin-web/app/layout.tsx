import type { Metadata } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import type { ReactNode } from 'react';
import lockupPrimary from '../../shared/brand/logo/png/derived/cuidance-logo-primary-lockup.png';
import lockupReversed from '../../shared/brand/logo/png/derived/cuidance-logo-primary-lockup-reversed.png';
import '../../shared/design-tokens/tokens.css';
import './globals.css';

// Weights match the design system board: Newsreader 400, Archivo 400 / 500 / 600
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-newsreader',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cuidance Admin Web',
  description: 'Internal support tool for the Cuidance team.',
  // Internal tool: keep it out of search results
  robots: { index: false, follow: false },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body>
        <header className="app-header">
          {/* Team 03 approved v04 derived lockups: Grounded Green on light, Quiet Paper on dark */}
          <picture>
            <source srcSet={lockupReversed.src} media="(prefers-color-scheme: dark)" />
            <img
              className="app-logo"
              src={lockupPrimary.src}
              width={lockupPrimary.width}
              height={lockupPrimary.height}
              alt="Cuidance"
            />
          </picture>
        </header>
        {children}
      </body>
    </html>
  );
}

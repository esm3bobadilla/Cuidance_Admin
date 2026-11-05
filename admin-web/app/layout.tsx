import type { Metadata } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import type { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { themeBootScript } from '../../shared/content/theme';
import favicon16 from '../../shared/brand/logo/png/derived/cuidance-favicon-16x16.png';
import favicon32 from '../../shared/brand/logo/png/derived/cuidance-favicon-32x32.png';
import favicon48 from '../../shared/brand/logo/png/derived/cuidance-favicon-48x48.png';
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
  // Team 03 approved derived favicons (png/derived/), used as supplied
  icons: {
    icon: [favicon16, favicon32, favicon48].map((icon) => ({
      url: icon.src,
      sizes: `${icon.width}x${icon.height}`,
      type: 'image/png',
    })),
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // suppressHydrationWarning: the theme script below may set data-theme on <html> before React loads
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved Light or Dark choice before the page draws */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="app">
          <Sidebar
            logo={
              /* Team 03 approved v04 derived lockups. The sidebar is Grounded Green in the light
                 theme, so it takes the Quiet Paper reversed lockup; in the dark theme the brand
                 color is light, so it takes the Grounded Green lockup. CSS in globals.css shows
                 the one that matches the chosen theme (System, Light or Dark). */
              <>
                <img
                  className="app-logo app-logo-light-theme"
                  src={lockupReversed.src}
                  width={lockupReversed.width}
                  height={lockupReversed.height}
                  alt="Cuidance"
                />
                <img
                  className="app-logo app-logo-dark-theme"
                  src={lockupPrimary.src}
                  width={lockupPrimary.width}
                  height={lockupPrimary.height}
                  alt="Cuidance"
                />
              </>
            }
          />
          <div className="app-column">
            <TopBar />
            <div id="main-content" className="app-main" tabIndex={-1}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

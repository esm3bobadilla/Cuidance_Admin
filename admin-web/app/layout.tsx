import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

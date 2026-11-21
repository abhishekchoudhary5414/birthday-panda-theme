import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Ditvi's 1st Birthday | Cute Panda & Bamboo Celebration",
  description:
    "Join us for Ditvi's 1st Birthday Celebration in the Bamboo Grove! Explore memories, play interactive panda games, pick fortunes, and RSVP.",
  keywords: [
    'Panda Birthday',
    'Bamboo Forest',
    'Baby Birthday',
    '1st Birthday Celebration',
    'Panda Party',
    'Birthday RSVP',
    'Ditvi Birthday',
  ],
  authors: [{ name: 'The Family' }],
  openGraph: {
    title: "Ditvi's 1st Birthday | Cute Panda & Bamboo Celebration",
    description:
      "Join us for a magical day filled with happiness, laughter, bamboo and unforgettable memories!",
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#789B63',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐼</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}

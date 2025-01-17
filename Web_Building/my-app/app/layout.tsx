import type { Metadata } from 'next'
import './styles.css';

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    title: 'LotusWav.es',
    capable: true,
    statusBarStyle: 'default'
  }
}


// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
            <head>
        <meta name="apple-mobile-web-app-title" content="LotusWav.es" />
      </head>
      <body>{children}</body>
    </html>
  );
}
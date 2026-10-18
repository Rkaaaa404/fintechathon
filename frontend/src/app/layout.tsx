import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PWARegister } from '@/components/shell/PWARegister';

export const metadata: Metadata = {
  title: 'AegisPath — AI Agent Digital Wallet',
  description:
    'AegisPath is an AI agent that sends money and pays tuition across borders for international students with safety enforced outside the language model.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AegisPath',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#3D6BEA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}


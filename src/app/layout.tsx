import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Looca - Voice AI Intelligence',
  description: 'Your voice-first personal action AI for accessibility, guidance, and real-world tasks.',
  manifest: '/manifest.json',
  themeColor: '#000000',
  icons: {
    icon: '/l.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

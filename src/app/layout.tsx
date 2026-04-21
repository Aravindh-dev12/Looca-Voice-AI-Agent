import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Looca — AGI Voice Architecture',
  description: 'Voice-first AGI connectivity platform. Cognitive Mesh, USSD-Voice Hybrid, Phantom Signal. Built for GeeBlr Hack 2026.',
  icons: {
    icon: '/l.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

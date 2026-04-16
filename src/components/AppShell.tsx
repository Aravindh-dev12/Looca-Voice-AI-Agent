'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/agent', label: 'Assistant' },
  { href: '/knowledge', label: 'Knowledge Base' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <Link href="/" className="brand">
            <img src="/l.png" alt="Looca" width={44} height={44} style={{ borderRadius: '14px' }} />
            <div>
              <h1>Looca Voice AI</h1>
              <p>Accessibility-first voice assistant platform</p>
            </div>
          </Link>

          <nav className="nav">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname === item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}

        <footer>
          Built for inclusive voice support across healthcare, public services, and education.
        </footer>
      </div>
    </div>
  );
}

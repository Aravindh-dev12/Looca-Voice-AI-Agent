'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { AuthModal } from './AuthModal';

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/agent', label: 'Voice Agent' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/upgrade', label: 'Upgrade' },
  { href: '/knowledge', label: 'Knowledge' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <Link href="/" className="brand">
            <img src="/l.png" alt="Looca" width={44} height={44} style={{ borderRadius: '14px' }} />
            <div>
              <h1>Looca</h1>
              <p>Voice-first personal action intelligence</p>
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

          <div className="auth-area">
            {loading ? (
              <div className="auth-loading" />
            ) : user ? (
              <div className="profile-menu">
                <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  {user.image ? (
                    <img src={user.image} alt={user.name || 'User'} width={32} height={32} style={{ borderRadius: '50%' }} />
                  ) : (
                    <div className="profile-avatar">{(user.name || user.email || 'U')[0].toUpperCase()}</div>
                  )}
                  <span className="profile-name">{user.name || user.email?.split('@')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <Link href="/agent" className="profile-dropdown-item" onClick={() => setProfileOpen(false)}>
                      Voice Agent
                    </Link>
                    <button className="profile-dropdown-item logout" onClick={() => { logout(); setProfileOpen(false); }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setAuthOpen(true)}>
                Sign In
              </button>
            )}
          </div>
        </header>

        {children}

        <footer>
          Built for GeeBlr Hack 2026 voice architecture for societal impact.
        </footer>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

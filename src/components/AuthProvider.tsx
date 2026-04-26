'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
});

function AuthInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('looca_token');
      
      // If we have a Google session but no backend token, sync it
      if (!token && session?.user?.email) {
        const { api } = await import('@/lib/api');
        try {
          const syncRes = await api.syncGoogle({
            name: session.user.name || '',
            email: session.user.email,
            image: session.user.image || undefined,
          });
          localStorage.setItem('looca_token', syncRes.access_token);
          setUser(syncRes.user);
          return;
        } catch (syncErr) {
          console.error('Google sync failed:', syncErr);
        }
      }

      if (!token) {
        setUser(session?.user ? {
          id: (session.user as any).id || '',
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: (session.user as any).role,
        } : null);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const profileRes = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if response is JSON before parsing
      const contentType = profileRes.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Backend error: Expected JSON but got ${contentType}. Is the backend running at ${apiUrl}?`);
        // Don't clear token, just use session user if available
        setUser(session?.user ? {
          id: (session.user as any).id || '',
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: (session.user as any).role,
        } : null);
        return;
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
      } else if (profileRes.status === 401) {
        localStorage.removeItem('looca_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      refreshUser().finally(() => setIsInitializing(false));
    } else if (status === 'unauthenticated') {
      setUser(null);
      setIsInitializing(false);
    } else {
      setIsInitializing(status === 'loading');
    }
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isInitializing,
        logout: () => {
          localStorage.removeItem('looca_token');
          signOut({ callbackUrl: '/' });
        },
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthInner>{children}</AuthInner>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

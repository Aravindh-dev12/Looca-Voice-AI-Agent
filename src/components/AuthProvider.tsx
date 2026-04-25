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
      if (!token) {
        setUser({
          id: (session?.user as { id?: string } | undefined)?.id ?? '',
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
          role: (session?.user as { role?: string } | undefined)?.role,
        });
        return;
      }

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
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

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import {
  AuthUser,
  confirmSignUp,
  restoreAuthUser,
  signIn,
  signOut,
  signUp,
} from '@/features/auth/services/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<boolean>;
  confirmSignUp: (email: string, confirmationCode: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void restoreAuthUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signUp: async (email, password) => {
        const result = await signUp(email, password);
        return result.isSignUpComplete;
      },
      confirmSignUp,
      signIn: async (email, password) => {
        setUser(await signIn(email, password));
      },
      signOut: async () => {
        await signOut();
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

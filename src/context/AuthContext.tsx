/**
 * Global authentication state.
 *
 * Exposes the current user plus auth actions to the whole component tree.
 * Screens consume this via the `useAuth()` hook and never talk to the
 * auth service directly, keeping UI and data concerns separated.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabase';
import type { ActivityCategory, LoginInput, RegisterInput, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  /** True while restoring a persisted session on launch. */
  initializing: boolean;
  /** True while a login/register/logout/update request is in flight. */
  loading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; bio?: string; interests?: ActivityCategory[] }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore session on launch
    authService.getSession().then((s) => {
      setUser(s?.user ?? null);
      setInitializing(false);
    });

    // Keep auth state in sync (token refresh, sign-out from another device, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        return;
      }
      const s = await authService.getSession();
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setLoading(true);
    try {
      const session = await authService.register(input);
      setUser(session.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true);
    try {
      const session = await authService.login(input);
      setUser(session.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: {
    name?: string;
    bio?: string;
    interests?: ActivityCategory[];
  }) => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, loading, register, login, logout, updateProfile }),
    [user, initializing, loading, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  fastag_wallet_balance: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isSupabaseConnected: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string, city?: string, state?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Fetch or create profile from Supabase
  const fetchProfile = async (userId: string, email?: string, userMeta?: any) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile from Supabase:', error.message);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if missing
        const newProfile = {
          id: userId,
          full_name: userMeta?.full_name || email?.split('@')[0] || 'AutoSphere Member',
          phone: userMeta?.phone || '',
          city: userMeta?.city || 'Bengaluru',
          state: userMeta?.state || 'Karnataka',
          fastag_wallet_balance: 1500,
        };

        const { data: inserted, error: insertErr } = await (supabase
          .from('profiles') as any)
          .insert([newProfile])
          .select()
          .single();

        if (!insertErr && inserted) {
          setProfile(inserted);
        }
      }
    } catch (err) {
      console.error('Failed to resolve user profile:', err);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        // When running in local mode, default to logged out so user explicitly signs in or registers
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsGuest(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session retrieval error:', error);
        }

        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsGuest(false);
            await fetchProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata);
          } else {
            setUser(null);
            setSession(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          setIsGuest(false);
          localStorage.removeItem('autosphere_guest_mode');
          await fetchProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata);
        } else if (!isGuest) {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 1. Sign Up with Email/Password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    city = 'Bengaluru',
    state = 'Karnataka'
  ): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Create authenticated user record from submitted form values
        const localUserId = `usr-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const newUser: User = {
          id: localUserId,
          app_metadata: {},
          user_metadata: { full_name: fullName, phone: phone || '', city, state },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
          role: 'authenticated',
          updated_at: new Date().toISOString(),
        };
        setUser(newUser);
        setProfile({
          id: localUserId,
          full_name: fullName,
          phone: phone || '',
          city,
          state,
          avatar_url: '',
          fastag_wallet_balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsGuest(false);
        return { error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
            city,
            state,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, email, { full_name: fullName, phone, city, state });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Sign In with Email/Password
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Authenticate with the user's submitted email credentials
        const localUserId = `usr-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const userObj: User = {
          id: localUserId,
          app_metadata: {},
          user_metadata: {
            full_name: email.split('@')[0],
            email,
          },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
          role: 'authenticated',
          updated_at: new Date().toISOString(),
        };
        setUser(userObj);
        setProfile({
          id: localUserId,
          full_name: email.split('@')[0],
          phone: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          avatar_url: '',
          fastag_wallet_balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsGuest(false);
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Sign Out
  const signOut = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('autosphere_guest_mode');
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsGuest(false);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Forgot / Reset Password Request
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      if (!isSupabaseConfigured) {
        return { error: null };
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 5. Update Password
  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      if (!isSupabaseConfigured) {
        return { error: null };
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthenticated: !!user,
        isGuest,
        isSupabaseConnected: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

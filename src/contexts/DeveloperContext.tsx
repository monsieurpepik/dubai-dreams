import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Developer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_merchant: boolean;
  subscription_tier: string;
}

interface MerchantUser {
  id: string;
  user_id: string;
  developer_id: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface DeveloperContextValue {
  user: User | null;
  session: Session | null;
  merchantUser: MerchantUser | null;
  developer: Developer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: 'admin' | 'editor' | 'viewer') => boolean;
  canEdit: boolean;
  canManageTeam: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshDeveloperData: () => Promise<void>;
}

const DeveloperContext = createContext<DeveloperContextValue | undefined>(undefined);

export function DeveloperProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [merchantUser, setMerchantUser] = useState<MerchantUser | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeveloperData = useCallback(async (userId: string) => {
    try {
      // Fetch merchant user record
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchant_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (merchantError) {
        console.error('Error fetching merchant user:', merchantError);
        return;
      }

      if (merchantData) {
        setMerchantUser(merchantData as MerchantUser);

        // Fetch developer details
        const { data: devData, error: devError } = await supabase
          .from('developers')
          .select('id, name, slug, logo_url, is_merchant, subscription_tier')
          .eq('id', merchantData.developer_id)
          .single();

        if (devError) {
          console.error('Error fetching developer:', devError);
        } else if (devData) {
          setDeveloper(devData as Developer);
        }
      }
    } catch (err) {
      console.error('Error in fetchDeveloperData:', err);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchDeveloperData(session.user.id);
          }, 0);
        } else {
          setMerchantUser(null);
          setDeveloper(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchDeveloperData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchDeveloperData]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/developer/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMerchantUser(null);
    setDeveloper(null);
  };

  const refreshDeveloperData = async () => {
    if (user) {
      await fetchDeveloperData(user.id);
    }
  };

  const hasRole = (role: 'admin' | 'editor' | 'viewer') => {
    if (!merchantUser) return false;
    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
    return roleHierarchy[merchantUser.role] >= roleHierarchy[role];
  };

  const value: DeveloperContextValue = {
    user,
    session,
    merchantUser,
    developer,
    isLoading,
    isAuthenticated: !!user && !!merchantUser,
    hasRole,
    canEdit: hasRole('editor'),
    canManageTeam: hasRole('admin'),
    signIn,
    signUp,
    signOut,
    refreshDeveloperData,
  };

  return (
    <DeveloperContext.Provider value={value}>
      {children}
    </DeveloperContext.Provider>
  );
}

export function useDeveloper() {
  const context = useContext(DeveloperContext);
  if (context === undefined) {
    throw new Error('useDeveloper must be used within a DeveloperProvider');
  }
  return context;
}

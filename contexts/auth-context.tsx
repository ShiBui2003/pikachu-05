'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { cookieFix } from '@/lib/cookie-fix'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: Error }>
  signOut: () => Promise<{ error?: Error }>
  signInWithGoogle: (userType?: 'admin' | 'citizen') => Promise<{ error?: Error }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Get the current path to prevent unnecessary redirects
      const currentPath = window.location.pathname;
      
      // Handle auth state changes
      if (event === 'SIGNED_IN' && session?.user) {
        const role = session.user.user_metadata?.role || session.user.role || 'citizen';
        
        // Determine redirect based on current path and role
        if (currentPath.startsWith('/admin/login') || currentPath.startsWith('/admin/signup')) {
          // If logging in from admin pages, go to admin dashboard regardless of role
          router.push('/admin/dashboard');
        } else if (currentPath.startsWith('/citizen/login') || currentPath.startsWith('/citizen/signup')) {
          // If logging in from citizen pages, go to citizen dashboard
          router.push('/citizen/dashboard');
        } else if (role === 'admin' && !currentPath.startsWith('/admin')) {
          router.push('/admin/dashboard');
        } else if ((role === 'citizen' || !role) && !currentPath.startsWith('/citizen')) {
          router.push('/citizen/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        // Only redirect if not already on a public route
        if (!['/citizen/login', '/admin/login', '/'].includes(currentPath)) {
          router.push('/');
        }
      }
    });

    // Check active session on initial load
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setUser(session?.user ?? null);
        
        // Handle initial redirect based on session and role
        if (session?.user) {
          const role = session.user.user_metadata?.role || session.user.role || 'citizen';
          const currentPath = window.location.pathname;
          
          // Don't redirect if already on a valid route for the user's role
          if (currentPath.startsWith('/admin/login') || currentPath.startsWith('/admin/signup')) {
            // If on admin login/signup pages, go to admin dashboard
            router.push('/admin/dashboard');
          } else if (currentPath.startsWith('/citizen/login') || currentPath.startsWith('/citizen/signup')) {
            // If on citizen login/signup pages, go to citizen dashboard
            router.push('/citizen/dashboard');
          } else if (role === 'admin' && !currentPath.startsWith('/admin')) {
            router.push('/admin/dashboard');
          } else if ((role === 'citizen' || !role) && !currentPath.startsWith('/citizen')) {
            router.push('/citizen/dashboard');
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error ? new Error(error.message) : undefined }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'citizen',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error: error ? new Error(error.message) : undefined }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      // Use cookie fix utility for comprehensive cleanup
      cookieFix.clearSupabaseCookies();
      cookieFix.clearAuthStorage();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Force a hard redirect to ensure all state is cleared
      if (typeof window !== 'undefined') {
        window.location.href = '/';
        // Prevent any further execution after redirect
        await new Promise(() => {});
      }
      
      return { error: error ? new Error(error.message) : undefined };
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, try to reset auth completely
      await cookieFix.resetAuth();
      return { error: error as Error };
    }
  }
  
  const signInWithGoogle = async (userType: 'admin' | 'citizen' = 'citizen') => {
    try {
      // First, start the OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?user_type=${userType}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      return { error: undefined };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { error: error as Error };
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

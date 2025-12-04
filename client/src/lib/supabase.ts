import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let configPromise: Promise<{ url: string; anonKey: string }> | null = null;
let initError: Error | null = null;

async function fetchSupabaseConfig(): Promise<{ url: string; anonKey: string }> {
  const response = await fetch('/api/config/supabase');
  if (!response.ok) {
    throw new Error('Failed to fetch Supabase config from server');
  }
  return response.json();
}

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  if (initError) {
    throw initError;
  }
  
  if (!configPromise) {
    configPromise = fetchSupabaseConfig();
  }
  
  try {
    const config = await configPromise;
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    initError = error as Error;
    configPromise = null;
    throw error;
  }
}

export function getSupabaseSync(): SupabaseClient | null {
  return supabaseInstance;
}

export async function initializeSupabase(): Promise<void> {
  await getSupabaseClient();
}

export async function signInWithGoogle() {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
  
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const client = await getSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const client = await getSupabaseClient();
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Failed to get Supabase client:', error);
    return null;
  }
}

export async function syncSessionWithBackend() {
  const session = await getSession();
  if (!session) return null;
  
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Session sync error:', error);
    return null;
  }
}

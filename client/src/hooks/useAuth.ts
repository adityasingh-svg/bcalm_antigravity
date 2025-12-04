import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient, signOut as supabaseSignOut, syncSessionWithBackend } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  current_status: string | null;
  target_role: string | null;
  years_experience: number | null;
  onboarding_status: string | null;
  personalization_quality: string | null;
}

interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  currentStatus: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  onboardingStatus: string | null;
  personalizationQuality: string | null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    async function initAuth() {
      try {
        const client = await getSupabaseClient();
        setClientReady(true);

        const { data: { session } } = await client.auth.getSession();
        setSupabaseUser(session?.user ?? null);
        if (session) {
          syncSessionWithBackend();
        }
        setSessionChecked(true);

        const { data: { subscription: sub } } = client.auth.onAuthStateChange(async (event, session) => {
          setSupabaseUser(session?.user ?? null);
          if (session) {
            await syncSessionWithBackend();
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            queryClient.invalidateQueries({ queryKey: ["/api/me"] });
          } else {
            queryClient.clear();
          }
        });
        subscription = sub;
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setSessionChecked(true);
      }
    }

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  const { data: profile, isLoading: profileLoading, error } = useQuery<Profile>({
    queryKey: ["/api/auth/user"],
    enabled: !!supabaseUser && sessionChecked && clientReady,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const is401 = error?.message?.includes("401") || error?.message?.includes("Unauthorized");

  const user: AuthUser | null = profile && !is401 ? {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    profileImageUrl: profile.avatar_url,
    currentStatus: profile.current_status,
    targetRole: profile.target_role,
    yearsExperience: profile.years_experience,
    onboardingStatus: profile.onboarding_status,
    personalizationQuality: profile.personalization_quality,
  } : null;

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error('Backend logout error:', e);
    }
    await supabaseSignOut();
    queryClient.clear();
  }, [queryClient]);

  return {
    user,
    isLoading: !sessionChecked || !clientReady || (!!supabaseUser && profileLoading && !is401),
    isAuthenticated: !!supabaseUser && !!profile && !is401,
    error: is401 ? null : error,
    logout,
    supabaseUser,
  };
}

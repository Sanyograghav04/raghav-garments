"use client";

import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "customer" | "admin";
  avatar_url?: string;
};

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  initialized: false,

  initialize: async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        set({
          user: session.user,
          profile: profile || {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || "",
            role: "customer",
          },
          session,
          isLoading: false,
          initialized: true,
        });
      } else {
        set({ user: null, profile: null, session: null, isLoading: false, initialized: true });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", newSession.user.id)
            .single();

          set({
            user: newSession.user,
            profile: profile || {
              id: newSession.user.id,
              email: newSession.user.email || "",
              full_name: newSession.user.user_metadata?.full_name || "",
              role: "customer",
            },
            session: newSession,
            isLoading: false,
          });
        } else {
          set({ user: null, profile: null, session: null, isLoading: false });
        }
      });
    } catch {
      set({ isLoading: false, initialized: true });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error: error.message };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      set({
        user: data.user,
        profile: profile || {
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name || "",
          role: "customer",
        },
        session: data.session,
        isLoading: false,
      });

      return {};
    } catch (err: unknown) {
      set({ isLoading: false });
      return { error: err instanceof Error ? err.message : "An unexpected error occurred" };
    }
  },

  signUpWithEmail: async (email, password, fullName) => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "customer",
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return {};
    } catch (err: unknown) {
      set({ isLoading: false });
      return { error: err instanceof Error ? err.message : "An unexpected error occurred" };
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null, isLoading: false });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      set({ profile });
    }
  },
}));

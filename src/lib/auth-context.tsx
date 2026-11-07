import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setDisplayName: (displayName: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  const displayName = user.user_metadata?.display_name;
  return {
    id: user.id,
    email: user.email ?? "",
    displayName: typeof displayName === "string" ? displayName : "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      receivedAuthEvent = true;
      setUser(toAuthUser(session?.user ?? null));
      setLoading(false);
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });

    void supabase.auth.getUser().then(({ data }) => {
      if (!active || receivedAuthEvent) return;
      setUser(toAuthUser(data.user));
      setLoading(false);
    }).catch(() => {
      if (!active || receivedAuthEvent) return;
      setUser(null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  const value: AuthContextValue = {
    user,
    loading,
    setDisplayName: (displayName) => {
      setUser((current) => current ? { ...current, displayName } : current);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
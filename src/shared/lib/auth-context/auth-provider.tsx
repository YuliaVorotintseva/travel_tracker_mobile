import { FC, ReactNode, useEffect, useState } from "react";

import { supabase } from "../supabase";
import { AuthContext } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token ?? null);
      setIsAuthenticated(!!session?.access_token);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setToken(session?.access_token ?? null);
      if (event === "SIGNED_OUT") setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getToken = () => token;

  const logout = () => {
    supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        getToken,
        setToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

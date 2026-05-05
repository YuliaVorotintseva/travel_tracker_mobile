import { supabase, useAuth } from "@/src/shared/lib";

export const useSignOut = () => {
  const { setIsAuthenticated } = useAuth();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!!error) {
        throw error;
      }

      setIsAuthenticated(false);
    } catch (error: unknown) {
      console.error((error as { message: string }).message);
    }
  };

  return { logout };
};

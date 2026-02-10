import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const signIn = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { signIn, signOut };
};
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (password) {
        // Login com Email e Senha
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } else {
        // Fallback para Link Mágico (OTP)
        const redirectTo = Linking.createURL('/');
        const { data, error } = await supabase.auth.signInWithOtp({ 
          email,
          options: {
            emailRedirectTo: redirectTo,
          }
        });
        if (error) throw error;
        return data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { signIn, signUp, signOut };
};
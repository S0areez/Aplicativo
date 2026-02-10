import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useSession = () => {
  const { setUser, setPartnerId } = useAuthStore();

  useEffect(() => {
    // Escuta mudanças na autenticação (login/logout)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) fetchProfile(session.user.id);
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('partner_id')
      .eq('id', userId)
      .single();
    
    if (data?.partner_id) setPartnerId(data.partner_id);
  };
};
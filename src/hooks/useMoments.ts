import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function useMoments() {
  const [moments, setMoments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    fetchMoments();

    // Inscrição em tempo real para o mural
    const channel = supabase
      .channel('moments_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'moments',
        },
        () => {
          // Atualiza a lista automaticamente quando houver mudanças
          fetchMoments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchMoments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoments(data || []);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { moments, isLoading, refetch: fetchMoments };
}

import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useSession = () => {
  const { setUser, setPartnerId, setIsLoading } = useAuthStore();

  useEffect(() => {
    // 1. Lida com o link que abriu o app (Deep Linking)
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;
      
      console.log('Deep link received:', url);
      
      const { fragment } = Linking.parse(url);
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          setIsLoading(true);
          console.log('Session tokens found in URL, setting session...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error('Error setting session from URL:', error.message);
            setIsLoading(false);
          }
        }
      }
    };

    // Pega a URL inicial se o app foi aberto por um link
    Linking.getInitialURL().then(handleDeepLink);

    // Escuta novas URLs enquanto o app está aberto
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // 2. Escuta mudanças na autenticação
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session initial check:', session ? 'User logged in' : 'No session');
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'User logged in' : 'No session');
      setUser(session?.user ?? null);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setPartnerId(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.remove();
      authSubscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for:', userId);
      // Tenta buscar o perfil
      let { data, error } = await supabase
        .from('profiles')
        .select('partner_id')
        .eq('id', userId)
        .maybeSingle(); // Usamos maybeSingle para não dar erro se não existir
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        setIsLoading(false);
        return;
      }

      // Se o perfil não existir (usuário novo), vamos criar um
      if (!data) {
        console.log('Profile not found, creating new profile for:', userId);
        const { data: newData, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId }])
          .select('partner_id')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError.message);
          setIsLoading(false);
          return;
        }
        data = newData;
      }
      
      console.log('Profile data:', data);
      if (data?.partner_id) {
        setPartnerId(data.partner_id);
      } else {
        setPartnerId(null);
      }
      setIsLoading(false);
    } catch (e) {
      console.error('Unexpected error in fetchProfile:', e);
      setIsLoading(false);
    }
  };
};
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const { user, partnerId } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // 1. Busca mensagens iniciais
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      if (data) setMessages(data);
    };

    fetchMessages();

    // 2. Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new;
          if (
            (newMessage.sender_id === user.id && newMessage.receiver_id === partnerId) ||
            (newMessage.sender_id === partnerId && newMessage.receiver_id === user.id)
          ) {
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId]);

  const sendMessage = async (content: string) => {
    if (!user || !partnerId) return;

    const { error } = await supabase.from('messages').insert([
      { 
        sender_id: user.id, 
        receiver_id: partnerId, 
        content 
      }
    ]);

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  return { messages, sendMessage };
};

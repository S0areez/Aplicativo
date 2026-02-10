import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface HistoryItem {
  id: string;
  name: string;
  lastUsed: number;
}

interface AuthState {
  user: any | null;
  partnerId: string | null;
  isLoading: boolean;
  history: HistoryItem[];
  setUser: (user: any) => void;
  setPartnerId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  addToHistory: (id: string, name: string) => void;
  removeFromHistory: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      partnerId: null,
      isLoading: true,
      history: [],
      setUser: (user) => set({ user, isLoading: false }),
      setPartnerId: (id) => set({ partnerId: id }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      addToHistory: (id, name) => set((state) => {
        const filtered = state.history.filter(item => item.id !== id);
        return {
          history: [
            { id, name, lastUsed: Date.now() },
            ...filtered
          ].slice(0, 5) // Mantém apenas os 5 últimos
        };
      }),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id)
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ history: state.history }), // Persiste apenas o histórico
    }
  )
);

import { create } from 'zustand';

interface AuthState {
  user: any | null;
  partnerId: string | null;
  isLoading: boolean;
  setUser: (user: any) => void;
  setPartnerId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  partnerId: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setPartnerId: (id) => set({ partnerId: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

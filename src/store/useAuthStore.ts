import { create } from 'zustand';

interface AuthState {
  user: any | null;
  partnerId: string | null;
  setUser: (user: any) => void;
  setPartnerId: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  partnerId: null,
  setUser: (user) => set({ user }),
  setPartnerId: (id) => set({ partnerId: id }),
}));

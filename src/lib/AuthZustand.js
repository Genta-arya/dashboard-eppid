import {create} from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }), // Method untuk set data user
}));

export default useUserStore;

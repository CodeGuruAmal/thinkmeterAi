import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: null }),
}));

export default useAuthStore;

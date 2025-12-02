import { create } from "zustand";

const userAuth = create((set) => ({
  user: null,
  token: null,
  role: null,
  setUser: (user, token, role) => set({ user, token, role }),
  logout: () => set({ user: null, token: null, role: null }),
}));

export default userAuth;


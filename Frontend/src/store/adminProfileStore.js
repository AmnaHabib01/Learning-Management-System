import { create } from "zustand";
import api from "./axiosInstance";
import Toast from "../Components/ui/Toast";

const useAdminProfileStore = create((set) => ({
  user: null,
  loading: false,
  saving: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/admin/profile", { withCredentials: true });
      set({ user: data.data });
    } catch (err) {
      console.error(err);
      Toast.error("Failed to load profile");
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (formData) => {
    set({ saving: true });
    try {
      const { data } = await api.put("/admin/Update-profile", formData, { withCredentials: true });
      set({ user: data.data });
      Toast.success("Profile updated successfully");
      return data.data;
    } catch (err) {
      console.error(err);
      Toast.error(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      set({ saving: false });
    }
  },
}));

export default useAdminProfileStore;

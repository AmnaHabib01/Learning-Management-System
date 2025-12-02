import { create } from "zustand";
import api from "../../store/axiosInstance";

const useTeacherStore = create((set, get) => ({
    teachers: [],
    loading: false,
    error: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchTeachers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/admin/allteachers');
            set({ teachers: response.data.data, loading: false });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || "Failed to fetch teachers",
                loading: false 
            });
        }
    },

    addTeacher: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/teacher/register-teacher', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchTeachers();
            return response.data.message;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    updateTeacher: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/teacher/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchTeachers();
            return response.data.message;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Update failed';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    deleteTeacher: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.delete(`/admin/teachers/${id}`);
            get().fetchTeachers();
            return response.data.message;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Deletion failed';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },
}));

export default useTeacherStore;

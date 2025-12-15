import { create } from "zustand";
import api from "../../store/axiosInstance";

const useStudentStore = create((set, get) => ({
  students: [],
  setError: (message) => set({ error: message }),
  totalStudents: 0,
  loading: false,
  error: null,

  // Fetch all students
  fetchStudents: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/student/all");
      set({ students: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  // Add student
 addStudent: async (formData) => {
  try {
    set({ loading: true });
    const res = await api.post("/auth/register", formData);
    set((state) => ({
      students: [...state.students, res.data.data], // student data
      loading: false,
    }));
    return res.data.message; // toast message
  } catch (err) {
    set({ error: err.response?.data?.message || "Something went wrong", loading: false });
    throw new Error(err.response?.data?.message || "Something went wrong");
  }
},

 
  // Update student
  updateStudent: async (id, formData) => {
  try {
    set({ loading: true });
    const res = await api.put(`/student/update/${id}`, formData);
    set((state) => ({
      students: state.students.map((st) =>
        st._id === id ? res.data.data : st
      ),
      loading: false,
    }));
    return res.data.message; // toast message
  } catch (err) {
    set({ error: err.response?.data?.message || "Something went wrong", loading: false });
    throw new Error(err.response?.data?.message || "Something went wrong");
  }
},

  // Delete student
  deleteStudent: async (id) => {
    try {
      set({ loading: true });
      await api.delete(`/student/delete/${id}`);
      set((state) => ({
        students: state.students.filter((st) => st._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },
   // Fetch total number of students
  fetchTotalStudents: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/student/sumofall"); // endpoint you created
      set({ totalStudents: res.data.data.total, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },
}));

export default useStudentStore;

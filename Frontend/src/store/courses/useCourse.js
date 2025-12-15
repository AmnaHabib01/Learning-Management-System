import { create } from "zustand";
import api from "../../store/axiosInstance";

const useCourseStore = create((set, get) => ({
  courses: [],
  teacherOptions: [],
  studentOptions: [],
  totalCourses: 0,
  loading: false,
  error: null,

  // Fetch all courses and options
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });

      const [coursesRes, teachersRes, studentsRes] = await Promise.all([
        api.get("/course/all"),       // get all courses
        api.get("/admin/allteachers"),  // get teacher options
        api.get("/student/all"),  // get student options
      ]);

      set({
        courses: coursesRes.data.data,
        teacherOptions: teachersRes.data.data,
        studentOptions: studentsRes.data.data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch courses",
        loading: false,
      });
    }
  },

  // Add a new course
  addCourse: async (formData) => {
    try {
      set({ loading: true });
      const res = await api.post("/course/create", formData);
      set((state) => ({
        courses: [...state.courses, res.data.data],
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add course", loading: false });
      throw new Error(err.response?.data?.message || "Failed to add course");
    }
  },
  // Update course
  updateCourse: async (id, formData) => {
    try {
      set({ loading: true });
      const res = await api.put(`/course/update/${id}`, formData);
      set((state) => ({
        courses: state.courses.map((c) => (c._id === id ? res.data.data : c)),
        loading: false,
      }));
      return res.data.message;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update course", loading: false });
      throw new Error(err.response?.data?.message || "Failed to update course");
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      set({ loading: true });
      await api.delete(`/course/delete/${id}`);
      set((state) => ({
        courses: state.courses.filter((c) => c._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete course", loading: false });
    }
  },
  fetchTotalCourses: async () => {
  try {
    set({ loading: true });
    const res = await api.get("/course/total");
    set({ totalCourses: res.data.total, loading: false });  // <-- use data.total
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to fetch total courses",
      loading: false,
    });
  }
}
}));

export default useCourseStore;

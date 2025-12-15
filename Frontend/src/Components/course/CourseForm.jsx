// src/Components/Course/CourseForm.jsx
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useCourseStore from "../../store/courses/useCourse";
import useTeacherStore from "../../store/Teacher/teacherstore";
import useStudentStore from "../../store/student/useStudentStore";
import Toast from "../ui/Toast";

export default function CourseForm({ courseToEdit, onClose }) {
  const { addCourse, updateCourse, loading, setError } = useCourseStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { students, fetchStudents } = useStudentStore();

  const isEditMode = !!courseToEdit;

  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    title: courseToEdit?.title || "",
    description: courseToEdit?.description || "",
    duration: courseToEdit?.duration || "",
    creditHours: courseToEdit?.creditHours ?? 0,
    teachers: courseToEdit?.teachers || [],
    students: courseToEdit?.students || [],
  });

  // Fetch teacher & student lists once
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError && setError(null);
    setSuccessMessage("");
  };

  const addFromDropdown = (name, id) => {
    if (!id) return;
    const list = name === "teachers" ? teachers : students;
    const item = list.find((i) => i._id === id);
    if (!item) return;

    setFormData((prev) => {
      if (prev[name].some((x) => x._id === id)) return prev;
      return { ...prev, [name]: [...prev[name], item] };
    });
  };

  const removeItem = (name, id) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((i) => i._id !== id),
    }));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError && setError(null);
  setSuccessMessage("");

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      creditHours: Number(formData.creditHours),
      teachers: formData.teachers.map((t) => t._id),
      students: formData.students.map((s) => s._id),
    };

    let savedCourse;

    if (isEditMode) {
      savedCourse = await updateCourse(courseToEdit._id, payload);
      useCourseStore.setState((state) => ({
        courses: state.courses.map((c) =>
          c._id === savedCourse._id
            ? { ...savedCourse, teachers: formData.teachers, students: formData.students }
            : c
        ),
      }));
    } else {
      savedCourse = await addCourse(payload);
      // Update teachers/students without duplicating the course
      useCourseStore.setState((state) => ({
        courses: state.courses.map((c) =>
          c._id === savedCourse._id
            ? { ...savedCourse, teachers: formData.teachers, students: formData.students }
            : c
        ),
      }));
    }

    setSuccessMessage(isEditMode ? "Course updated" : "Course created");
    setTimeout(onClose, 1200);
  } catch (err) {
    setError && setError(err.message);
  }
};

  return (
    <div className="px-4 py-3">
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {useCourseStore.getState().error && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            {useCourseStore.getState().error}
          </div>
        )}

        {/* Title */}
        <input
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        {/* Duration */}
        <input
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        {/* Credit Hours */}
        <input
          name="creditHours"
          type="number"
          placeholder="Credit Hours"
          value={formData.creditHours}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm resize-none"
        />

        {/* Teachers */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Select Teachers</label>
          <select
            onChange={(e) => addFromDropdown("teachers", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select teacher</option>
            {(teachers || []).map((t) => (
              <option key={t._id} value={t._id}>
                {t.name || t.fullName}
              </option>
            ))}
          </select>
          {/* Teacher Chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.teachers.map((t) => (
              <span
                key={t._id}
                className="bg-yellow-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {t.name || t.fullName}
                <button
                  type="button"
                  onClick={() => removeItem("teachers", t._id)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Students */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Enroll Students</label>
          <select
            onChange={(e) => addFromDropdown("students", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select student</option>
            {(students || []).map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || s.fullName}
              </option>
            ))}
          </select>
          {/* Student Chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.students.map((s) => (
              <span
                key={s._id}
                className="bg-yellow-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {s.name || s.fullName}
                <button
                  type="button"
                  onClick={() => removeItem("students", s._id)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm rounded-lgw-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm resize-none"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 text-sm font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:opacity-60"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}



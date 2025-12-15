// src/pages/Courses.jsx
import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import CourseList from "../../Components/course/CourseList";
import CourseForm from "../../Components/course/CourseForm";
import CourseDetail from "../../Components/course/CourseDetail";
import Modal from "../../Components/course/Modal";
import useCourseStore from "../../store/courses/useCourse";

export default function Courses() {
  const { deleteCourse } = useCourseStore();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleRegisterOpen = () => { setSelectedCourse(null); setIsRegisterModalOpen(true); };
  const handleEditOpen = (course) => { setSelectedCourse(course); setIsEditModalOpen(true); };
  const handleDetailOpen = (course) => { setSelectedCourse(course); setIsDetailModalOpen(true); };
  const handleCloseModals = () => {
    setIsRegisterModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedCourse(null);
    // clear any errors in course store if exists:
    if (useCourseStore.getState().setError) useCourseStore.getState().setError(null);
  };
  const handleDeleteCourse = async (id) => { try { await deleteCourse(id); } catch (err) {} };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="mb-8 p-6 bg-blue-900 rounded-xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Manage Courses</h1>
        <p className="text-yellow-400 mt-1">Create, update and manage course records.</p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleRegisterOpen}
            className="flex items-center px-6 py-3 text-sm font-bold text-blue-900 bg-yellow-400 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors transform hover:scale-[1.01] duration-300"
          >
            <UserPlus size={20} className="mr-2" /> Add New Course
          </button>
        </div>

        <CourseList
          onEditCourse={handleEditOpen}
          onShowDetail={handleDetailOpen}
          onDeleteCourse={handleDeleteCourse}
        />
      </div>

      <Modal isOpen={isRegisterModalOpen} onClose={handleCloseModals} title="Add New Course">
        <CourseForm onClose={handleCloseModals} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseModals} title={`Update Course: ${selectedCourse?.title || ''}`}>
        <CourseForm courseToEdit={selectedCourse} onClose={handleCloseModals} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={handleCloseModals} title={`Course Details: ${selectedCourse?.title || ''}`}>
        {selectedCourse && <CourseDetail course={selectedCourse} />}
      </Modal>
    </div>
  );
}

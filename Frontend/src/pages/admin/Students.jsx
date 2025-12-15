import React, { useState } from "react";
import { UserPlus } from "lucide-react";

import StudentList from "../../Components/student/StudentList";
import StudentForm from "../../Components/Student/StudentForm";
import StudentDetail from "../../Components/student/StudentDetail";
import Modal from "../../Components/student/Modal";

import useStudentStore from "../../store/student/useStudentStore";

export default function Student() {
    const { deleteStudent } = useStudentStore();

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);

    // Open Modals
    const handleRegisterOpen = () => { 
        setSelectedStudent(null); 
        setIsRegisterModalOpen(true); 
    };

    const handleEditOpen = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };

    const handleDetailOpen = (student) => {
        setSelectedStudent(student);
        setIsDetailModalOpen(true);
    };

    // Close all modals
    const handleCloseModals = () => {
        setIsRegisterModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedStudent(null);
        useStudentStore.getState().setError?.(null);
    };

    // Delete Student handler
    const handleDeleteStudent = async (id) => {
        try {
            await deleteStudent(id);
        } catch {}
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">

            {/* Header */}
            <header className="mb-8 p-6 bg-blue-900 rounded-xl shadow-xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                    Manage Students
                </h1>
                <p className="text-yellow-400 mt-1">
                    Manage all student records efficiently.
                </p>
            </header>

            {/* Body */}
            <div className="max-w-7xl mx-auto">
                
                {/* Add New Student Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleRegisterOpen}
                        className="flex items-center px-6 py-3 text-sm font-bold text-blue-900 bg-yellow-400 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors transform hover:scale-[1.01] duration-300"
                    >
                        <UserPlus size={20} className="mr-2" /> Register New Student
                    </button>
                </div>

                {/* Student List Table */}
                <StudentList
                    onEditStudent={handleEditOpen}
                    onShowDetail={handleDetailOpen}
                    onDeleteStudent={handleDeleteStudent}
                />
            </div>

            {/* Modals */}
            <Modal
                isOpen={isRegisterModalOpen}
                onClose={handleCloseModals}
                title="Register New Student"
            >
                <StudentForm onClose={handleCloseModals} />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseModals}
                title={`Update Student: ${selectedStudent?.name || ""}`}
            >
                <StudentForm studentToEdit={selectedStudent} onClose={handleCloseModals} />
            </Modal>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModals}
                title={`Student Details: ${selectedStudent?.name || ""}`}
            >
                {selectedStudent && <StudentDetail student={selectedStudent} />}
            </Modal>

        </div>
    );
}

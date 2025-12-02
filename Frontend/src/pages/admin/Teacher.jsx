import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import TeacherList from "../../Components/Teacher/TeacherList";
import TeacherForm from "../../Components/Teacher/TeacherForm";
import TeacherDetail from "../../Components/Teacher/TeacherDetail";
import Modal from "../../Components/Teacher/Modal";
import useTeacherStore from "../../store/Teacher/teacherstore";

export default function Teacher() {
    const { deleteTeacher } = useTeacherStore();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const handleRegisterOpen = () => { setSelectedTeacher(null); setIsRegisterModalOpen(true); };
    const handleEditOpen = teacher => { setSelectedTeacher(teacher); setIsEditModalOpen(true); };
    const handleDetailOpen = teacher => { setSelectedTeacher(teacher); setIsDetailModalOpen(true); };
    const handleCloseModals = () => { setIsRegisterModalOpen(false); setIsEditModalOpen(false); setIsDetailModalOpen(false); setSelectedTeacher(null); useTeacherStore.getState().setError(null); };
    const handleDeleteTeacher = async id => { try { await deleteTeacher(id); } catch {} };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <header className="mb-8 p-6 bg-blue-900 rounded-xl shadow-xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">Manage Teachers</h1>
                <p className="text-yellow-400 mt-1">Manage all teacher records efficiently.</p>
            </header>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-end">
                    <button onClick={handleRegisterOpen} className="flex items-center px-6 py-3 text-sm font-bold text-blue-900 bg-yellow-400 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors transform hover:scale-[1.01] duration-300">
                        <UserPlus size={20} className="mr-2" /> Register New Teacher
                    </button>
                </div>
                <TeacherList onEditTeacher={handleEditOpen} onShowDetail={handleDetailOpen} onDeleteTeacher={handleDeleteTeacher} />
            </div>
            <Modal isOpen={isRegisterModalOpen} onClose={handleCloseModals} title="Register New Teacher">
                <TeacherForm onClose={handleCloseModals} />
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={handleCloseModals} title={`Update Teacher: ${selectedTeacher?.name || ''}`}>
                <TeacherForm teacherToEdit={selectedTeacher} onClose={handleCloseModals} />
            </Modal>
            <Modal isOpen={isDetailModalOpen} onClose={handleCloseModals} title={`Teacher Details: ${selectedTeacher?.name || ''}`}>
                {selectedTeacher && <TeacherDetail teacher={selectedTeacher} />}
            </Modal>
        </div>
    );
}

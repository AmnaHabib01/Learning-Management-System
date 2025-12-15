import React, { useEffect, useState } from "react";
import { Loader2, RefreshCcw, Info, Edit2, Trash2 } from "lucide-react";
import useTeacherStore from "../../store/Teacher/teacherstore";
import { User } from "lucide-react"; // ADD THIS
import Toast from "../ui/Toast";

export default function TeacherList({ onEditTeacher, onShowDetail, onDeleteTeacher }) {
    const { teachers, loading, error, fetchTeachers } = useTeacherStore();
    const [toastMessage, setToastMessage] = useState("");
    const [teacherToDelete, setTeacherToDelete] = useState(null); // For custom delete confirmation

    useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    

    const getProfileImage = (teacher) => teacher.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

    return (
        <>
            {toastMessage && (
                <Toast
                    message={toastMessage.message || toastMessage}
                    type={toastMessage.type || "success"}
                    onClose={() => setToastMessage("")}
                />
            )}

            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-blue-900">All Registered Teachers</h2>
                    <button
                        onClick={fetchTeachers}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50"
                    >
                        <RefreshCcw size={16} className={loading ? "animate-spin mr-2" : "mr-2"} />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                {error && <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-lg font-medium border border-red-200">{error}</div>}

                {loading && teachers.length === 0 ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 text-blue-900 animate-spin mr-2" />
                        <p className="text-lg text-blue-900 font-medium">Loading teacher data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Name', 'Email', 'Phone', 'Verified', 'Actions'].map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teachers.map(teacher => (
                                    <tr key={teacher._id} className="hover:bg-yellow-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                    src={getProfileImage(teacher)}
                                                    alt={teacher.name}
                                                    onError={e => e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                                                />

                                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phoneNumber || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.teacherIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{teacher.teacherIsVerified ? 'Yes' : 'No'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => onShowDetail(teacher)}
                                                    title="View Profile"
                                                    className="px-3 py-1.5 flex items-center gap-1 text-xs font-semibold text-blue-950 bg-blue-100 rounded-lg shadow-sm hover:bg-blue-200 transition-all duration-200"
                                                >
                                                    <User size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onEditTeacher(teacher)}
                                                    title="Edit"
                                                    className="p-2 text-yellow-500 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setTeacherToDelete(teacher)}
                                                    title="Delete"
                                                    className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && !loading && !error && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No teachers found. Click "Register Teacher" to add one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {teacherToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
                        <p className="mb-6">Do you really want to delete {teacherToDelete.name}?</p>
                        <div className="flex justify-around">
                            <button
                                onClick={() => setTeacherToDelete(null)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await onDeleteTeacher(teacherToDelete._id);
                                        setToastMessage({ message: `${teacherToDelete.name} deleted successfully`, type: "success" });
                                    } catch (err) {
                                        setToastMessage({ message: err.message || 'Failed to delete teacher', type: 'error' });
                                    } finally {
                                        setTeacherToDelete(null);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

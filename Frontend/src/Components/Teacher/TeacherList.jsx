import React, { useEffect } from "react";
import { Loader2, RefreshCcw, Info, Edit2, Trash2 } from "lucide-react";
import useTeacherStore from "../../store/Teacher/teacherstore";

export default function TeacherList({ onEditTeacher, onShowDetail, onDeleteTeacher }) {
    const { teachers, loading, error, fetchTeachers } = useTeacherStore();

    useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    const getProfileImage = (key) => key ? `https://d3v1b0fgh14g3k.cloudfront.net/${key}` : 'https://placehold.co/40x40/f0f9ff/1e3a8a?text=T';

    const handleDeleteClick = async (teacher) => {
        if (confirm(`Delete ${teacher.name}?`)) {
            await onDeleteTeacher(teacher._id);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-blue-900">All Registered Teachers</h2>
                <button onClick={fetchTeachers} disabled={loading} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50">
                    <RefreshCcw size={16} className={loading ? "animate-spin mr-2" : "mr-2"} />
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            {error && <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-lg font-medium border border-red-200">{error}</div>}
            {loading && teachers.length === 0 ? (
                <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 text-blue-900 animate-spin mr-2" /><p className="text-lg text-blue-900 font-medium">Loading teacher data...</p></div>
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
                                            <img className="h-10 w-10 rounded-full object-cover mr-3" src={getProfileImage(teacher.profileImage)} alt={teacher.name} onError={e => e.currentTarget.src = getProfileImage(null)} />
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
                                            <button onClick={() => onShowDetail(teacher)} title="View Details" className="p-2 text-blue-900 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"><Info size={16} /></button>
                                            <button onClick={() => onEditTeacher(teacher)} title="Edit" className="p-2 text-yellow-500 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteClick(teacher)} title="Delete" className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {teachers.length === 0 && !loading && !error && <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No teachers found. Click "Register Teacher" to add one.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

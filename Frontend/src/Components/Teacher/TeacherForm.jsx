import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import useTeacherStore from "../../store/Teacher/teacherstore";

export default function TeacherForm({ teacherToEdit, onClose }) {
    const { addTeacher, updateTeacher, loading, setError } = useTeacherStore();
    const isEditMode = !!teacherToEdit;

    const [formData, setFormData] = useState({
        name: teacherToEdit?.name || '',
        email: teacherToEdit?.email || '',
        password: '',
        phoneNumber: teacherToEdit?.phoneNumber || '',
        address: teacherToEdit?.address || '',
        profileImage: null,
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage('');
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, profileImage: e.target.files[0] }));
        setError(null);
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            const message = isEditMode
                ? await updateTeacher(teacherToEdit._id, data)
                : await addTeacher(data);

            setSuccessMessage(message);
            if (!isEditMode) setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.message || useTeacherStore.getState().error);
        }
    };

    // Note: Since yellow-400 is light, I'm adjusting the text color for the button to be dark (text-gray-900) for readability.
    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1"> 
            {/* Messages - kept standard green/red */}
            {successMessage && <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMessage}</div>}
            {useTeacherStore.getState().error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{useTeacherStore.getState().error}</div>}

            {/* Input fields: Focus ring and border changed to yellow-400 */}
            <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                required={!isEditMode} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-150 ease-in-out shadow-sm" 
            />
            <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                required={!isEditMode} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-150 ease-in-out shadow-sm" 
            />
            <input 
                type="password" 
                name="password" 
                placeholder={isEditMode ? "New Password (Leave blank to keep old)" : "Password"} 
                value={formData.password} 
                onChange={handleChange} 
                required={!isEditMode} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-150 ease-in-out shadow-sm" 
            />
            <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number (Optional)" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-150 ease-in-out shadow-sm" 
            />
            <textarea 
                name="address" 
                placeholder="Address (Optional)" 
                value={formData.address} 
                onChange={handleChange} 
                rows="3" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-150 ease-in-out shadow-sm" 
            />
            
            {/* File Input: Button hover changed to yellow-400 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (Optional)</label>
                <input 
                    type="file" 
                    name="profileImage" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-yellow-100 file:hover:text-yellow-700 transition duration-150 ease-in-out" 
                />
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end pt-4 space-x-3">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    // Main action button changed to yellow-400, text set to dark for contrast
                    className="flex items-center px-6 py-2 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Update Teacher' : 'Register Teacher'}
                </button>
            </div>
        </form>
    );
}
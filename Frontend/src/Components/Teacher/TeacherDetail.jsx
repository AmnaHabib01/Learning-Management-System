import React from "react";

export default function TeacherDetail({ teacher }) {
    const getImageUrl = (key) => 
        key ? `https://d3v1b0fgh14g3k.cloudfront.net/${key}` : 'https://placehold.co/150x150/f9f9f9/3b82f6?text=No+Image';

    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-6">
                <img src={getImageUrl(teacher.profileImage)} alt={teacher.name} className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 shadow-lg" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-900 border-b pb-2 mb-2">Personal Information</h4>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Name:</span> {teacher.name}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Email:</span> {teacher.email}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Phone:</span> {teacher.phoneNumber || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Address:</span> {teacher.address || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-900 border-b pb-2 mb-2">System Status</h4>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Verified:</span> <span className={`ml-2 font-bold ${teacher.teacherIsVerified ? 'text-green-600' : 'text-red-600'}`}>{teacher.teacherIsVerified ? 'Yes' : 'No'}</span></p>
                <p className="text-gray-700"><span className="font-medium text-blue-900">ID:</span> {teacher._id}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-900">Role:</span> {teacher.role}</p>
            </div>
        </div>
    );
}

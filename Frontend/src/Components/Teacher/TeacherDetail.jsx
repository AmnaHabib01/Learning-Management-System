import React from "react";

export default function TeacherDetail({ teacher }) {
    // Use the signed URL from backend or fallback placeholder
    const imageUrl = teacher.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  console.log(teacher);
  
    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-6">
                <img 
                    src={imageUrl} 
                    alt={teacher.name} 
                    className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 shadow-lg" 
                />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">
                    Personal Information
                </h4>
                <p className="text-gray-700"><span className="font-medium text-blue-950">Name:</span> {teacher.name}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-950">Email:</span> {teacher.email}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-950">Phone:</span> {teacher.phoneNumber || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-medium text-blue-950">Address:</span> {teacher.address || 'N/A'}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">
                    System Status
                </h4>
                <p className="text-gray-800">
                    <span className="font-medium text-blue-950">Verified:</span> 
                    <span className={`ml-2 font-bold ${teacher.teacherIsVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {teacher.teacherIsVerified ? 'Yes' : 'No'}
                    </span>
                </p>
                <p className="text-gray-800"><span className="font-medium text-blue-950">ID:</span> {teacher._id}</p>
                <p className="text-gray-800"><span className="font-medium text-blue-950">Role:</span> {teacher.role}</p>
            </div>
        </div>
    );
}

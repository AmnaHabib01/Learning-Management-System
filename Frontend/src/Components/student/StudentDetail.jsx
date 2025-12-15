import React from "react";

export default function StudentDetail({ student }) {
    // Use backend signed URL or fallback avatar
    const imageUrl = student.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/201/201818.png";

    return (
        <div className="space-y-4">

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
                <img
                    src={imageUrl}
                    alt={student.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                />
            </div>

            {/* Personal Information */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">
                    Personal Information
                </h4>

                <p className="text-gray-700">
                    <span className="font-medium text-blue-950">Name:</span> {student.name}
                </p>

                <p className="text-gray-700">
                    <span className="font-medium text-blue-950">Email:</span> {student.email}
                </p>

                <p className="text-gray-700">
                    <span className="font-medium text-blue-950">Phone:</span> {student.phoneNumber || "N/A"}
                </p>

                <p className="text-gray-700">
                    <span className="font-medium text-blue-950">Address:</span> {student.address || "N/A"}
                </p>
            </div>

            {/* Academic / System Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">
                    Academic Information
                </h4>
                <p className="text-gray-800">
                    <span className="font-medium text-blue-950">Verified:</span>
                    <span className={`ml-2 font-bold ${student.studentIsVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {student.studentIsVerified ? 'Yes' : 'No'}
                    </span>
                </p>
                <p className="text-gray-800">
                    <span className="font-medium text-blue-950">ID:</span> {student._id}
                </p>

                <p className="text-gray-800">
                    <span className="font-medium text-blue-950">Role:</span> {student.role}
                </p>
            </div>

        </div>
    );
}

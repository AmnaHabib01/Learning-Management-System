// src/Components/Course/CourseDetail.jsx
import React from "react";

export default function CourseDetail({ course }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">Course Information</h4>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Title:</span> {course.title}</p>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Description:</span> {course.description || 'N/A'}</p>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Duration:</span> {course.duration || 'N/A'}</p>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Credit Hours:</span> {course.creditHours ?? 'N/A'}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-blue-950 border-b pb-2 mb-2">People</h4>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Teachers:</span> {course.teachers?.map(t => t.name).join(", ") || 'None'}</p>
        <p className="text-gray-700"><span className="font-medium text-blue-950">Students:</span> {course.students?.length ?? 0} enrolled</p>
      </div>
    </div>
  );
}

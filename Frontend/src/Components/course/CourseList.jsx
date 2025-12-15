// src/Components/Course/CourseList.jsx
import React, { useEffect, useState } from "react";
import { Loader2, RefreshCcw, Edit2, Trash2, Eye } from "lucide-react";
import useCourseStore from "../../store/courses/useCourse";
import Toast from "../ui/Toast";

export default function CourseList({ onEditCourse, onShowDetail, onDeleteCourse }) {
  const { courses, loading, error, fetchCourses } = useCourseStore();
  const [toastMessage, setToastMessage] = useState("");
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage.message || toastMessage} type={toastMessage.type || "success"} onClose={() => setToastMessage("")} />
      )}

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-blue-900">Current Courses</h2>
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin mr-2" : "mr-2"} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {error && <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-lg font-medium border border-red-200">{error}</div>}

        {loading && courses.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 text-blue-900 animate-spin mr-2" />
            <p className="text-lg text-blue-900 font-medium">Loading courses...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Teachers', 'Students', 'Duration', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map(course => (
                  <tr key={course._id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.description?.slice(0, 80)}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.teachers?.map(t => t.name).slice(0,3).join(", ") || "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students?.length ?? 0} enrolled
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.duration}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onShowDetail(course)}
                          title="View"
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-semibold text-blue-950 bg-blue-100 rounded-lg shadow-sm hover:bg-blue-200 transition-all duration-200"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => onEditCourse(course)}
                          title="Edit"
                          className="p-2 text-yellow-500 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => setCourseToDelete(course)}
                          title="Delete"
                          className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {courses.length === 0 && !loading && !error && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No courses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {courseToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
            <p className="mb-6">Do you really want to delete {courseToDelete.title}?</p>
            <div className="flex justify-around">
              <button onClick={() => setCourseToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await onDeleteCourse(courseToDelete._id);
                    setToastMessage({ message: `${courseToDelete.title} deleted successfully`, type: "success" });
                  } catch (err) {
                    setToastMessage({ message: err.message || 'Failed to delete course', type: 'error' });
                  } finally {
                    setCourseToDelete(null);
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

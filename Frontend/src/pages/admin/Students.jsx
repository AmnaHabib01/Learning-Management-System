import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import RegisterStudent from "./RegisterStudent";
import toast, { Toaster } from "react-hot-toast";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load students from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("students");
    if (stored) setStudents(JSON.parse(stored));
  }, []);

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCourse === "" || s.course === filterCourse)
  );

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowRegisterModal(true);
    setShowDetailsModal(false);
  };

  const handleDelete = () => {
    if (selectedStudent) {
      setStudents(students.filter((s) => s !== selectedStudent));
      toast.success("Student deleted successfully!");
      setShowDeleteModal(false);
      setShowDetailsModal(false);
      setSelectedStudent(null);
    }
  };

  const handleFormSubmit = (studentData) => {
    if (selectedStudent) {
      setStudents(
        students.map((s) => (s === selectedStudent ? studentData : s))
      );
      toast.success("Student updated successfully!");
    } else {
      setStudents([...students, studentData]);
      toast.success("Student registered successfully!");
    }
    setShowRegisterModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="p-6 w-full h-full overflow-auto flex flex-col gap-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setShowRegisterModal(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-blue-900 to-yellow-300 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 font-semibold text-lg"
        >
          <FiPlus className="text-xl animate-pulse" /> Register
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-sm pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-yellow outline-none text-gray-700 text-sm shadow-sm"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 focus:border-yellow-900 focus:ring-1 focus:ring-blue-900 outline-none text-gray-700 text-sm shadow-sm"
        >
          <option value="">All Courses</option>
          <option value="BBA 1st Year">BBA 1st Year</option>
          <option value="BBA 2nd Year">BBA 2nd Year</option>
          <option value="BBA 3rd Year">BBA 3rd Year</option>
          <option value="BS CS 1st Year">BS CS 1st Year</option>
          <option value="BS CS 2nd Year">BS CS 2nd Year</option>
          <option value="BS CS 3rd Year">BS CS 3rd Year</option>
          <option value="BS IT 1st Year">BS IT 1st Year</option>
          <option value="BS IT 2nd Year">BS IT 2nd Year</option>
          <option value="BS IT 3rd Year">BS IT 3rd Year</option>
          <option value="BS Math 1st Year">BS Math 1st Year</option>
        </select>
      </div>

      {/* Vertical List of Cards */}
      <div className="flex flex-col gap-2">
        {filteredStudents.map((s, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedStudent(s);
              setShowDetailsModal(true);
            }}
            className="flex items-center gap-4 bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={
                s.profileImage
                  ? URL.createObjectURL(s.profileImage)
                  : "https://via.placeholder.com/40x40.png?text=Profile"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 text-sm text-gray-700 flex flex-row gap-4 items-center">
              <span className="text-gray-800">{s.name}</span>
              <span className="text-gray-500">| {s.email}</span>
              <span className="text-gray-500">| {s.course}</span>
              <span className="text-gray-500">| {s.phoneNumber}</span>
              <span className="text-gray-500">| {s.address}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-6">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-lg font-bold"
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-2 text-gray-700">
              <img
                src={
                  selectedStudent.profileImage
                    ? URL.createObjectURL(selectedStudent.profileImage)
                    : "https://via.placeholder.com/80x80.png?text=Profile"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <h2 className="text-sm text-black">{selectedStudent.name}</h2>
              <p className="text-xs">{selectedStudent.email}</p>
              <p className="text-xs">{selectedStudent.phoneNumber}</p>
              <p className="text-xs">{selectedStudent.address}</p>
              <p className="text-xs text-gray-500">{selectedStudent.course}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(selectedStudent)}
                  className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-yellow-600 text-white px-7 py-2 rounded-full hover:bg-gray-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-sm mb-2 text-gray-800">
              Delete {selectedStudent.name}?
            </h3>
            <p className="text-xs text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                className="bg-yellow-400 text-white px-3 py-1 rounded-full hover:bg-gray-300 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RegisterStudent
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowRegisterModal(false);
              setSelectedStudent(null);
            }}
            studentData={selectedStudent}
          />
        </div>
      )}
    </div>
  );
}

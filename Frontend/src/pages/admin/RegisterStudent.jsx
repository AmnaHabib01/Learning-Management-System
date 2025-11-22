import React, { useState, useEffect } from "react";

export default function RegisterStudent({ onSubmit, onClose, studentData }) {
  const [formData, setFormData] = useState({
    profileImage: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    phoneNumber: "",
    address: "",
    course: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // for validation errors

  const bsCourses = [
    "BBA 1st Year",
    "BBA 2nd Year",
    "BBA 3rd Year",
    "BS CS 1st Year",
    "BS CS 2nd Year",
    "BS CS 3rd Year",
    "BS IT 1st Year",
    "BS IT 2nd Year",
    "BS IT 3rd Year",
    "BS Math 1st Year",
  ];

  // Prefill form when editing
  useEffect(() => {
    if (studentData) {
      setFormData({
        profileImage: studentData.profileImage || null,
        name: studentData.name || "",
        email: studentData.email || "",
        password: "",
        confirmPassword: "",
        role: studentData.role || "Student",
        phoneNumber: studentData.phoneNumber || "",
        address: studentData.address || "",
        course: studentData.course || "",
      });
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.course) newErrors.course = "Course is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails
    onSubmit(formData);

    if (!studentData) {
      setFormData({
        profileImage: null,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Student",
        phoneNumber: "",
        address: "",
        course: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="bg-white backdrop-blur-md border border-blue-200 shadow-2xl p-8 rounded-3xl w-full max-w-3xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-lg font-bold"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        {studentData ? "Edit Student" : "Register Student"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
        {/* Profile Image Upload */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Upload Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.profileImage ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.profileImage && <span className="text-red-500 text-xs">{errors.profileImage}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.phoneNumber && <span className="text-red-500 text-xs">{errors.phoneNumber}</span>}
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="mb-1 text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
        </div>

        <div className="flex flex-col relative">
          <label className="mb-1 text-gray-700">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-blue-200 ${
              errors.address ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          />
          {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Course</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={`px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-yellow-400 transition ${
              errors.course ? "border-red-500" : "border-gray-300 focus:border-blue-900"
            }`}
          >
            <option value="">Select Course</option>
            {bsCourses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course && <span className="text-red-500 text-xs">{errors.course}</span>}
        </div>

        {/* Submit Button */}
        <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="w-48 bg-linear-to-r from-blue-900 to-yellow-400 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition text-sm font-semibold"
          >
            {studentData ? "Update Student" : "Register Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

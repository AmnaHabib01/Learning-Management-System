import React, { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import useStudentStore from "../../store/student/useStudentStore";
import Toast from "../ui/Toast";

export default function StudentForm({ studentToEdit, onClose }) {
  const { addStudent, updateStudent, loading, setError } = useStudentStore();
  const isEditMode = !!studentToEdit;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    profileImage: null,
    studentProfileImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: studentToEdit.name || "",
        email: studentToEdit.email || "",
        password: "",
        phoneNumber: studentToEdit.phoneNumber || "",
        address: studentToEdit.address || "",
        profileImage: null,
        studentProfileImage: null,
      });
      setPreviewImage(studentToEdit.profileImageUrl || "");
    }
  }, [studentToEdit]);

  // Password rules
  const password = formData.password;
  const passwordRules = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEditMode) {
      setFormData((prev) => ({ ...prev, studentProfileImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
    setError(null);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!isEditMode && !formData.password.trim()) return setError("Password is required");

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("email", formData.email.trim());
    if (!isEditMode && formData.password.trim()) data.append("password", formData.password);
    if (formData.phoneNumber) data.append("phoneNumber", formData.phoneNumber.trim());
    if (formData.address) data.append("address", formData.address.trim());
    if (formData.profileImage) data.append("profileImage", formData.profileImage);
    if (formData.studentProfileImage) data.append("studentProfileImage", formData.studentProfileImage);

    try {
      const message = isEditMode
        ? await updateStudent(studentToEdit._id, data)
        : await addStudent(data);

      setSuccessMessage(message);

      if (!isEditMode) {
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          profileImage: null,
          studentProfileImage: null,
        });
        setPreviewImage("");
        setTimeout(() => onClose?.(), 1500);
      }
    } catch (err) {
      setError(err.message || useStudentStore.getState().error);
    }
  };

  return (
    <>
      {successMessage && <Toast message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}
      {useStudentStore.getState().error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">
          {useStudentStore.getState().error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-1">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required={!isEditMode}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={isEditMode ? "New Password (optional)" : "Password"}
            value={formData.password}
            onChange={handleChange}
            required={!isEditMode}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {password && (
          <div className="text-sm space-y-1 mt-1">
            <p className={passwordRules.length ? "text-green-600" : "text-gray-500"}>Min 6 characters</p>
            <p className={passwordRules.uppercase ? "text-green-600" : "text-gray-500"}>Uppercase letter</p>
            <p className={passwordRules.lowercase ? "text-green-600" : "text-gray-500"}>Lowercase letter</p>
            <p className={passwordRules.number ? "text-green-600" : "text-gray-500"}>Number</p>
            <p className={passwordRules.specialChar ? "text-green-600" : "text-gray-500"}>Special character</p>
          </div>
        )}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number e.g 03441234567 (Optional)"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        <textarea
          name="address"
          placeholder="Address (Optional)"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            name={isEditMode ? "studentProfileImage" : "profileImage"}
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-yellow-100 file:hover:text-yellow-700 transition duration-150 ease-in-out"
          />

          {previewImage && (
            <div className="flex justify-center mt-2">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Student" : "Register Student"}
          </button>
        </div>
      </form>
    </>
  );
}


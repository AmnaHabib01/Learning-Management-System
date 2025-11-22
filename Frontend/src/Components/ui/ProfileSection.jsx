import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Make sure lucide-react is installed

export default function ProfileSection({ user }) {
  const [formData, setFormData] = useState({
    name: user.name,
    password: user.password || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md mx-auto border border-blue-200 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900 mx-4">Admin Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
            isEditing
              ? "bg-gray-100 text-gray-700 border border-blue-900 hover:bg-gray-200"
              : "bg-blue-900 text-yellow-400 hover:bg-blue-800 hover:text-yellow-300"
          }`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-blue-900 font-medium text-sm mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 rounded-2xl border text-blue-900 outline-none transition-all text-sm ${
              isEditing
                ? "border-blue-500 focus:ring-2 focus:ring-yellow-200 bg-white"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-blue-900 font-medium text-sm mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 rounded-2xl border border-yellow-400 bg-gray-100 text-gray-700 text-sm outline-none"
          />
        </div>

        {/* Password with show/hide */}
        <div className="relative">
          <label className="block text-blue-900 font-medium text-sm mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 rounded-2xl border text-blue-900 outline-none transition-all text-sm ${
              isEditing
                ? "border-blue-500 focus:ring-2 focus:ring-yellow-200 bg-white"
                : "bg-gray-100 border-yellow-400 cursor-not-allowed"
            }`}
          />
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-blue-900 font-medium text-sm mb-1">
            Role
          </label>
          <input
            type="text"
            value={user.role}
            disabled
            className="w-full px-4 py-2 rounded-2xl border border-yellow-400 bg-gray-100 text-gray-700 text-sm outline-none"
          />
        </div>

        {/* Save button */}
        {isEditing && (
          <button
            type="submit"
            className="bg-blue-900 text-yellow-400 py-2 rounded-full font-semibold text-base hover:bg-blue-800 hover:text-yellow-300 transition-all mt-1"
          >
            Save Changes
          </button>
        )}
      </form>

      {/* Decorative bubbles */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
    </div>
  );
}

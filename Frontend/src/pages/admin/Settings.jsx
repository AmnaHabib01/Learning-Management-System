import React, { useEffect, useState } from "react";
import useAdminProfileStore from "../../store/adminProfileStore";
import { SpinnerCustom } from "../../Components/ui/spinner";
import { User, Mail, Edit, Save, CheckCircle, XCircle } from "lucide-react";

// Input component
const ProfileInput = ({ icon: Icon, name, value, onChange, disabled, placeholder }) => (
  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg focus-within:border-blue-500 transition-all duration-200 bg-white w-full">
    <Icon className="w-5 h-5 text-blue-900 pointer-events-none" />
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`flex-1 text-base outline-none bg-transparent ${disabled ? "text-gray-600 cursor-default" : "text-gray-900"}`}
    />
  </div>
);

export default function AdminProfilePage() {
  const { user, loading, saving, fetchProfile, updateProfile } = useAdminProfileStore();
  const [formData, setFormData] = useState({ name: "", email: "", profileImage: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, profileImage: null });
      setPreviewImage(user.profileImageUrl || "/default-profile-icon.svg");
    }
  }, [user]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
    setPreviewImage(file ? URL.createObjectURL(file) : user.profileImageUrl);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({ name: user.name, email: user.email, profileImage: null });
      setPreviewImage(user.profileImageUrl);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (formData.name !== user.name) data.append("name", formData.name);
      if (formData.profileImage) data.append("profileImage", formData.profileImage);

      await updateProfile(data);
      setIsEditing(false);
    } catch {}
  };

  if (loading || !user) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <SpinnerCustom className="w-10 h-10 text-blue-900" />
    </div>
  );

  return (
    <div className="w-full min-h-screen p-8 bg-gray-50 flex justify-center items-start">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center border-b pb-3">Admin Profile</h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6 w-full">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <label className={`relative ${isEditing ? "cursor-pointer" : ""}`}>
              <img src={previewImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-900 shadow-lg" />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Edit className="w-8 h-8 text-white" />
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" disabled={!isEditing} onChange={handleFileChange} />
            </label>
            <span className="px-4 py-1.5 bg-blue-900 text-yellow-400 rounded-full text-sm font-semibold">{user.role}</span>
          </div>

          {/* Verification */}
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-900 w-full">
            {user.adminIsVerified ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            <span className={`font-medium ${user.adminIsVerified ? "text-green-700" : "text-red-700"}`}>{user.adminIsVerified ? "Verified" : "Unverified"}</span>
          </div>

          {/* Fields */}
          <ProfileInput icon={User} name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing || saving} placeholder="Full Name" />
          <ProfileInput icon={Mail} name="email" value={formData.email} onChange={handleInputChange} disabled placeholder="Email" />

          {/* Buttons */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-900 text-yellow-400 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                  {saving ? <SpinnerCustom className="w-5 h-5 text-yellow-400" /> : <Save className="w-5 h-5" />} Save
                </button>
                <button type="button" onClick={cancelEdit} disabled={saving} className="flex-1 border border-blue-900 py-2 rounded-lg text-blue-900 font-semibold hover:text-red-600">Cancel</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="flex-1 bg-yellow-300 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"><Edit className="w-5 h-5" /> Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

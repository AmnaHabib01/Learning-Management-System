import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../store/axiosInstance";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const { role, token } = useParams(); // role = teacher | admin | student
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // UI State for message styling
  const [showPassword, setShowPassword] = useState(false); // UI State for toggling password visibility

  const getResetUrl = () => {
    switch (role) {
      case "teacher":
        return `/teacher/reset-password/${token}`;
      case "admin":
        return `/admin/reset-password/${token}`;
      case "student":
        return `/auth/reset-password/${token}`;
      default:
        return "";
    }
  };

  const handleReset = async () => {
    if (!role) {
      setMessage("Invalid role.");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true); // Set error state for styling
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false); // Reset error status

    try {
      const resetUrl = getResetUrl();
      if (!resetUrl) throw new Error("Invalid role or reset URL");

      await api.post(resetUrl, { password });

      setMessage("Password reset successful! Redirecting to login...");
      setIsError(false); // Set success state for styling (blue-900)
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed. Please try again.");
      setIsError(true); // Set error state for styling (yellow-400)
    } finally {
      setLoading(false);
    }
  };

  // --- UI Styling Configuration ---
  const toastBg = isError ? "bg-yellow-400/90" : "bg-blue-900";
  const toastText = isError ? "text-blue-950" : "text-yellow-400";
  // --------------------------------

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Main Card Container */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-xl border-t-8 border-blue-950 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 text-center mb-8 tracking-tight">
        <span className="text-yellow-500">Reset</span> Password
        </h2>

        {/* Message/Toast UI - Using specified blue-900 and yellow-400 colors */}
        {message && (
          <div className={`${toastBg} ${toastText} p-3 rounded-xl mb-6 text-center font-bold text-sm shadow-md transition duration-300 ease-in-out`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* New Password Input */}
          <div className="relative group">
            <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-950 transition-colors duration-300" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-12 py-3.5 text-gray-800 border-b-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white transition duration-300 shadow-inner"
            />
            <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-950 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Confirm Password Input */}
          <div className="relative group">
            <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-950 transition-colors duration-300" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-12 py-3.5 text-gray-800 border-b-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white transition duration-300 shadow-inner"
            />
             <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-950 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading || !password || !confirmPassword}
          className={`w-full py-4 mt-8 font-extrabold rounded-xl text-blue-950 text-lg transition-all duration-300 shadow-xl tracking-wider uppercase
            ${
              loading || !password || !confirmPassword
                ? "bg-yellow-400/80 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-blue-950 hover:text-white transform hover:scale-[1.01]"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={20} /> Resetting...
            </span>
          ) : (
            "Set New Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

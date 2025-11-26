import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, CheckSquare } from "lucide-react";
import userAuth from "../../store/auth/login";
import api from "../../store/axiosInstance";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = userAuth((state) => state.setUser);

  // Map frontend role to backend login endpoint
  const endpointMap = {
    student: "/auth/login",
    teacher: "/teacher/login-teacher",
    admin: "/admin/login-admin",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await api.post(endpointMap[role], { email, password });
      const { user, token } = res.data;

      // Save user state
      setUser(user, token, role);

      // Redirect to dashboard
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-yellow-50 to-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          LMS Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
        )}

        {/* Email */}
        <div className="mb-4 relative">
          <User className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-10 py-2  border-yellow-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <Lock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-10 py-2  border-yellow-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Role */}
        <div className="mb-6 relative">
          <CheckSquare className="absolute top-3 left-3 text-gray-400" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-10 py-2  border-yellow-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-yellow-300 transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

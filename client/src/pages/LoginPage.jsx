import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/todo"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] relative overflow-x-hidden flex flex-col">

      <main className="flex-1 flex justify-center items-start pt-6 pb-20 relative px-6 z-10">

        {/* --- Sign In Card --- */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] w-full max-w-[480px] p-12 z-10 border border-white">
          <h1 className="text-[40px] font-black text-slate-800 text-center mb-10">
            Sign in
          </h1>

          {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label className="text-[12px] font-bold text-slate-400 mb-2 block ml-1 uppercase tracking-tight">
                Enter email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#E5E7EB] border-none rounded-xl py-4 px-5 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[12px] font-bold text-slate-400 mb-2 block ml-1 uppercase tracking-tight">
                Enter your password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#E5E7EB] border-none rounded-xl py-4 px-5 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              className="w-full bg-[#2D3142] text-white py-4 rounded-xl font-black text-sm hover:bg-slate-700 transition-all shadow-lg shadow-slate-200 mt-4 active:scale-[0.98]">
              Sign in
            </button>

            

            {/* Sign Up Link */}
            <p className="text-center text-[13px] font-bold text-slate-400 pt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-slate-800 underline underline-offset-4 hover:text-indigo-600 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

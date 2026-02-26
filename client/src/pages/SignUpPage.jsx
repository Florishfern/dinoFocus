import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type === "text" ? "username" : e.target.type]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/login"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] relative overflow-x-hidden flex flex-col">
      <main className="flex-1 flex justify-center items-start pt-6 pb-20 relative px-6 z-10">
        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] w-full max-w-[500px] p-12 z-20 border border-white mt-4">
          <h1 className="text-[42px] font-black text-slate-800 text-center mb-10">
            Sign up
          </h1>

          {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}

          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Enter your username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Username"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3.5 px-5 text-sm font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Enter your email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3.5 px-5 text-sm font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Enter your password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Password"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3.5 px-5 text-sm font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D3142] text-white py-4 rounded-xl font-black text-sm hover:bg-slate-700 transition-all mt-4 active:scale-[0.98]"
            >
              {loading ? 'Registering...' : 'Sign up'}
            </button>


            <p className="text-center text-[13px] font-bold text-slate-400 pt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-800 underline underline-offset-4 hover:text-indigo-600 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-[120px] pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-t from-[#A3B18A]/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default SignUpPage;

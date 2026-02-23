import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import Coin from "./Coin";

// เพิ่ม Props: showCoins (ค่าเริ่มต้นเป็น true), showSignIn (ค่าเริ่มต้นเป็น false)
const Navbar = ({ showCoins = true, showSignIn = false }) => {
  const location = useLocation();
  const navigate = useNavigate(); // สำหรับปุ่ม Sign in

  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!token || !showCoins) return;
      try {
        const response = await fetch("http://localhost:5050/api/users/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          setBalance(result.data.coins); // เก็บค่า coins ลงใน state
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();

    window.addEventListener("balanceUpdated", fetchBalance); // ดักฟัง Event
    return () => window.removeEventListener("balanceUpdated", fetchBalance);
  }, [token, showCoins]);

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-bold"
      : "text-slate-500 hover:text-slate-900 font-bold";

  return (
    <nav className="flex items-center justify-between px-10 py-7 max-w-[1300px] mx-auto w-full">
      {/* 1. Logo Section */}
      <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-9 h-9 bg-sky-400 rounded-xl shadow-sm flex items-center justify-center text-white text-lg font-black group-hover:scale-105 transition-transform">
          D
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900">
          DinoFocus
        </span>
      </Link>

      {/* 2. Menu Links */}
      <div className="hidden md:flex bg-white shadow-sm p-1 rounded-full px-8 py-2.5 gap-7 text-[14px] border border-slate-200/40">
        <Link to="/timer" className={isActive("/timer")}>
          Timer
        </Link>
        <Link to="/todo" className={isActive("/todo")}>
          To-do list
        </Link>
        <Link to="/dino" className={isActive("/dino")}>
          Dino
        </Link>
        <Link to="/profile" className={isActive("/profile")}>
          Profile
        </Link>
      </div>

      {/* 3. ส่วนด้านขวา (Coin หรือ Sign in) */}
      <div className="flex items-center gap-4">
        {/* แสดงเหรียญเฉพาะเมื่อ showCoins เป็น true */}
        {showCoins && <Coin amount={balance} />}

        {/* แสดงปุ่ม Sign in เฉพาะเมื่อ showSignIn เป็น true */}
        {showSignIn && (
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-300 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-400 transition-all"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

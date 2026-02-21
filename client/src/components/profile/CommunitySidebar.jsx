// CommunitySidebar.jsx (เวอร์ชันโครงสร้างเดิมเป๊ะ แค่เปลี่ยนข้อมูลเป็น API)
import React, { useState, useEffect } from "react";
import axios from "axios";

// CommunityCard ยังคงดีไซน์เดิมของคุณไว้ทุกบรรทัด
const CommunityCard = ({ name, role, streak, type, onAccept }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 group hover:shadow-md transition-shadow">
    <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
        alt="avatar"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="text-[11px] font-black text-slate-700 truncate">
          {name}
        </h4>
        <span className="text-[9px] text-orange-500 font-bold flex items-center gap-0.5">
          🔥 {streak}
        </span>
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            {role}
          </span>
        </div>
        {type === "community" && (
          <button className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase">
            + Add
          </button>
        )}
        {type === "request" && (
          <div className="flex gap-1">
            <button
              onClick={onAccept} // เชื่อมฟังก์ชันกด Accept
              className="bg-[#DCFCE7] text-[8px] font-black px-2 py-1 rounded text-[#166534] hover:bg-[#22C55E] hover:text-white transition-colors uppercase"
            >
              Accept
            </button>
            <button className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors uppercase">
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CommunitySidebar = () => {
  // สร้าง State มารองรับข้อมูลจาก API
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const resList = await axios.get(
          "http://localhost:5050/api/community/list",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const resReq = await axios.get(
          "http://localhost:5050/api/community/requests",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFriends(resList.data.data);
        setRequests(resReq.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="col-span-3 border-l border-slate-200 pl-8 space-y-8">
      {/* 1. Community (Leaderboard/Search) - ดีไซน์เดิมคุณ */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
          DinoFocus Community
        </h3>
        {/* Search Bar ของคุณ... */}
        {/* Search Bar คงเดิม */}

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#E2E8F0] border-none rounded-lg py-2 px-4 text-xs focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <button className="bg-[#A1A1AA] hover:bg-slate-500 text-white w-9 h-8 rounded-lg flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <CommunityCard
            name="Tommy Holland"
            role="UK/UI"
            streak="7d"
            type="community"
          />
        </div>
      </div>

      {/* 2. Friends Section - ใช้ข้อมูลจริงจาก API */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
          Friends
        </h3>
        <div className="space-y-3">
          {friends.map((friend) => (
            <CommunityCard
              key={friend.user_id}
              name={friend.username}
              role={friend.major}
              streak="Active"
              type="friend"
            />
          ))}
        </div>
      </div>

      {/* 3. Request Section - ใช้ข้อมูลจริงจาก API */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
          Request
        </h3>
        <div className="space-y-3">
          {requests.map((req) => (
            <CommunityCard
              key={req.requestId}
              name={req.username}
              role={req.major}
              streak="New"
              type="request"
              onAccept={() => handleAccept(req.requestId)} // เพิ่มตรงนี้เพื่อให้ปุ่มกดได้จริง
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;

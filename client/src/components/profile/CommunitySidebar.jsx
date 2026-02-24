// CommunitySidebar.jsx (เวอร์ชันแก้ไข Logic รูปภาพให้ถูกต้อง)
import React, { useState, useEffect } from "react";
import axios from "axios";

// CommunityCard ยังคงดีไซน์เดิมของคุณไว้ทุกบรรทัด
const CommunityCard = ({
  name,
  role,
  streak,
  type,
  onAccept,
  onDecline,
  onAdd,
  profile_image,
  onViewProfile 
}) => {
  // ✅ ย้าย Logic มาไว้ตรงนี้ เพื่อให้ใช้ค่า profile_image และ name ของแต่ละคนได้ถูกต้อง
  const hasValidImage = profile_image && profile_image !== "default-avatar.png";

  const avatarUrl = hasValidImage 
    ? profile_image 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  return (
    <div 
      onClick={onViewProfile}
      className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 group hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-full h-full object-cover"
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
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase"
            >
              + Add
            </button>
          )}
          {type === "request" && (
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onAccept(); }}
                className="bg-[#DCFCE7] text-[8px] font-black px-2 py-1 rounded text-[#166534] hover:bg-[#22C55E] hover:text-white transition-colors uppercase"
              >
                Accept
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDecline(); }}
                className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors uppercase"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommunitySidebar = ({onSelectUser}) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [topFocusUsers, setTopFocusUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5050/api/community/search?username=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data.data || []);
      setIsSearching(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await axios.post(
        "http://localhost:5050/api/community/add-friend",
        { receiver_id: receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Friend request sent!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send request");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resList, resReq, resLeaderboard] = await Promise.all([
          axios.get("http://localhost:5050/api/community/list", { headers }),
          axios.get("http://localhost:5050/api/community/requests", { headers }),
          axios.get("http://localhost:5050/api/community/leaderboard", { headers }),
        ]);
        setFriends(resList.data.data || []);
        setRequests(resReq.data.data || []);
        setTopFocusUsers(resLeaderboard.data.data || []);
      } catch (err) {
        console.error("Error fetching community data:", err);
      }
    };
    fetchData();
  }, [token]);

  const handleAccept = async (requestId) => {
    try {
      await axios.patch(
        "http://localhost:5050/api/community/accept-friend",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.delete(
        `http://localhost:5050/api/community/decline-friend/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error("Decline error:", err);
    }
  };

  const handleViewProfile = async (userId) => {
    console.log("กำลังกดดูโปรไฟล์ของ ID:", userId);
    try {
      const res = await axios.get(`http://localhost:5050/api/community/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("ดึงข้อมูลสำเร็จ:", res.data.data); // 👈 เพิ่มบรรทัดนี้
      // ✅ ส่งข้อมูลเพื่อนกลับไปที่ Component แม่ (Page หลัก) เพื่อให้ ProfileMain แสดงผล
      if (onSelectUser) {
        onSelectUser(res.data.data); 
      }
    } catch (err) {
      console.error("View Profile Error:", err);
    }
  };

  // ⚠️ ลบ avatarUrl ของเดิมตรงนี้ออกไปแล้ว เพื่อไม่ให้เกิด Error

  return (
    <div className="col-span-3 border-l border-slate-200 pl-8 space-y-8">
      {/* 1. Community Section */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
          DinoFocus Community
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#E2E8F0] border-none rounded-lg py-2 px-4 text-xs focus:outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="submit" className="bg-[#A1A1AA] hover:bg-slate-500 text-white w-9 h-8 rounded-lg flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="space-y-3">
          {isSearching ? (
            <>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-[10px] font-bold text-indigo-500 uppercase">Results</h4>
                <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className="text-[9px] text-slate-400 hover:text-slate-600 underline">
                  Close
                </button>
              </div>
              {searchResults.map((user) => (
                <CommunityCard
                  key={user.user_id}
                  name={user.username}
                  role={user.major}
                  streak="User"
                  type="community"
                  profile_image={user.profile_image} // ✅ ส่งรูป
                  onAdd={() => handleAddFriend(user.user_id)}
                />
              ))}
              {searchResults.length === 0 && <p className="text-[10px] text-slate-400 text-center">No user found.</p>}
            </>
          ) : (
            topFocusUsers.map((user, index) => (
              <CommunityCard
                key={index}
                name={user.username}
                role={user.major}
                streak={`${user.streaks}d`}
                type="community"
                profile_image={user.profile_image} // ✅ ส่งรูป
                onAdd={() => handleAddFriend(user.user_id)}
              />
            ))
          )}
        </div>
      </div>

      {/* 2. Friends Section */}
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
              profile_image={friend.profile_image} // ✅ ส่งรูป
              onViewProfile={() => handleViewProfile(friend.user_id)}
            />
          ))}
        </div>
      </div>

      {/* 3. Request Section */}
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
              profile_image={req.profile_image} // ✅ ส่งรูป
              onAccept={() => handleAccept(req.requestId)}
              onDecline={() => handleDecline(req.requestId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
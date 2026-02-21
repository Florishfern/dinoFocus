import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
// ตรวจสอบ path อีกครั้งว่า 'profile' หรือ 'Profile'
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileMain from "../components/profile/ProfileMain";
import CommunitySidebar from "../components/profile/CommunitySidebar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    role: "",
    location: "",
    avatar: "",
  });
  const [stats, setStats] = useState({
    monthly_focus: "0h 0m",
    Task_success: 0,
    task_fail: 0,
  });
  const [collection, setCollection] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { profile: userData, summary, dino_collection } = res.data.data;

      setProfile({
        name: userData.username,
        bio: userData.bio || "No bio yet",
        role: userData.major || "No Major",
        location: "Thailand", // ตามดีไซน์เดิม
        avatar: userData.profile_image,
        streak: userData.consecutive_days || 0,
      });
      setStats(summary);
      setCollection(dino_collection);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5050/api/users/profile/update",
        {
          username: profile.name,
          bio: profile.bio,
          major: profile.role,
          profile_image: profile.avatar, // ส่ง URL ของ DiceBear ไปเก็บใน DB
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleGenerateAvatar = () => {
    if (!isEditing) return;
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setProfile({ ...profile, avatar: newAvatarUrl });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center font-black text-slate-400">
        LOADING...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar />
      <main className="max-w-[1200px] mx-auto mt-12 px-8 grid grid-cols-12 gap-12">
        <ProfileSidebar
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
          onRandomAvatar={handleGenerateAvatar}
        />
        <ProfileMain
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          profile={profile}
          setProfile={setProfile}
          stats={stats}
          collection={collection}
          onSave={handleUpdateProfile}
          onRandomAvatar={handleGenerateAvatar}
        />
        <CommunitySidebar />
      </main>
    </div>
  );
};

export default ProfilePage;

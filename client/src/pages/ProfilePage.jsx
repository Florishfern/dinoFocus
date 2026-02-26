import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
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

  const [displayData, setDisplayData] = useState(null); 
  const [isViewingFriend, setIsViewingFriend] = useState(false);

  const currentProfile = isViewingFriend ? displayData.profile : profile;
  const currentStats = isViewingFriend ? displayData.stats : stats;
  const currentCollection = isViewingFriend ? displayData.collection : collection;

  const token = localStorage.getItem("token");

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("https://dinofocus.onrender.com/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { profile: userData, summary, dino_collection } = res.data.data;

      setProfile({
        name: userData.username,
        bio: userData.bio || "No bio yet",
        role: userData.major || "No Major",
        location: "Thailand", 
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

  const fetchMyProfile = async () => {
    setIsViewingFriend(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        "https://dinofocus.onrender.com/api/users/profile/update",
        {
          username: profile.name,
          bio: profile.bio,
          major: profile.role,
          profile_image: profile.avatar, 
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
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
      
      <main className="max-w-[1200px] mx-auto mt-12 px-8">

        {isViewingFriend && (
          <button 
            onClick={() => setIsViewingFriend(false)} 
            className="flex items-center gap-2 mb-6 text-slate-400 hover:text-indigo-600 font-black text-[11px] uppercase tracking-widest transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Profile
          </button>
        )}

        <div className="grid grid-cols-12 gap-12">
          <ProfileSidebar
            isEditing={!isViewingFriend && isEditing}
            profile={currentProfile}
            setProfile={setProfile}
            onRandomAvatar={handleGenerateAvatar}
          />
          <ProfileMain
            isEditing={!isViewingFriend && isEditing}
            setIsEditing={setIsEditing}
            profile={currentProfile}
            setProfile={setProfile}
            stats={currentStats}
            collection={currentCollection}
            onSave={handleUpdateProfile}
            onRandomAvatar={handleGenerateAvatar}
            isViewingFriend={isViewingFriend} 
          />
          <CommunitySidebar 
            onSelectUser={(data) => {
              setDisplayData(data);
              setIsViewingFriend(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
// ตรวจสอบ path อีกครั้งว่า 'profile' หรือ 'Profile'
import ProfileSidebar from '../components/profile/ProfileSidebar'; 
import ProfileMain from '../components/profile/ProfileMain';
import CommunitySidebar from '../components/profile/CommunitySidebar';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Natteraya",
    bio: "I'm a software engineer passionate about building web applications and cleanvcode. I'm a firm believer in the 'always be learning' philosophy.",
    role: "Software engineer",
    location: "Thailand"
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar />
      
      {/* ส่วน Main Layout */}
      <main className="max-w-[1200px] mx-auto mt-12 px-8 grid grid-cols-12 gap-12">
        
        {/* คอลัมน์ซ้าย: รูปและ Status */}
        <ProfileSidebar 
          isEditing={isEditing} 
          profile={profile} 
          setProfile={setProfile} 
        />

        {/* คอลัมน์กลาง: ชื่อ, Bio, Collection, Summary */}
        <ProfileMain 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          profile={profile} 
          setProfile={setProfile} 
        />

        {/* คอลัมน์ขวา: Community */}
        <CommunitySidebar />

      </main>
    </div>
  );
};

export default ProfilePage;
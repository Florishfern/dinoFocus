import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DinoSection from "../components/timer/DinoSection";
import TaskSection from "../components/timer/TaskSection";
import TimerSection from "../components/timer/TimerSection";
import axios from "axios";

const TimerPage = () => {
  const [activeDino, setActiveDino] = useState(null);

  useEffect(() => {
    const fetchActivePet = async () => {
      try {
        const token = localStorage.getItem('token');
        // ใช้ Route ที่เชื่อมกับ getMyDinosByRarity หรือ API ที่ดึงสัตว์เลี้ยงทั้งหมด
        const response = await axios.get('http://localhost:3000/api/pets/active', {
          headers: { Authorization: `Bearer ${token.trim()}` }
        });
        
        if (response.data && response.data.data) {
          setActiveDino(response.data.data);
        }else{
          setActiveDino(response.data);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้:", error);
      }
    };
  fetchActivePet();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="max-w-[1250px] mx-auto mt-5 px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          <TaskSection />
          <DinoSection dino={activeDino}/>
          <TimerSection />
        </div>
      </main>
    </div>
  );
};

export default TimerPage;
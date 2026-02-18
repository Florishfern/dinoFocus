import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DinoSection from "../components/timer/DinoSection";
import TaskSection from "../components/timer/TaskSection";
import TimerSection from "../components/timer/TimerSection";
import axios from "axios";

const TimerPage = () => {
  const [activeDino, setActiveDino] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // 1. เพิ่ม State สำหรับเก็บงาน (จุดที่ขาดไป)
  const [tasks, setTasks] = useState([]); 

  const token = localStorage.getItem('token');
  const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Bangkok'});

  const fetchTasks = async () => {
    try {
      if (!token) return;
      const response = await axios.get(`http://localhost:3000/api/tasks?date=${today}`, {
        headers: { Authorization: `Bearer ${token.trim()}` }
      });
      setTasks(response.data.tasks || []); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const fetchActivePet = async () => {
      try {
        if (!token) return;
        const response = await axios.get('http://localhost:3000/api/pets/active', {
          headers: { Authorization: `Bearer ${token.trim()}` }
        });
        
        if (response.data && response.data.data) {
          setActiveDino(response.data.data);
        } else {
          setActiveDino(response.data);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้:", error);
      }
    };

    fetchActivePet();
    fetchTasks(); // 2. สั่งให้โหลดงานตอนเปิดหน้า (จุดที่ขาดไป)
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="max-w-[1250px] mx-auto mt-5 px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          
          {/* 3. ส่ง Props ไปให้ลูกๆ (จุดที่ขาดไป) */}
          <TaskSection 
            todoList={tasks} // ส่งรายการงาน
            fetchTasks={fetchTasks} // ส่งฟังก์ชันไปให้ลูกใช้รีเฟรช
            onSelectTask={setSelectedTask} 
            selectedTaskId={selectedTask?.task_id}
          />
          
          <DinoSection dino={activeDino}/>

          <TimerSection 
            activeTask={selectedTask}
            onTaskFinished={() => {
              fetchTasks(); // เมื่อจับเวลาจบ ให้ดึงงานใหม่ งานที่เสร็จจะหายไปเอง
              setSelectedTask(null); // ล้างค่าที่เลือกไว้
            }}
          />
          
        </div>
      </main>
    </div>
  );
};

export default TimerPage;
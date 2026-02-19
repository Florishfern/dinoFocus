import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DinoSection from "../components/timer/DinoSection";
import TaskSection from "../components/timer/TaskSection";
import TimerSection from "../components/timer/TimerSection";
import axios from "axios";

const TimerPage = () => {
  const [activeDino, setActiveDino] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [categories, setCategories] = useState([]);

  // 1. เพิ่ม State สำหรับเก็บงาน (จุดที่ขาดไป)
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // เก็บข้อมูล Array ของหมวดหมู่
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        `http://localhost:5050/api/tasks?date=${today}`,
        {
          headers: { Authorization: `Bearer ${token.trim()}` },
        },
      );
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const fetchActivePet = async () => {
      try {
        if (!token) return;
        const response = await axios.get(
          "http://localhost:5050/api/pets/active",
          {
            headers: { Authorization: `Bearer ${token.trim()}` },
          },
        );

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
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="max-w-[1250px] mx-auto mt-5 px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* 3. ส่ง Props ไปให้ลูกๆ (จุดที่ขาดไป) */}
          <TaskSection
            todoList={tasks} // ส่งรายการงาน
            categories={categories}
            fetchTasks={fetchTasks} // ส่งฟังก์ชันไปให้ลูกใช้รีเฟรช
            onSelectTask={(task) => {
              console.log("TimerPage received task:", task); // เช็คว่าตัวแม่ได้รับงานไหม
              setSelectedTask(task);
            }}
            selectedTaskId={selectedTask?.task_id}
          />

          <DinoSection dino={activeDino} />

          <TimerSection
            key={selectedTask?.task_id || 'no-task'}
            activeTask={selectedTask}
            onTaskFinished={async () => {
              await fetchTasks(); // รอให้ดึงข้อมูลใหม่เสร็จก่อน
              setSelectedTask(null); // แล้วค่อยล้างค่า Task ที่เลือกไว้
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default TimerPage;

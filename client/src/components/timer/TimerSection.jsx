import React, { useState, useEffect } from "react";
import axios from "axios";

const TimerSection = ({ activeTask, onTaskFinished }) => {
  const [inputValue, setInputValue] = useState("25:00");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(1500);

  useEffect(() => {
    if (activeTask) {
      const minutes = activeTask.focus_time_spent || 25;
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setInitialTime(seconds);
      setInputValue(`${minutes.toString().padStart(2, "0")}:00`);
      setIsRunning(false); // หยุดตัวนับเวลาชั่วคราวเพื่อให้ผู้ใช้กด Start เอง
    }
  }, [activeTask]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    alert("Focus session finished!");

    if (activeTask) {
      try {
        const token = localStorage.getItem("token");
        const secondsSpent = initialTime - timeLeft;
        const actualMinutes = Math.max(1, Math.round(secondsSpent / 60));

        const payload = {
          task_id: activeTask.task_id,
          planned_minutes: activeTask.focus_time_spent,
          actual_minutes: actualMinutes, // หรือจะส่งตามเวลาที่เดินจริง
          category_id: activeTask.category_id,
        };

        const response = await axios.post(
          "http://localhost:3000/api/focus",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          alert(
            `Saved! You spent ${actualMinutes} mins focus on "${activeTask.title}"`,
          );
          // แจ้งไฟล์แม่ให้โหลด Task ใหม่ (งานที่เสร็จจะได้หายไป)
          if (onTaskFinished) onTaskFinished();
        }
        // เพิ่มเติม: อาจจะเรียก callback เพื่อ refresh ข้อมูลหน้าหลัก
      } catch (error) {
        console.error("Error saving focus session:", error);
      }
    } else {
      alert("Focus session finished!");
    }
  };

  const handleToggle = () => {
    if (isRunning) {
      // ถ้ากดปุ่มขณะที่นาฬิกาเดินอยู่ (ปุ่ม Finish)
      if (window.confirm("Do you want to finish and save your progress now?")) {
        handleTimerComplete();
      }
    } else {
      // ถ้ายังไม่รัน ให้เริ่ม Start
      if (!activeTask) {
        // กรณีไม่ได้เลือก Task แต่จะกด Start (ใช้เวลาจาก input)
        const [m, s] = inputValue.split(":").map(Number);
        const totalSeconds = (m || 0) * 60 + (s || 0);
        setTimeLeft(totalSeconds);
        setInitialTime(totalSeconds);
      }
      setIsRunning(true);
    }
  };

  const displayTime = () => {
    const m = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="col-span-3 bg-white rounded-[32px] p-9 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 min-h-[460px] flex flex-col items-center justify-between">
      <h2 className="text-3xl font-black text-center text-slate-800">Timer</h2>

      <div className="relative flex items-center justify-center my-4">
        <svg className="w-52 h-52 -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="95"
            stroke="#F1F5F9"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="104"
            cy="104"
            r="95"
            stroke="#6366F1"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="597"
            strokeDashoffset={597 - (timeLeft / (initialTime || 1)) * 597}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <input
            type="text"
            value={isRunning ? displayTime() : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isRunning}
            // text-slate-900 คือสีปกติ
            // focus:text-indigo-600 คือสีตอนคลิกเข้าไปพิมพ์
            className="w-36 bg-transparent text-4xl font-black text-center outline-none transition-colors duration-200 text-slate-900 focus:text-indigo-600 cursor-text"
            placeholder="25:00"
          />
        </div>
      </div>

      <button
        onClick={handleToggle} // เปลี่ยนจาก toggleTimer เป็น handleToggle
        className={`w-full max-w-[160px] py-4 rounded-[22px] font-black uppercase tracking-widest transition-all ${
          isRunning
            ? "bg-red-500 text-white shadow-lg shadow-red-100" // สีแดงเมื่อกำลังรัน (ปุ่ม Finish)
            : "bg-[#2D3142] text-white" // สีปกติ (ปุ่ม Start)
        }`}
      >
        {isRunning ? "Finish" : "Start"}
      </button>
    </div>
  );
};

export default TimerSection;

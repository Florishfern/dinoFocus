import React, { useState, useEffect } from "react";

const TimerSection = () => {
  const [inputValue, setInputValue] = useState("25:00");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (!isRunning) {
      const [m, s] = inputValue.split(":").map(Number);
      setTimeLeft((m || 0) * 60 + (s || 0));
    }
    setIsRunning(!isRunning);
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
      <h2 className="text-3xl font-black text-center text-slate-800">
        Timer
      </h2>

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
            strokeDashoffset={597 - (timeLeft / 1500) * 597}
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
        onClick={toggleTimer}
        className="w-full max-w-[160px] bg-[#2D3142] text-white py-4 rounded-[22px] font-black uppercase tracking-widest"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default TimerSection;

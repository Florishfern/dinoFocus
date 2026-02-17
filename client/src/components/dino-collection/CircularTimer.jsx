import React from 'react';

const CircularTimer = ({ minutes = 25, seconds = 0 }) => {
  // คำนวณเส้นรอบวง (Circumference) ของวงกลม
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // ตัวอย่าง Progress (ในที่นี้ตั้งไว้ที่ 75% ตามรูป)
  const strokeDashoffset = circumference - (75 / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-black text-[#1E293B] mb-12 self-start ml-4">Timer</h2>
      
      <div className="relative flex items-center justify-center">
        {/* SVG วงกลม */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* วงกลมพื้นหลัง (สีจาง) */}
          <circle
            stroke="#F1F5F9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* วงกลม Progress (สีม่วง/น้ำเงิน) */}
          <circle
            stroke="#6366F1"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* ตัวเลขเวลาตรงกลาง */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[54px] font-black text-[#1E293B] leading-none">
            25:00
          </span>
          <span className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2">
            Minutes
          </span>
        </div>
      </div>

      {/* ปุ่ม Start ด้านล่าง */}
      <button className="mt-16 bg-[#2D2E3E] text-white w-full max-w-[200px] py-4 rounded-[24px] text-lg font-black shadow-lg hover:scale-105 transition-transform">
        START
      </button>
    </div>
  );
};

export default CircularTimer;
import React from "react";

const DinoCard = ({ name, img }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      {/* 1. ลด mb จาก 4 เหลือ 1 หรือ 2 เพื่อให้ชื่อขยับลงมาใกล้รูปมากขึ้น */}
      <span className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-tighter group-hover:text-slate-600 transition-colors">
        {name}
      </span>

      {/* 2. เปลี่ยน h-42 เป็น h-40 ให้เท่ากับขนาดรูปพอดี และลด mb ลง */}
      <div className="relative mb-2 h-40 flex items-end justify-center">
        {/* ปรับเงาให้กว้างขึ้นนิดนึงเพื่อให้สมดุลกับตัวละครที่ใหญ่ขึ้น */}
        <div className="absolute bottom-1 w-24 h-4 bg-black/5 rounded-[100%] blur-md group-hover:bg-black/10 transition-all"></div>
        
        <img
          src={img}
          alt={name}
          className="w-40 h-40 object-contain relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2"
        />
      </div>

      <button className="bg-[#CBD5E1] text-white px-8 py-1.5 rounded-full text-[10px] font-black tracking-widest hover:bg-[#94A3B8] transition-all uppercase shadow-sm active:scale-90">
        select
      </button>
    </div>
  );
};

export default DinoCard;
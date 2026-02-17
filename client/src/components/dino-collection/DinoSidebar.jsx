// src/components/DinoSidebar.jsx
import React from "react";

const DinoSidebar = ({ rarities, selectedRarity, onSelectRarity }) => {
  return (
    <div className="col-span-3 space-y-16">
      {/* Rarity Selectors */}
      <div className="space-y-5">
        {rarities.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelectRarity(item.label)}
            className={`w-full py-2.5 rounded-2xl text-[11px] font-black transition-all duration-300 shadow-sm
              ${
                selectedRarity === item.label
                  ? `${item.activeColor} text-white scale-105 shadow-lg translate-x-2`
                  : "bg-white text-slate-300 hover:text-slate-400 hover:bg-slate-50"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Gacha Box - จัดระเบียบระยะใหม่ตรงนี้ครับ */}
      {/* 1. บีบความกว้าง (max-w), ลด Padding (p-4), และลดความโค้ง (rounded-[24px]) */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col items-center border border-slate-100 max-w-[180px] mx-auto">
        {/* 2. ย่อขนาดป้ายราคาและฟอนต์ */}
        <div className="flex items-center gap-1 bg-[#FFF9E5] px-3 py-0.5 rounded-full mb-1">
          <span className="text-[12px]">💰</span>
          <span className="font-black text-[#FBBF24] text-[11px]">1000</span>
        </div>

        {/* 3. ย่อรูป Box ลงเหลือ w-32 (ประมาณ 128px) */}
        <img
          src="assets/mystery_box.png"
          alt="box"
          className="w-32 h-32 object-contain mb-1 drop-shadow-sm -mt-1"
        />

        {/* 4. ปรับปุ่มให้สั้นลงและใช้ฟอนต์จิ๋วแต่หนา */}
        <button className="px-6 py-1.5 bg-[#FBBF24] text-white rounded-xl text-[10px] font-extrabold hover:opacity-80 transition-all uppercase tracking-tight shadow-sm active:scale-95">
          Buy
        </button>
      </div>
    </div>
  );
};

export default DinoSidebar;

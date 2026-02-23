import React from "react";
import { motion } from "framer-motion";

const DinoSection = ({ dino }) => {
  // 1. จัดการ Folder ตาม rarity (แปลงเป็นตัวพิมพ์เล็กให้ตรงกับชื่อโฟลเดอร์ใน public)
  const rarityFolder = dino?.rarity ? dino.rarity.toLowerCase() : "common";

  // 2. ตรวจสอบชื่อไฟล์ภาพจาก Database
  const rawName = dino?.image_url || "Grape_Greet.png";
  
  // 3. จัดการนามสกุลไฟล์ (ถ้าไม่มี .png ให้เติมเข้าไป)
  // *** ต้องประกาศตัวแปรนี้ก่อนที่จะนำไปใช้ใน imagePath ***

  // 4. รวมร่างเป็น Path ที่ถูกต้อง
  const imagePath = dino?.image_url || "/characters/epic/Grape_Greet.png";

  console.log("Dino Image Path จาก DB:", imagePath);

  // 5. คำนวณ % ของ Exp สำหรับหลอดค่าพลัง
  const currentExp = dino?.exp || 0;
  const maxExp = (dino?.level || 1) * 100; 
  const expPercentage = Math.min((currentExp / maxExp) * 100, 100);

  // Debug: ดู Path ที่ถูกสร้างขึ้นใน Console ของ Browser
  console.log("Dino Image Path:", imagePath);

  return (
    <div className="col-span-5 flex flex-col items-center">
      
      {/* ส่วนหลอด Exp */}
      <div className="-mb-8 text-center w-full max-w-[180px]">
        <div className="flex justify-between mb-2 px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase">
            Lv. {dino?.level || 1}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase">
            {currentExp} / {maxExp}
          </span>
        </div>
        <div className="bg-white h-1.5 w-full rounded-full overflow-hidden shadow-sm">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${expPercentage}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full"
          ></motion.div>
        </div>
      </div>

      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        {/* รูปภาพไดโนเสาร์ */}
        <motion.img
          key={imagePath} 
          src={imagePath}
          alt={dino?.dino_name || "Dino"}
          className="w-full h-auto drop-shadow-2xl z-10"
          onError={(e) => {
            // ถ้าโหลดรูปไม่ขึ้น ให้ใช้รูปสำรองจากโฟลเดอร์ common
            e.target.src = "/characters/common/Grape_Greet.png";
            console.error("Failed to load image at:", imagePath);
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [-1, 1, -1],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* เงาด้านล่าง */}
        <motion.div
          className="w-32 h-4 bg-slate-900/10 rounded-[100%] blur-md -mt-12"
          animate={{
            scale: [1, 0.7, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ชื่อไดโนเสาร์ */}
      <h3 className="text-xl font-bold text-slate-700 mt-2 tracking-wide text-center w-full uppercase">
        {dino?.dino_name || "Searching..."}
      </h3>
    </div>
  );
};

export default DinoSection;
const DinoCard = ({ name, img, onSelect, isActive, level }) => {
  const isMaxLevel = level === 20;
  return (
    <div className="flex flex-col items-center group cursor-pointer"> {/* เพิ่ม cursor-pointer ให้รู้ว่าคลิกได้ */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-600">
          {name}
        </span>
        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded-md font-bold">
          Lv.{level}
        </span>
      </div>

      <div className="relative mb-2 h-40 flex items-end justify-center">
        <div className="absolute bottom-1 w-24 h-4 bg-black/5 rounded-[100%] blur-md group-hover:bg-black/10 transition-all"></div>
        
        <img
          src={img}
          alt={name}
          className={`w-40 h-40 object-contain relative z-10 transition-all duration-500 
            /* สีสดใส (grayscale-0) และชัดเจน (opacity-100) เสมอ */
            grayscale-0 opacity-100 
            /* ขยายใหญ่ขึ้น 110% เมื่อ Hover ตามที่คุณต้องการ */
            group-hover:scale-110 group-hover:-translate-y-2
            /* ถ้า isActive ให้มีเอฟเฟกต์ลอยนิดๆ ไว้ด้วย */
            ${isActive ? "scale-105 drop-shadow-xl" : ""} 
          `}
        />
      </div>

      <button 
        onClick={onSelect}
        // ห้ามกดถ้า: 1. ใช้งานอยู่แล้ว (isActive) หรือ 2. เลเวลเต็ม (isMaxLevel)
        disabled={isActive || isMaxLevel} 
        className={`px-8 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all uppercase shadow-sm active:scale-90
          ${isActive 
            ? "bg-slate-500 text-white cursor-default" // สีเมื่อเลือกอยู่
            : isMaxLevel
              ? "bg-red-200 text-red-500 cursor-not-allowed" // สีเมื่อเลเวลเต็มแล้วห้ามเลือก
              : "bg-[#CBD5E1] text-white hover:bg-[#94A3B8]" // สีปกติที่คุณออกแบบ
          }`}
      >
        {isActive ? "Selected" : isMaxLevel ? "Max Level" : "Select"}
      </button>
    </div>
  );
};

export default DinoCard;
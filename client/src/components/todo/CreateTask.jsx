import React, { useState, useRef, useEffect } from "react";

// เพิ่มการรับ props { categories } เข้ามา
const CreateTask = ({ onAddTask, categories = [] }) => {
  const [title, setTitle] = useState("");
  const [mins, setMins] = useState("");
  // เปลี่ยนมาใช้ ID เพื่อให้แม่นยำเหมือนหน้า Timer
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  
  // State สำหรับควบคุม Dropdown เหมือนหน้า Timer
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ตั้งค่า Default และจัดการคลิกข้างนอกเพื่อปิดเมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categories, selectedCategoryId]);

  // หาข้อมูล Category ที่เลือกอยู่
  const selectedCat = categories?.find(c => String(c.category_id) === String(selectedCategoryId));

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title,
      time: mins || "15",
      categoryName: selectedCat?.name || "Work", // ส่งชื่อกลับไปตาม Logic เดิม
    });

    setTitle("");
    setMins("");
    // ไม่ต้องล้าง Category เพื่อให้ผู้ใช้แอดงานหมวดเดิมต่อเนื่องได้สะดวก
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-black text-slate-800 mb-4">Create Tasks</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        {/* ช่อง Task Name - ไม่แก้ */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 bg-gray-200 border-none rounded-lg px-4 py-3.5 text-sm font-bold outline-none text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        {/* ช่อง Mins - ไม่แก้ */}
        <input
          type="number"
          min="1" 
          value={mins}
          onChange={(e) => {
            const val = e.target.value;
            if (val !== "" && parseInt(val) < 0) {
              setMins("0");
            } else {
              setMins(val);
            }
          }}
          onPaste={(e) => {
            const pasteData = e.clipboardData.getData("text");
            if (pasteData.includes("-")) {
              e.preventDefault();
            }
          }}
          placeholder="mins"
          className="w-20 bg-gray-200 border-none rounded-lg px-2 py-3.5 text-center text-xs font-bold outline-none text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        {/* ส่วน Custom Dropdown - แก้ไขจาก datalist เป็นแบบหน้า Timer */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-32 rounded-lg py-3.5 px-3 flex items-center justify-between font-bold text-xs transition-all outline-none focus:ring-2 focus:ring-indigo-500
              ${selectedCat ? 'bg-white border-2 border-indigo-400 text-indigo-500' : 'bg-gray-200 border-none text-slate-400'}`}
          >
            <span className="flex items-center gap-1.5 overflow-hidden">
              {/* เงื่อนไข: มีการเลือกแล้วถึงจะโชว์จุดวงกลม */}
              {selectedCat && (
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: selectedCat.color_code }}
                ></div>
              )}
              <span className="truncate">
                {selectedCat ? selectedCat.name : "category"}
              </span>
            </span>
            <span className={`transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* เมนู Dropdown (เด้งลงล่าง + Scroll ได้) */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] py-2 z-50 border border-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* ติ่งสามเหลี่ยมชี้ขึ้น */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-slate-50"></div>
              
              <div className="max-h-[180px] overflow-y-auto custom-scrollbar flex flex-col">
                {categories.map((item) => (
                  <button
                    key={item.category_id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(item.category_id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color_code }}></div>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มเพิ่ม - ไม่แก้ */}
        <button
          type="submit"
          className="w-12 h-11 bg-[#2D3142] text-white rounded-lg flex items-center justify-center font-bold hover:bg-black active:scale-95 transition-all shadow-md shrink-0"
        >
          +
        </button>
      </form>
    </section>
  );
};

export default CreateTask;
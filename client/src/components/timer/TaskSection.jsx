import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const TaskSection = ({
  todoList,
  categories,
  fetchTasks,
  onSelectTask,
  selectedTaskId,
}) => {
  const [activeTab, setActiveTab] = useState("new");
  const [task, setTask] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // --- ส่วนที่เพิ่มมาเพื่อจัดการ Dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ตั้งค่า Default Category เมื่อข้อมูลโหลดมาครั้งแรก
  useEffect(() => {
    // ฟังก์ชันปิด Dropdown เมื่อคลิกข้างนอก
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categories, selectedCategoryId]);

  const token = localStorage.getItem("token");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });

  // หาข้อมูล Category ที่เลือกอยู่เพื่อโชว์ชื่อและสีบนปุ่ม
  const selectedCat = categories?.find(
    (c) => String(c.category_id) === String(selectedCategoryId),
  );

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      try {
        await axios.post(
          "http://localhost:5050/api/tasks",
          {
            title: task,
            task_type: "NORMAL",
            date: today,
            focus_time_spent: 25,
            category_id:
              selectedCategoryId ||
              (categories.length > 0 ? categories[0].category_id : null),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setTask("");
        setSelectedCategoryId("");
        if (fetchTasks) fetchTasks();
        setActiveTab("list");
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };

  return (
    <div className="col-span-4 bg-white rounded-[32px] p-9 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 min-h-[460px] flex flex-col relative">
      <h2 className="text-3xl font-black text-slate-800 mb-8 w-full text-center">
        Tasks
      </h2>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full mb-10">
        <button
          onClick={() => setActiveTab("new")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "new" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
        >
          New task
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
        >
          To-do list
        </button>
      </div>

      {activeTab === "new" ? (
        <div className="w-full space-y-7 px-2">
          {/* ส่วน Task Name (คงเดิม) */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">
              Task Name
            </label>
            <input
              type="text"
              placeholder="What are you working on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* ส่วน Custom Dropdown (แก้ไข: เด้งลงล่าง + เลื่อน Scroll ได้) */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">
              Category
            </label>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full rounded-2xl py-4 px-5 flex items-center justify-between font-bold text-sm transition-all shadow-sm
                ${
                  selectedCat
                    ? "bg-white border-2 border-indigo-400 text-indigo-500"
                    : "bg-slate-50 border border-slate-100 text-slate-400"
                }`}
            >
              <span className="flex items-center gap-2">
                {/* เงื่อนไข: โชว์จุดสีเฉพาะเมื่อมีการเลือกหมวดหมู่แล้วเท่านั้น */}
                {selectedCat && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedCat.color_code }}
                  ></div>
                )}
                {selectedCat ? selectedCat.name : "category"}
              </span>
              <span
                className={`text-[10px] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* เมนูที่เด้งลงด้านล่าง + Scroll ได้ */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-[calc(100%+10px)] w-full min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] py-3 z-50 border border-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* ติ่งสามเหลี่ยม (ชี้ขึ้น) */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-50"></div>

                {/* รายการหมวดหมู่ (กลับมาใช้ max-h และ overflow-y-auto เพื่อให้เลื่อนได้) */}
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar flex flex-col">
                  {categories?.map((cat) => (
                    <button
                      key={cat.category_id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(cat.category_id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-6 py-3.5 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color_code }}
                      ></div>
                      <span className="text-[15px] font-bold text-slate-700">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* To-do list view (คงเดิมไว้ทั้งหมด ไม่หายแน่นอน) */
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {todoList && todoList.length > 0 ? (
            todoList
              .filter((item) => item.is_completed === 0)
              .map((item, index) => (
                <div
                  key={item.task_id || `task-${index}`}
                  onClick={() => {
                    console.log("Selected Item:", item); // เพิ่มบรรทัดนี้เพื่อดูว่า item มี title กับ task_id จริงไหม
                    onSelectTask(item);
                  }}
                  className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer group 
                    ${
                      selectedTaskId === item.task_id
                        ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100"
                        : "bg-white border-slate-100 hover:border-indigo-100"
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all
                    ${selectedTaskId === item.task_id ? "border-indigo-500 bg-indigo-500" : "border-slate-200"}`}
                  >
                    {selectedTaskId === item.task_id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${item.is_completed ? "text-slate-400 line-through" : "text-slate-600"}`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">
                      {item.category_name || "General"}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-center text-slate-300 italic text-sm">
                Your list is empty
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSection;

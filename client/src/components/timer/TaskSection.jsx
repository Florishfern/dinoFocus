import React, { useState } from "react";

const TaskSection = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work"); // เก็บหมวดหมู่ที่เลือก
  
  // 1. เพิ่ม State สำหรับเก็บรายการงานทั้งหมด (ใส่ตัวอย่างไว้ 1 อัน)
  const [todoList, setTodoList] = useState([]);

  // 2. ฟังก์ชันสำหรับเพิ่มงานเมื่อกด Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: task,
        cat: category,
        completed: false
      };
      setTodoList([newTask, ...todoList]); // เพิ่มงานใหม่ไว้บนสุด
      setTask(""); // ล้างช่อง input
      setActiveTab("list"); // สลับไปหน้า list อัตโนมัติเพื่อให้เห็นงานที่เพิ่ม
    }
  };

  return (
    <div className="col-span-4 bg-white rounded-[32px] p-9 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 min-h-[460px] flex flex-col">
      <h2 className="text-3xl font-black text-slate-800 mb-8 w-full text-center">Tasks</h2>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full mb-10">
        <button onClick={() => setActiveTab("new")} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "new" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>New task</button>
        <button onClick={() => setActiveTab("list")} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>To-do list</button>
      </div>

      {activeTab === "new" ? (
        <div className="w-full space-y-7 px-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Task Name</label>
            <input
              type="text"
              placeholder="What are you working on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown} // เพิ่มฟังก์ชันกด Enter ตรงนี้
              className="w-full bg-slate-100 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Category</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-400 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="General">General</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. ส่วนแสดงลิสต์งาน (Loop ข้อมูลจาก todoList) */
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {todoList.length > 0 ? (
            todoList.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group">
                <div className="w-5 h-5 rounded-md border-2 border-slate-200 mr-3 flex items-center justify-center group-hover:border-indigo-400 transition-colors cursor-pointer bg-white">
                  {/* ปุ่มติ๊กถูก (Optional) */}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-600">{item.text}</span>
                  <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{item.cat}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-center text-slate-300 italic text-sm">Your list is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
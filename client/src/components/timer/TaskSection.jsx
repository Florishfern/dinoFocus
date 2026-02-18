import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskSection = ({ todoList, fetchTasks, onSelectTask, selectedTaskId }) => {
  const [activeTab, setActiveTab] = useState("new");
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work"); // เก็บหมวดหมู่ที่เลือก

  const token = localStorage.getItem('token');

  const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Bangkok'});

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      try {
        await axios.post('http://localhost:3000/api/tasks', {
          title: task,
          task_type: "NORMAL", // หรือตามที่คุณกำหนด
          date: today,
          focus_time_spent: 25, // ค่าเริ่มต้น (เช่น 25 นาที)
          category_id: null // หรือหา ID จากหมวดหมู่ที่เลือก
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTask("");
        if (fetchTasks) fetchTasks(); // โหลด List ใหม่หลังจากเพิ่มสำเร็จ
        setActiveTab("list");
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };

  // ฟังก์ชันสลับสถานะ 완료 (Complete)
  const toggleComplete = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/tasks/${id}/status`, {
        is_completed: currentStatus === 1 ? 0 : 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
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
          {todoList && todoList.length > 0 ? (
            todoList
            .filter((item) => item.is_completed === 0)
            .map((item, index) => (
              <div 
                  key={item.task_id || `task-${index}`} 
                  onClick={() => onSelectTask(item)} // คลิกทั้งแถบเพื่อเลือกงาน
                  className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer group 
                    ${selectedTaskId === item.task_id 
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' // สไตล์เมื่อถูกเลือก
                      : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all
                    ${selectedTaskId === item.task_id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-200'}`}>
                    {selectedTaskId === item.task_id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${item.is_completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
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
              <p className="text-center text-slate-300 italic text-sm">Your list is empty</p>
            </div>
          )}
          {todoList && todoList.length > 0 && todoList.filter(i => !i.is_completed).length === 0 && (
             <div className="h-full flex items-center justify-center">
               <p className="text-center text-slate-300 italic text-sm">All tasks completed!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
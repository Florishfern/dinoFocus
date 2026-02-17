import React from 'react';

const TaskItem = ({ task, onToggle, isCompletedView = false, highlight = false }) => {
  // ดึงค่าสีจาก Database (category_color) ถ้าไม่มีให้ใช้สีเทาจางๆ เป็นค่า Default
  const categoryColor = task.category_color || '#94a3b8';

  return (
    <div 
      className={`bg-white p-4 rounded-xl flex items-center justify-between border-l-4 transition-all duration-300 shadow-sm ${highlight ? 'border-indigo-500' : ''}`}
      style={{ 
        // ถ้าไม่ได้เป็น highlight ของ 3-3-3 ให้ใช้สีตามหมวดหมู่
        borderLeftColor: highlight ? '' : categoryColor 
      }}
    >
      <div className="flex items-center gap-4">
        {!isCompletedView && (
          <div className="grid grid-cols-2 gap-0.5 opacity-20">
            {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-800 rounded-full"></div>)}
          </div>
        )}
        <input 
          type="checkbox" 
          // ปรับเป็น task.is_completed === 1 ตามชื่อคอลัมน์ในฐานข้อมูล
          checked={task.is_completed === 1} 
          onChange={onToggle}
          className="w-4 h-4 rounded border-slate-300 accent-indigo-600 cursor-pointer" 
        />
        <div className="flex flex-col">
          <span className={`text-sm font-bold text-slate-700 ${task.is_completed === 1 ? 'line-through opacity-50' : ''}`}>
            {task.title}
          </span>
          {/* เพิ่มจุดสีเล็กๆ หน้าชื่อหมวดหมู่เพื่อความชัดเจน */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }}></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              {task.category_name || 'No Category'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
        {/* ปรับให้รองรับทั้งชื่อ focus_time_spent หรือ time */}
        <span>🕒 {task.focus_time_spent || task.time || 0} MINS</span>
      </div>
    </div>
  );
};

export default TaskItem;
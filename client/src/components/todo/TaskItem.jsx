import React from "react";

const TaskItem = ({
  task,
  onToggle,
  isCompletedView = false,
  highlight = false,
}) => {
  const categoryColor = task.category_color || "#94a3b8";

  return (
    <div
      className={`bg-white p-4 rounded-xl flex items-center justify-between border-l-4 transition-all duration-300 shadow-sm ${highlight ? "border-indigo-500" : ""}`}
      style={{
        borderLeftColor: highlight ? "" : categoryColor,
      }}
    >
      <div className="flex items-center gap-4">
        {!isCompletedView && (
          <div className="grid grid-cols-2 gap-0.5 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-slate-800 rounded-full"></div>
            ))}
          </div>
        )}
        <input
          type="checkbox"
          checked={task.is_completed === 1}
          onChange={onToggle}
          className="w-4 h-4 rounded border-slate-300 accent-indigo-600 cursor-pointer"
        />
        <div className="flex flex-col">
          <span
            className={`text-sm font-bold ${
              task.is_completed === 1
                ? "line-through text-slate-400"
                : task.is_completed === 2
                  ? "line-through text-red-400 opacity-70" 
                  : "text-slate-700"
            }`}
          >
            {task.title} {task.is_completed === 2 && "⚠️"}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: categoryColor }}
            ></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              {task.category_name || "No Category"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
        <span>🕒 {task.focus_time_spent || task.time || 0} MINS</span>
      </div>
    </div>
  );
};

export default TaskItem;

import React, { useState } from "react";

// เพิ่มการรับ props { categories } เข้ามา
const CreateTask = ({ onAddTask, categories = [] }) => {
  const [title, setTitle] = useState("");
  const [mins, setMins] = useState("");
  const [cat, setCat] = useState("");

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title,
      time: mins || "15",
      categoryName: cat || "Work",
    });

    setTitle("");
    setMins("");
    setCat("");
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-black text-slate-800 mb-4">Create Tasks</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* ช่อง Task Name */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 bg-gray-200 border-none rounded-lg px-4 py-2 text-sm font-bold outline-none text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        {/* ช่อง Mins - แก้ไขชื่อตัวแปรให้ตรงกับ State mins */}
        <input
          type="number"
          min="1" 
          value={mins} // เปลี่ยนจาก taskTime เป็น mins
          onChange={(e) => {
            const val = e.target.value;
            // ป้องกันการพิมพ์เลขติดลบลงไปตรงๆ
            if (val !== "" && parseInt(val) < 0) {
              setMins("0"); // เปลี่ยนจาก setTaskTime เป็น setMins
            } else {
              setMins(val); // เปลี่ยนจาก setTaskTime เป็น setMins
            }
          }}
          onPaste={(e) => {
            const pasteData = e.clipboardData.getData("text");
            if (pasteData.includes("-")) {
              e.preventDefault();
            }
          }}
          placeholder="mins"
          className="w-20 bg-gray-200 border-none rounded-lg px-2 text-center text-xs font-bold outline-none text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        {/* ช่อง Category */}
        <div className="relative">
          <input
            list="category-options"
            type="text"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            placeholder="category"
            className="w-32 bg-gray-200 border-none rounded-lg px-2 py-3.5 text-center text-xs font-bold outline-none text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <datalist id="category-options">
            {categories.map((item) => (
              <option key={item.category_id} value={item.name} />
            ))}
          </datalist>
        </div>

        {/* ปุ่มเพิ่ม */}
        <button
          type="submit"
          className="w-10 h-10 bg-[#2D3142] text-white rounded-lg flex items-center justify-center font-bold hover:bg-black active:scale-95 transition-all shadow-md"
        >
          +
        </button>
      </form>
    </section>
  );
};

export default CreateTask;
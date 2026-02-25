import React from "react";

const Calendar = ({ selectedDate, onDateSelect }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const changeDate = (offsetMonth, offsetYear = 0) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offsetMonth);
    newDate.setFullYear(newDate.getFullYear() + offsetYear);
    onDateSelect(newDate);
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    onDateSelect(newDate);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      {/* ส่วนเลือก ปี */}
      <div className="flex justify-between items-center mb-2 text-[10px] font-black uppercase text-slate-400">
        <button onClick={() => changeDate(0, -1)} className="hover:text-indigo-600">◀</button>
        <span className="text-slate-800">{year}</span>
        <button onClick={() => changeDate(0, 1)} className="hover:text-indigo-600">▶</button>
      </div>

      {/* ส่วนเลือก เดือน */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeDate(-1)} className="text-[10px] hover:text-indigo-600">◀</button>
        <p className="text-center text-[10px] font-bold text-slate-800 uppercase">{months[month]}</p>
        <button onClick={() => changeDate(1)} className="text-[10px] hover:text-indigo-600">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
          <div key={`header-${index}`} className="text-slate-300 py-1">{d}</div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="py-2"></div>
        ))}

        {days.map((day) => {
          const isSelected =
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`py-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
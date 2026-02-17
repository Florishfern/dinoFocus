import React from 'react';

const Coin = ({ amount = 600 }) => {
  return (
    <div className="bg-white rounded-2xl py-2 px-5 shadow-sm border border-slate-100 flex items-center gap-2 min-w-[100px] justify-center hover:shadow-md transition-shadow">
      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-yellow-200 animate-pulse-slow">
        ฿
      </div>
      <span className="text-base font-black text-yellow-500 tracking-tight">
        {amount.toLocaleString()}
      </span>
    </div>
  );
};

export default Coin;
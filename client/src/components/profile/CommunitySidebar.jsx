import React from 'react';

// 1. เพิ่ม prop 'type' เข้าไปเพื่อแยกประเภท Card
const CommunityCard = ({ name, role, streak, type }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 group hover:shadow-md transition-shadow">
    {/* Avatar */}
    <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="text-[11px] font-black text-slate-700 truncate">{name}</h4>
        <span className="text-[9px] text-orange-500 font-bold flex items-center gap-0.5">
          🔥 {streak}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-[9px] text-slate-400 font-bold uppercase">{role}</span>
        </div>

        {/* 2. เช็คเงื่อนไขการแสดงปุ่มตาม type */}
        {type === 'community' && (
          <button className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase">
            + Add
          </button>
        )}

        {type === 'request' && (
            <div className="flex gap-1"> {/* ใช้ flex เพื่อวาง 2 ปุ่มคู่กัน */}
                {/* ปุ่ม Accept (สีเขียว) */}
                <button className="bg-[#DCFCE7] text-[8px] font-black px-2 py-1 rounded text-[#166534] hover:bg-[#22C55E] hover:text-white transition-colors uppercase">
                Accept
                </button>
                
                {/* ปุ่ม Decline / ไม่ Accept (สีเทาอ่อน) */}
                <button className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors uppercase">
                ✕
                </button>
            </div>
        )}

        {/* ถ้า type === 'friend' จะไม่แสดงปุ่มใดๆ */}
      </div>
    </div>
  </div>
);

const CommunitySidebar = () => {
  return (
    <div className="col-span-3 border-l border-slate-200 pl-8 space-y-8">
      {/* 1. Community Section - ใส่ type="community" */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">DinoFocus Community</h3>
        
        {/* Search Bar คงเดิม */}
        <div className="flex gap-2 mb-6"> 
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#E2E8F0] border-none rounded-lg py-2 px-4 text-xs focus:outline-none placeholder:text-slate-400" 
            />
          </div>
          <button className="bg-[#A1A1AA] hover:bg-slate-500 text-white w-9 h-8 rounded-lg flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <CommunityCard name="Tommy Holland" role="UK/UI" streak="7d" type="community" />
          <CommunityCard name="Sarah Connor" role="Dev" streak="12d" type="community" />
          <CommunityCard name="Alex Rivers" role="Artist" streak="3d" type="community" />
        </div>
      </div>

      {/* 2. Friends Section - ใส่ type="friend" (ไม่มีปุ่ม) */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Friends</h3>
        <CommunityCard name="John Wick" role="Security" streak="99d" type="friend" />
      </div>

      {/* 3. Request Section - ใส่ type="request" (ปุ่ม Accept) */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Request</h3>
        <div className="space-y-3">
           <CommunityCard name="Peter Parker" role="Intern" streak="2d" type="request" />
           <CommunityCard name="Bruce Wayne" role="CEO" streak="5d" type="request" />
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
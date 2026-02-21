import React, { useRef } from 'react';
const ProfileMain = ({
  isEditing,
  setIsEditing,
  profile,
  setProfile,
  stats,
  collection,
  onSave,
  onRandomAvatar,
}) => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      // เลื่อนไปทางขวา 200px (ปรับตัวเลขได้ตามต้องการ)
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  return (
    <div className="col-span-6 space-y-12">
      <section className="relative">
        <div className="flex items-center gap-3 mb-4">
          {isEditing ? (
            <input
              className="text-2xl font-black text-slate-800 border-b-2 border-indigo-500 bg-transparent flex-1 focus:outline-none"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          ) : (
            <h1 className="text-2xl font-black text-slate-800">
              Hi, My name is {profile.name}
            </h1>
          )}
          <span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-lg text-[12px]">
            🔥 {profile.streak}d
          </span>

          <button
            onClick={isEditing ? onSave : () => setIsEditing(true)}
            className={`ml-auto px-4 py-1.5 rounded-xl text-[11px] font-black transition-all ${
              isEditing
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-200 text-slate-500 hover:bg-slate-300"
            }`}
          >
            {isEditing ? "SAVE" : "EDIT"}
          </button>
        </div>

        
        {/* ... ส่วน Bio คงเดิม ... */}
        {isEditing ? (
          <textarea
            className="w-full text-slate-500 text-sm border p-3 rounded-xl bg-white/50 focus:outline-indigo-500"
            rows="3"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        ) : (
          <p className="text-slate-500 text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}
      </section>

      {/* Dino Collection - เชื่อมข้อมูลจริง */}
      <section>
        <h2 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">
          Dino Collection
        </h2>
        <div className="bg-white rounded-[32px] p-6 shadow-sm flex items-center justify-between border border-slate-100">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }} // ซ่อน scrollbar
          >
            {collection.length > 0 ? (
              collection.map((dino, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center flex-shrink-0 group relative"
                >
                  <img
                    src={dino.image_url}
                    alt={dino.dino_name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="text-slate-300 text-[10px] font-bold uppercase">
                No Dino yet
              </p>
            )}
          </div>
          <button 
            onClick={scrollRight}
            className="text-slate-300 text-2xl px-2 hover:text-slate-500 transition-colors active:scale-90"
          >
            ❯
          </button>
        </div>
      </section>

      {/* Monthly Summary - เชื่อมข้อมูลจริง */}
      <section>
        <h2 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">
          Monthly Summary
        </h2>
        <div className="grid grid-cols-3 gap-0 divide-x divide-slate-200">
          <div className="text-center px-4">
            <div className="text-[35px] font-black text-slate-500 leading-none mb-2">
              {stats.monthly_focus}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Monthly Focus hour
            </p>
          </div>
          <div className="text-center px-4">
            <div className="text-[40px] font-black text-slate-500 leading-none mb-2">
              {stats.Task_success}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Task Success
            </p>
          </div>
          <div className="text-center px-4">
            <div className="text-[40px] font-black text-slate-500 leading-none mb-2">
              {stats.task_fail}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Task Fail
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileMain;

import React from 'react';

const ProfileSidebar = ({ isEditing, profile, setProfile, onRandomAvatar }) => {
  return (
    <div className="col-span-3 flex flex-col items-center">
      <div 
        className={`w-48 h-48 bg-slate-300 rounded-full mb-6 border-4 border-white shadow-sm overflow-hidden relative group 
          ${isEditing ? 'cursor-pointer hover:ring-4 ring-indigo-200' : ''}`}
        onClick={onRandomAvatar} // ผูกฟังก์ชันสุ่มรูป
      >
        <img 
          src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
          alt="Profile" 
          className="w-full h-full object-cover" 
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[24px]">🎲</span>
            <span className="text-white text-[10px] font-bold uppercase">Click to Random</span>
          </div>
        )}
      </div>

      <div className="space-y-4 w-full px-4">
        {/* Role Status */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          {isEditing ? (
            <select 
              className="text-sm font-bold text-slate-600 bg-white border rounded px-2 py-1 w-full focus:outline-indigo-500"
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
            >
              <option>Student</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Intern</option>
              <option>Architecture</option>
              <option>Business Administration</option>
              <option>Computer Science</option>
              <option>Digital Marketing</option>
              <option>Economics</option>
              <option>Software engineer</option>
              <option>UX/UI Designer</option>
              <option>Fullstack Developer</option>
              <option>Freelance</option>
              <option>Fine Arts</option>
              <option>Graphic Design</option>
              <option>Law</option>
            </select>
          ) : (
            <span className="text-sm font-bold text-slate-600">{profile.role}</span>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileSidebar;
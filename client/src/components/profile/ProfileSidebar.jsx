import React from 'react';

const ProfileSidebar = ({ isEditing, profile, setProfile }) => {
  return (
    <div className="col-span-3 flex flex-col items-center">
      <div className="w-48 h-48 bg-slate-300 rounded-full mb-6 border-4 border-white shadow-sm overflow-hidden relative">
        <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
            <span className="text-white text-[10px] font-bold uppercase">Change Photo</span>
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
              <option>Software engineer</option>
              <option>UX/UI Designer</option>
              <option>Fullstack Developer</option>
            </select>
          ) : (
            <span className="text-sm font-bold text-slate-600">{profile.role}</span>
          )}
        </div>

        {/* Location Status */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          {isEditing ? (
            <select 
              className="text-sm font-bold text-slate-600 bg-white border rounded px-2 py-1 w-full focus:outline-indigo-500"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
            >
              <option>Thailand</option>
              <option>USA</option>
              <option>Japan</option>
            </select>
          ) : (
            <span className="text-sm font-bold text-slate-600">{profile.location}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
// src/pages/DinoPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DinoSidebar from '../components/dino-collection/DinoSidebar';
import DinoCard from '../components/dino-collection/DinoCard';

const DinoPage = () => {
  const [selectedRarity, setSelectedRarity] = useState('Common');
  const [myDinos, setMyDinos] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const rarities = [
    { label: 'Common', activeColor: 'bg-[#94A3B8]' },
    { label: 'Rare', activeColor: 'bg-[#94A3B8]' },
    { label: 'Epic', activeColor: 'bg-[#94A3B8]' },
    { label: 'Legendary', activeColor: 'bg-[#94A3B8]' },
  ];

  const fetchMyDinos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5050/api/pets/my-dinos?rarity=${selectedRarity}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyDinos(response.data.data);
    } catch (error) {
      console.error("Error fetching my dinos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDinos();
  }, [selectedRarity]);

  const handleSelectDino = async (petsId) => {
    try {
      await axios.post(
        "http://localhost:5050/api/pets/select",
        { pets_id: petsId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("เปลี่ยนตัวละครสำเร็จ!");
      fetchMyDinos(); // refresh สถานะ
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเปลี่ยนตัวละคร");
    }
  };
  
  const handleGacha = async () => {
    if (!window.confirm("ใช้ 1000 Coins เพื่อสุ่ม?")) return;
    try {
      const response = await axios.post(
        "http://localhost:5050/api/pets/gacha",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`ยินดีด้วย! คุณได้รับ ${response.data.data.name} (${response.data.data.rarity})`);
      fetchMyDinos(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Coins ไม่พอ หรือเกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 font-sans">
      <Navbar />
      <main className="max-w-[1000px] mx-auto mt-8 px-12 grid grid-cols-12 gap-10">
        
        <DinoSidebar 
          rarities={rarities} 
          selectedRarity={selectedRarity} 
          onSelectRarity={setSelectedRarity}
          onGacha={handleGacha}
        />

        <div className="col-span-9">
          <div className="relative px-4">
            {loading ? (
              <p className="text-center text-slate-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-3 gap-y-12 gap-x-8">
                {myDinos.length > 0 ? (
                  myDinos.map((dino) => (
                    <DinoCard 
                      key={dino.pets_id} 
                      name={dino.dino_name} 
                      img={dino.image_url}
                      isActive={dino.is_active}
                      level={dino.level}
                      onSelect={() => handleSelectDino(dino.pets_id)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">คุณยังไม่มี Dino ระดับนี้</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DinoPage;
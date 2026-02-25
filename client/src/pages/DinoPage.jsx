import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DinoSidebar from '../components/dino-collection/DinoSidebar';
import DinoCard from '../components/dino-collection/DinoCard';

const DinoPage = () => {
  const [selectedRarity, setSelectedRarity] = useState('Common');
  const [myDinos, setMyDinos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [gachaResult, setGachaResult] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  const rarities = [
    { label: 'Common', activeColor: 'bg-[#94A3B8]' },
    { label: 'Rare', activeColor: 'bg-[#94A3B8]' },
    { label: 'Epic', activeColor: 'bg-[#94A3B8]' },
    { label: 'Legendary', activeColor: 'bg-[#94A3B8]' },
  ];

  const fetchUserCoins = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCoins(res.data.data.profile.total_coins || 0);
    } catch (err) { console.error(err); }
  };

  const fetchMyDinos = async () => {
    if (!token) return;
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
    fetchUserCoins();
  }, [selectedRarity]);

  const handleSelectDino = async (petsId) => {
    try {
      await axios.post(
        "http://localhost:5050/api/pets/select",
        { pets_id: petsId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyDinos(); 
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเปลี่ยนตัวละคร");
    }
  };
  
  const handleGacha = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.post(
        "http://localhost:5050/api/pets/gacha",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGachaResult(response.data.data);
      setShowResult(true);
      setUserCoins(response.data.new_balance); 

      window.dispatchEvent(new Event("balanceUpdated"));
      
      if (response.data.data.rarity === selectedRarity) {
        fetchMyDinos();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Coins ไม่พอ หรือเกิดข้อผิดพลาด");
    }
  };

  

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 font-sans">
      <Navbar />
      {showConfirm && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[32px] p-8 max-w-[340px] w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Ready to Roll?</h3>
          <p className="text-slate-500 font-bold text-sm mb-8">
            สุ่มตัวละครใหม่โดยใช้ <span className="text-amber-500 font-black">1,000 Coins</span> ใช่หรือไม่?
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
            >
              CANCEL
            </button>
            <button 
              onClick={handleGacha}
              className="flex-1 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all"
            >
              LET'S GO!
            </button>
          </div>
        </div>
      </div>
    )}

      {showResult && gachaResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">
              {gachaResult.status === "Level Up!" ? "Level Up!" : "New Friend!"}
            </h2>
            <div className="relative py-6">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-3xl opacity-50 scale-75"></div>
              <img 
                src={gachaResult.image} 
                alt="result" 
                className="w-48 h-48 mx-auto object-contain relative z-10 drop-shadow-xl" 
              />
            </div>
            <h3 className="text-xl font-black text-indigo-600 mt-2">{gachaResult.name}</h3>
            <p className="text-slate-400 font-bold uppercase text-sm mb-6 tracking-widest">
                {gachaResult.rarity} | LV.{gachaResult.level}
            </p>
            <button 
              onClick={() => setShowResult(false)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}

      <main className="max-w-[1000px] mx-auto mt-8 px-12 grid grid-cols-12 gap-10">
        
        <DinoSidebar 
          onGacha={() => setShowConfirm(true)}
          rarities={rarities} 
          selectedRarity={selectedRarity} 
          onSelectRarity={setSelectedRarity}
          userCoins={userCoins}
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
const DinoSidebar = ({ rarities, selectedRarity, onSelectRarity, onGacha, userCoins }) => {
  return (
    <div className="col-span-3 space-y-16">
      <div className="space-y-3">
        {rarities.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelectRarity(item.label)}
            className={`w-full py-2.5 rounded-2xl text-[11px] font-black transition-all duration-300
              ${selectedRarity === item.label
                  ? `${item.activeColor} text-white scale-105 shadow-md translate-x-1`
                  : "bg-white text-slate-300 hover:bg-slate-50"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col items-center border border-slate-100 max-w-[180px] mx-auto">
        <div className="flex items-center gap-1 bg-[#FFF9E5] px-3 py-0.5 rounded-full mb-1">
          <span className="text-[12px]">💰</span>
          <span className="font-black text-[#FBBF24] text-[11px]">1000</span>
        </div>
        <img src="assets/mystery_box.png" alt="box" className="w-32 h-32 object-contain mb-1" />
        <button 
          onClick={onGacha}
          className="px-6 py-1.5 bg-[#FBBF24] text-white rounded-xl text-[10px] font-extrabold hover:brightness-105 transition-all uppercase shadow-sm"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default DinoSidebar;
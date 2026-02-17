const Topbar = ({ coins = 0 }) => (
  <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center z-50">
    <div className="font-black text-xl tracking-tighter text-indigo-600">DINOFOCUS</div>
    <div className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-2">
      <span className="text-amber-500 font-bold">🪙</span>
      <span className="font-mono font-bold text-amber-700">{coins}</span>
    </div>
  </div>
);
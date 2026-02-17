// src/pages/DinoPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DinoSidebar from '../components/dino-collection/DinoSidebar';
import DinoCard from '../components/dino-collection/DinoCard';

const DinoPage = () => {
  const [selectedRarity, setSelectedRarity] = useState('Common');

  const rarities = [
    { label: 'Common', activeColor: 'bg-[#94A3B8]' },
    { label: 'Rare', activeColor: 'bg-[#94A3B8]' },
    { label: 'Epic', activeColor: 'bg-[#94A3B8]' },
    { label: 'Legendary', activeColor: 'bg-[#94A3B8]' },
  ];

  const allDinos = [
    { name: 'Aether Rainbow', img: '/characters/common/Aether_Rainbow.png', rarity: 'Common' },
    { name: 'Berry Dot', img: '/characters/common/Berry_Dot.png', rarity: 'Common' },
    { name: 'Avion', img: '/characters/common/Avion.png', rarity: 'Common' },
    { name: 'Brezzy', img: '/characters/common/Brezzy.png', rarity: 'Common' },
    { name: 'Coral Nimo', img: '/characters/common/Coral_Nimo.png', rarity: 'Common' },
    { name: 'Stratos', img: '/characters/common/Stratos.png', rarity: 'Common' },
    { name: 'Sonnet', img: '/characters/rare/Aqua_Shell.png', rarity: 'Rare' },
    { name: 'Blue Marble', img: '/characters/rare/Blue_Marble.png', rarity: 'Rare' },
    { name: 'Cyno Blaze', img: '/characters/rare/Cyno_Blaze.png', rarity: 'Rare' },
    { name: 'Fluffy Leaf', img: '/characters/rare/Fluffy_Leaf.png', rarity: 'Rare' },
    { name: 'Jade Rider', img: '/characters/rare/Jade_Rider.png', rarity: 'Rare' },
    { name: 'Jet Stream', img: '/characters/rare/Jet_Stream.png', rarity: 'Rare' },
    { name: 'Amber Glow', img: '/characters/epic/Amber_Glow.png', rarity: 'Epic' },
    { name: 'Blazey', img: '/characters/epic/Blazey.png', rarity: 'Epic' },
    { name: 'Glitter Cloud', img: '/characters/epic/Glitter_Cloud.png', rarity: 'Epic' },
    { name: 'Grape Greet', img: '/characters/epic/Grape_Greet.png', rarity: 'Epic' },
    { name: 'Azure Sky', img: '/characters/legendary/Azure_Sky.png', rarity: 'Legendary' },
    { name: 'Honey Hug', img: '/characters/legendary/Honey_Hug.png', rarity: 'Legendary' },
    { name: 'Buddy Bib', img: '/characters/legendary/Buddy_Bib.png', rarity: 'Legendary' },

  ];

  const filteredDinos = allDinos.filter(dino => dino.rarity === selectedRarity);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 font-sans">
      <Navbar />
      <main className="max-w-[1000px] mx-auto mt-8 px-12 grid grid-cols-12 gap-10">
        
        <DinoSidebar 
          rarities={rarities} 
          selectedRarity={selectedRarity} 
          onSelectRarity={setSelectedRarity} 
        />

        <div className="col-span-9">
          <div className="relative px-4">
            <div className="grid grid-cols-3 gap-y-12 gap-x-8">
              {filteredDinos.map((dino, index) => (
                <DinoCard key={index} name={dino.name} img={dino.img} />
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DinoPage;
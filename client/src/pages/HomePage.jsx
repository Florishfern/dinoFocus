import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEEFF1] font-sans text-slate-800">
      <Navbar showCoins={false} showSignIn={true} />

      <section className="max-w-7xl mx-auto px-12 py-5 grid md:grid-cols-2 items-center gap-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-black whitespace-nowrap text-slate-900 leading-tight">
            Welcome to <span className="text-indigo-600">DinoFocus !</span>
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed max-w-md font-medium">
            The gamified focus timer that turns your daily tasks into legendary
            rewards. Grow your goals, grow your pets.
          </p>

          <button 
            onClick={() => navigate("/login")}
            className="bg-[#2D3142] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Get started for free
          </button>
        </div>

        <div className="relative flex justify-center">

          <div className="absolute bottom-[-20px] w-48 h-8 bg-slate-200 rounded-[100%] blur-xl opacity-60"></div>

          <img
            src="/characters/rare/Cyno_Blaze.png"
            alt="Main Dino"
            className="w-[500px] h-auto relative z-10 animate-bounce-slow"
          />
        </div>
      </section>

      <div className="max-w-4xl mx-auto mb-10 mt-0">
        <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-2xl py-6 px-10 flex justify-between border border-slate-50">
          <div className="flex items-center gap-3 font-bold text-slate-600">
            <span className="text-indigo-500">💡</span> High motivation
          </div>

          <div className="w-[1px] h-6 bg-slate-200"></div>

          <div className="flex items-center gap-3 font-bold text-slate-600">
            <span className="text-indigo-500">🚀</span> Deep focus
          </div>

          <div className="w-[1px] h-6 bg-slate-200"></div>

          <div className="flex items-center gap-3 font-bold text-slate-600">
            <span className="text-indigo-500">🎮</span> Turn hard work into play
          </div>
        </div>
      </div>

      {/* 4. Secondary Section */}

      <section className="max-w-7xl mx-auto px-12 py-0 grid md:grid-cols-2 items-center gap-20 bg-slate-50/50 rounded-[60px]">
        <div className="flex justify-center">
          <img
            src="/characters/common/Spiny_Baby.png"
            alt="What is DinoFocus"
            className="w-[600px] h-auto drop-shadow-2xl"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-black text-slate-900">
            What is DinoFocus ?
          </h2>

          <p className="text-slate-500 leading-7 font-medium">
            DinoFocus transforms boring tasks into an exciting adventure with a
            gamified focus timer. Every minute you stay focused becomes energy
            to nurture and evolve your pets. Beyond the fun, our professional
            task management tools including specialized focus methods help you
            organize your life with ease. Stay motivated, build your streaks,
            and collect them all with a community of achievers.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-12 pt-12 pb-24 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-16">
          Productivity Methods
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

          <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold text-slate-800">Pomodoro</h3>

            <div className="text-6xl">🍅</div>

            <p className="text-slate-400 text-sm leading-6">
              Master your focus with the Pomodoro technique, balancing deep work
              sessions and refreshing breaks.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold text-slate-800">3-3-3 Method</h3>

            <div className="text-6xl">📝</div>

            <p className="text-slate-400 text-sm leading-6">
              Instead of an overwhelming to-do list, structure your day with the
              3-3-3 method to stay focused and productive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

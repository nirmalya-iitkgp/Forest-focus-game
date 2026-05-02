import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudRain, CloudLightning, Sun, Snowflake, Sparkles } from 'lucide-react';
import { SessionState } from '../types';

interface ForestSceneProps {
  growth: number;
  state: SessionState;
  scars: number;
  isWinter: boolean;
}

export const ForestScene: React.FC<ForestSceneProps> = ({ growth, state, scars, isWinter }) => {
  const isStorm = state === SessionState.STORM;
  const isFocusing = state === SessionState.FOCUSING;
  const isBreak = state === SessionState.BREAK;
  const isIdle = state === SessionState.IDLE;

  // Determine bunny count based on growth
  const bunnyCount = useMemo(() => {
    if (growth >= 70) return 3;
    if (growth >= 40) return 2;
    if (growth >= 10) return 1;
    return 0;
  }, [growth]);

  // Generate deterministic tree positions
  const treeConfig = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      x: 5 + (i * 6.5) + (Math.sin(i * 1.5) * 3), // varied spacing
      type: i % 3,
      delay: i * 0.05,
      scale: 0.8 + Math.random() * 0.4,
      id: i,
      threshold: i === 0 ? 1 : i * 6 // first tree at 1%, others every 6%
    }));
  }, []);

  return (
    <div 
      className={`relative w-full h-[400px] rounded-[3.5rem] overflow-hidden transition-all duration-1000 border-8 ${
        isStorm ? 'bg-slate-900 border-slate-800 shadow-inner' : 
        isWinter ? 'bg-sky-100 border-sky-200 shadow-inner' :
        isBreak ? 'bg-indigo-50 border-indigo-100' :
        'bg-emerald-50 border-emerald-100'
      }`}
      id="forest-ecosystem-svg"
    >
      {/* Background Atmosphere Fade */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isStorm ? 'opacity-60' : 'opacity-20'} bg-gradient-to-b from-black/20 to-transparent pointer-events-none`} />

      {/* Weather Overlays */}
      <AnimatePresence>
        {isStorm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {/* Dark Clouds */}
            <div className="absolute top-8 left-1/4 filter blur-sm"><CloudLightning className="text-slate-600 w-20 h-20" /></div>
            <div className="absolute top-12 right-1/4 filter blur-sm"><CloudRain className="text-slate-500 w-24 h-24" /></div>
            
            {/* Lightning Flash */}
            <motion.div 
              animate={{ opacity: [0, 0.3, 0, 0.1, 0] }}
              transition={{ repeat: Infinity, duration: 6, times: [0, 0.02, 0.04, 0.06, 1] }}
              className="absolute inset-0 bg-white"
            />

            {/* Rain Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <pattern id="rain" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="5" y2="15" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#rain)" className="animate-rain" />
            </svg>
          </motion.div>
        )}

        {isWinter && !isStorm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: (i * 5) + '%' }}
                animate={{ y: 400 }}
                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
                className="absolute"
              >
                <Snowflake className="text-white w-3 h-3 opacity-40" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {(isFocusing || isBreak) && !isStorm && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-10 right-12 z-0"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="absolute inset-0 bg-orange-300 blur-3xl rounded-full" 
              />
              <Sun className="text-orange-400 w-16 h-16 animate-spin-slow relative z-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenery Container */}
      <div className="absolute inset-0 flex items-end justify-center pb-8 px-12">
        {/* Ground Circle */}
        <div className={`absolute bottom-[-100px] w-[140%] h-[280px] rounded-[100%] border-t-8 transition-colors duration-1000 ${
          isWinter ? 'bg-white border-sky-100' : 'bg-emerald-600/30 border-emerald-500/20'
        }`} />

        {/* Growth Visuals */}
        <div className="relative w-full h-full flex items-end justify-center gap-2 z-10 pointer-events-none">
          {treeConfig.map((tree) => {
            const isFullyGrown = growth >= tree.threshold;
            const isSprout = !isFullyGrown && growth >= tree.threshold - 5;
            
            if (!isFullyGrown && !isSprout) return null;

            if (isSprout) {
              return (
                <motion.div
                  key={tree.id}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-3 h-3 bg-emerald-300 rounded-full animate-bounce shadow-sm"
                  style={{ left: `${tree.x}%`, position: 'absolute', bottom: '28px' }}
                />
              );
            }

            // Tree stage
            return (
              <motion.div
                key={tree.id}
                initial={{ scale: 0, y: 40 }}
                animate={{ scale: tree.scale, y: 0 }}
                transition={{ type: 'spring', damping: 12, delay: tree.delay }}
                className="flex flex-col items-center justify-end"
                style={{ 
                  left: `${tree.x}%`,
                  position: 'absolute',
                  bottom: '24px',
                  zIndex: tree.type === 1 ? 12 : 10
                }}
              >
                {/* Foliage */}
                <div 
                  className={`
                    ${tree.type === 0 ? 'w-24 h-40' : tree.type === 1 ? 'w-32 h-56' : 'w-20 h-32'} 
                    rounded-t-full shadow-inner relative transition-colors duration-1000
                    ${isWinter ? 'bg-slate-300' : tree.type === 1 ? 'bg-emerald-700 font-bold' : tree.type === 0 ? 'bg-emerald-500' : 'bg-emerald-400'}
                  `}
                >
                  <div className="absolute top-4 left-4 w-6 h-6 bg-white/20 rounded-full blur-[4px]" />
                  {growth > 70 && tree.id % 3 === 0 && (
                    <div className="absolute top-12 right-8 w-4 h-4 bg-rose-400 rounded-full shadow-sm" />
                  )}
                </div>
                {/* Trunk */}
                <div className={`w-6 h-10 ${isWinter ? 'bg-slate-200' : 'bg-orange-950/20'} rounded-t-lg transition-colors duration-1000`} />
              </motion.div>
            );
          })}
        </div>

        {/* Bunnies */}
        <div className="absolute inset-x-0 bottom-16 flex justify-center items-end gap-16 pointer-events-none z-20">
          {Array.from({ length: bunnyCount }).map((_, i) => (
            <motion.div
              key={`bunny-${i}`}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: isStorm ? [0, -4, 0] : [0, -16, 0, 0],
                rotate: isStorm ? [0, 2, -2, 0] : [0, 5, -5, 0]
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }
              }}
              className="relative"
            >
              <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 ${isStorm ? 'border-slate-800' : 'border-emerald-50'}`}>
                <div className="relative">
                  {/* Left Ear with Twitch */}
                  <motion.div 
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.5 }}
                    className={`w-2.5 h-8 bg-white absolute -top-6 left-1 rounded-full border-x transition-colors ${isStorm ? 'border-slate-800' : 'border-emerald-100'}`} 
                  />
                  {/* Right Ear with Twitch */}
                  <motion.div 
                    animate={{ rotate: [5, -5, 5] }}
                    transition={{ repeat: Infinity, duration: 3.5 + i, delay: i * 0.2 }}
                    className={`w-2.5 h-8 bg-white absolute -top-6 right-1 rounded-full border-x transition-colors ${isStorm ? 'border-slate-800' : 'border-emerald-100'}`} 
                  />
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                  </div>
                  {/* Subtle Nose Twitch */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-1 h-1 bg-rose-200 rounded-full mx-auto mt-1" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scars */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {Array.from({ length: scars }).map((_, i) => (
            <div 
              key={`scar-${i}`}
              className={`w-1 h-5 bg-rose-400/40 rounded-full ${i % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}
            />
          ))}
        </div>
      </div>

      {/* HUD Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 z-40">
        <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black text-emerald-950 shadow-2xl border border-white/50 flex items-center gap-2 uppercase tracking-widest">
          {isStorm ? 'A gentle storm is passing...' : isWinter ? 'A quiet frost has settled' : isBreak ? 'Restful Recess' : isIdle ? 'Ready to begin' : 'Growth is happening'}
          <div className={`w-2 h-2 rounded-full ${isStorm ? 'bg-rose-400 animate-pulse' : isBreak ? 'bg-sky-400' : isIdle ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`} />
        </div>
        
        {isBreak && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-sky-600 pl-1"
          >
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Healing Land</span>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rain {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .animate-rain {
          animation: rain 0.4s linear infinite;
        }
      `}} />
    </div>
  );
};


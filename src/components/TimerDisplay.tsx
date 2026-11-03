import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Settings2, Coffee } from 'lucide-react';
import { SessionState } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  state: SessionState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  state,
  onStart,
  onPause,
  onReset,
  onOpenSettings
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isStorm = state === SessionState.STORM;
  const isFocusing = state === SessionState.FOCUSING;
  const isBreak = state === SessionState.BREAK;

  return (
    <div className="flex flex-col items-center gap-10 mt-12 mb-4">
      {/* Centered Timer Wrapper */}
      <div className="bg-white rounded-full shadow-2xl p-3 flex items-center gap-4 border-[6px] border-emerald-100/50">
        <div className="pl-10 pr-6 py-2 border-r border-slate-100">
           <div className={`text-5xl font-mono font-black tabular-nums transition-colors duration-500 tracking-tighter ${
             isStorm ? 'text-rose-500 animate-pulse' : 
             isBreak ? 'text-sky-500' : 
             'text-emerald-950'
           }`}>
             {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
           </div>
        </div>

        <div className="flex items-center gap-3 pr-4">
          {state === SessionState.IDLE || state === SessionState.RECOVERY ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 h-16 w-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full justify-center transition-all shadow-lg active:scale-95 group"
              id="start-session-btn"
            >
              <Play className="w-8 h-8 fill-current transition-transform group-hover:scale-110" />
            </button>
          ) : (
            <>
              {isFocusing || isBreak ? (
                <button
                  onClick={onPause}
                  className="h-16 w-16 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 group"
                  id="pause-btn"
                  title="Take a Breath"
                >
                  <Pause className="w-8 h-8 fill-current" />
                </button>
              ) : (
                 <button
                  onClick={onStart}
                  className="flex items-center gap-2 px-8 h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black text-lg transition-all animate-pulse shadow-xl"
                  id="return-btn"
                >
                  Return to Shelter
                </button>
              )}
              
              <button
                onClick={onReset}
                className="h-16 w-16 border-2 border-slate-100 hover:bg-slate-50 text-slate-400 rounded-full flex items-center justify-center transition-all group"
                id="reset-btn"
                title="Renew the Soil"
              >
                <RotateCcw className="w-6 h-6 transition-transform group-hover:rotate-[-45deg]" />
              </button>
            </>
          )}
          
          <button
            onClick={onOpenSettings}
            className="h-16 w-16 border-2 border-slate-100 hover:bg-slate-50 text-slate-300 rounded-full flex items-center justify-center transition-all"
            id="open-settings-btn"
            title="Tend to Settings"
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isBreak && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-sky-50 text-sky-700 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest border border-sky-100"
        >
          <Coffee className="w-4 h-4" /> Restful Recess
        </motion.div>
      )}
    </div>
  );
};

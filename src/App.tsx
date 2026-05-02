import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trees as TreeIcon, Trophy, Flame, Wind, AlertTriangle, Sparkles, Settings2, ArrowRight } from 'lucide-react';
import { 
  SessionState, 
  ForestStats, 
  AppSettings, 
  DEFAULT_STATS, 
  DEFAULT_SETTINGS 
} from './types';
import { useTimer, useLocalStorage, useAppVisibility, useInactivity } from './hooks';
import { ForestScene } from './components/ForestScene';
import { TimerDisplay } from './components/TimerDisplay';
import { SettingsModal } from './components/SettingsModal';
import { MOTIVATIONAL_QUOTES, RETURN_MESSAGES, ONBOARDING_STEPS } from './constants';

export default function App() {
  const [stats, setStats] = useLocalStorage<ForestStats>('forest-focus-stats', DEFAULT_STATS);
  const [settings, setSettings] = useLocalStorage<AppSettings>('forest-focus-settings', DEFAULT_SETTINGS);
  const [state, setState] = useState<SessionState>(SessionState.IDLE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('forest-focus-onboarding-v1', false);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      setOnboardingStep(0);
    }
  }, [hasSeenOnboarding]);
  
  // Previous focus progress to resume if needed
  const focusProgressRef = useRef(0);
  const stateBeforeStormRef = useRef<SessionState>(SessionState.IDLE);

  // Audio refs (simulated)
  const thunderSound = useRef<HTMLAudioElement | null>(null);

  const onComplete = useCallback(() => {
    if (state === SessionState.FOCUSING) {
      setStats(prev => {
        const newStreak = prev.streak + 1;
        const newGrowth = Math.min(prev.growth + (prev.isWinterMode ? 10 : 20), 100);
        
        // Milestone check (every 7 sessions or 7 unique days - here we simplified to every 5 sessions for demo feel)
        if (newStreak % 5 === 0) {
          setShowMilestone(newStreak);
          setTimeout(() => setShowMilestone(null), 5000);
        }

        return {
          ...prev,
          growth: newGrowth,
          totalFocusSessions: prev.totalFocusSessions + 1,
          streak: newStreak,
          isWinterMode: false // Reset winter mode on success
        };
      });
      setState(SessionState.BREAK);
      timer.reset(settings.breakDuration);
      timer.start();
    } else if (state === SessionState.BREAK) {
      setState(SessionState.IDLE);
      timer.reset(settings.focusDuration);
    } else if (state === SessionState.STORM) {
        // Grace period expired!
        setStats(prev => ({
            ...prev,
            isWinterMode: true, // Penalty for next time
            growth: Math.max(prev.growth - 10, 0),
            streak: 0
        }));
        setState(SessionState.IDLE);
        timer.reset(settings.focusDuration);
    }
  }, [state, settings, setStats]);

  const timer = useTimer(settings.focusDuration, onComplete);

  // Storm / Distraction Logic
  const triggerStorm = useCallback(() => {
    if (state === SessionState.FOCUSING) {
      stateBeforeStormRef.current = state;
      focusProgressRef.current = timer.timeLeft;
      setState(SessionState.STORM);
      timer.reset(settings.graceDuration);
      timer.start();
      
      // Play storm sound? (Optional)
      console.log("🌩️ Storm starting... Return to shelter!");
    }
  }, [state, timer, settings.graceDuration]);

  const recoverFromStorm = useCallback(() => {
    if (state === SessionState.STORM) {
      setState(SessionState.RECOVERY);
      setStats(prev => ({ ...prev, scars: prev.scars + 1 }));
      timer.pause();
      // Allow user to resume manually
    }
  }, [state, timer, setStats]);

  const resumeFocus = useCallback(() => {
     setState(SessionState.FOCUSING);
     timer.setTimeLeft(focusProgressRef.current);
     timer.start();
  }, [timer]);

  // Hook integrations
  useAppVisibility(triggerStorm, recoverFromStorm);
  // Removed inactivity storm trigger per user request - focus safely while idle!

  const handleStart = () => {
    if (state === SessionState.RECOVERY) {
        resumeFocus();
    } else {
        setState(SessionState.FOCUSING);
        timer.start();
    }
  };

  const handleReset = () => {
    if (window.confirm("Abandon your growing forest? Growth will be lost.")) {
        setState(SessionState.IDLE);
        setStats(prev => ({ ...prev, growth: Math.max(prev.growth - 5, 0), streak: 0 }));
        timer.reset(settings.focusDuration);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    timer.reset(newSettings.focusDuration);
    setState(SessionState.IDLE);
  };

  return (
    <div className="w-full min-h-screen bg-emerald-50 overflow-x-hidden font-sans flex flex-col relative">
      {/* Header Navigation */}
      <nav className="flex justify-between items-center px-10 py-8 z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <TreeIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black text-emerald-900 tracking-tighter italic">Ardelius</span>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-full border-2 border-emerald-100 flex items-center gap-2 shadow-xl">
             <Flame className="w-5 h-5 text-orange-400 fill-current" />
             <span className="font-black text-emerald-900 uppercase tracking-widest text-xs">{stats.streak} Day Streak</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white rounded-full border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 shadow-md transition-all active:scale-95"
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Content: The Forest Ecosystem */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Forest Canvas Area */}
        <div className="relative w-full max-w-5xl z-10">
          <ForestScene 
            growth={stats.growth} 
            state={state} 
            scars={stats.scars} 
            isWinter={stats.isWinterMode} 
          />
        </div>

        {/* Stats Sidebar (Desktop) / Info Bar (Mobile) */}
        <aside className="lg:absolute right-10 top-1/2 lg:-translate-y-1/2 w-full lg:w-72 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border-4 border-white mt-12 lg:mt-0 z-20">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black text-emerald-900 uppercase tracking-widest leading-none">
                <span>Ecosystem Bloom</span>
                <span>{Math.round(stats.growth)}%</span>
              </div>
              <div className="w-full h-4 bg-emerald-100 rounded-full overflow-hidden p-1 border border-white">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.growth}%` }}
                  className="h-full bg-emerald-500 rounded-full" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                <div className="text-[10px] uppercase font-black text-emerald-600 mb-1 tracking-widest">Bunnies</div>
                <div className="text-2xl font-black text-emerald-950 tabular-nums">
                  {String(stats.growth >= 80 ? 3 : stats.growth >= 50 ? 2 : stats.growth >= 20 ? 1 : 0).padStart(2, '0')}
                </div>
              </div>
              <div className="bg-rose-50/50 p-4 rounded-3xl border border-rose-100/50">
                <div className="text-[10px] uppercase font-black text-rose-600 mb-1 tracking-widest">Scars</div>
                <div className="text-2xl font-black text-rose-700 tabular-nums">{String(stats.scars).padStart(2, '0')}</div>
              </div>
            </div>

              <div className="pt-6 border-t border-emerald-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">Achievements</span>
              </div>
              <p className="text-xs text-emerald-600 leading-relaxed italic font-medium">
                "{state === SessionState.FOCUSING ? 
                  MOTIVATIONAL_QUOTES[stats.totalFocusSessions % MOTIVATIONAL_QUOTES.length] : 
                  state === SessionState.BREAK ? 
                  "Rest is the soil from which growth springs." :
                  state === SessionState.STORM ?
                  "The land is waiting for your return." :
                  state === SessionState.RECOVERY ?
                  RETURN_MESSAGES[stats.scars % RETURN_MESSAGES.length] :
                  "Your land is waiting for a new seed."}"
              </p>
            </div>
          </div>
        </aside>

        {/* Storm/Warning Overlay specifically for mobile/center-focus */}
        <AnimatePresence>
          {state === SessionState.STORM && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-40 flex items-center justify-center p-6"
            >
              <div className="bg-white p-10 rounded-[3rem] max-w-sm text-center shadow-[0_0_100px_rgba(244,63,94,0.3)] border-8 border-rose-100">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Wind className="w-10 h-10 text-rose-500 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter italic">A storm is brewing...</h3>
                <p className="text-slate-500 mb-8 font-bold leading-relaxed">
                  You've wandered away from your focus. Come back to shelter before the frost takes hold.
                </p>
                <button 
                  onClick={handleStart}
                  className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Return to Shelter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Control Bar */}
        <footer className="w-full flex justify-center mt-auto pb-12 z-30">
          <TimerDisplay 
            timeLeft={timer.timeLeft}
            state={state}
            onStart={handleStart}
            onPause={timer.pause}
            onReset={handleReset}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </footer>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            settings={settings} 
            onClose={() => setIsSettingsOpen(false)}
            onSave={handleSaveSettings}
          />
        )}
      </AnimatePresence>

      {/* Milestone Modal */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
          >
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.4)] border-8 border-emerald-500 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-4xl font-black text-emerald-950 italic tracking-tighter mb-2">Beautiful Persistence!</h2>
              <p className="text-xl font-bold text-emerald-600 mb-4">You've reached {showMilestone} focus sessions.</p>
              <div className="flex gap-2">
                <Sparkles className="text-emerald-400 w-6 h-6 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest text-emerald-800">Your forest is truly thriving</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {onboardingStep !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-emerald-950/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-md w-full rounded-[3.5rem] p-10 shadow-2xl border-4 border-emerald-100 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-6">
                 <TreeIcon className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h3 className="text-3xl font-black text-emerald-950 mb-4 tracking-tighter italic">
                {ONBOARDING_STEPS[onboardingStep].title}
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-10">
                {ONBOARDING_STEPS[onboardingStep].description}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {ONBOARDING_STEPS.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === onboardingStep ? 'w-8 bg-emerald-500' : 'w-2 bg-emerald-100'}`} />
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                      setOnboardingStep(onboardingStep + 1);
                    } else {
                      setOnboardingStep(null);
                      setHasSeenOnboarding(true);
                    }
                  }}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 flex items-center gap-2 transition-all active:scale-95"
                >
                  {onboardingStep === ONBOARDING_STEPS.length - 1 ? 'Begin' : 'Next'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARIA Announcements */}
      <div aria-live="polite" className="sr-only">
        Current state: {state}. Time remaining: {Math.floor(timer.timeLeft / 60)} minutes.
      </div>
    </div>
  );
}

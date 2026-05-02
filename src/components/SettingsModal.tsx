import React from 'react';
import { X, Clock, ShieldAlert, Timer } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleChange = (key: keyof AppSettings, value: number) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
        id="settings-panel"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <Clock className="w-6 h-6 text-emerald-600" /> Session Setup
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <Timer className="w-4 h-4" /> Focus Length (min)
            </label>
            <input 
              type="range" min="5" max="60" step="5"
              value={localSettings.focusDuration}
              onChange={(e) => handleChange('focusDuration', parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="text-right text-lg font-bold text-slate-700">{localSettings.focusDuration}:00</div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <Coffee className="w-4 h-4" /> Break Length (min)
            </label>
            <input 
              type="range" min="1" max="20" step="1"
              value={localSettings.breakDuration}
              onChange={(e) => handleChange('breakDuration', parseInt(e.target.value))}
              className="w-full accent-sky-600"
            />
            <div className="text-right text-lg font-bold text-slate-700">{localSettings.breakDuration}:00</div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Grace Period (min)
            </label>
            <input 
              type="range" min="1" max="30" step="1"
              value={localSettings.graceDuration}
              onChange={(e) => handleChange('graceDuration', parseInt(e.target.value))}
              className="w-full accent-rose-600"
            />
            <div className="text-right text-lg font-bold text-slate-700">{localSettings.graceDuration}:00</div>
          </div>
        </div>

        <button
          onClick={() => onSave(localSettings)}
          className="w-full mt-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          id="save-settings-btn"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
};

const Coffee = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M17 12h2a2 2 0 0 1 0 4h-2"/><path d="M6 2v2"/></svg>
);

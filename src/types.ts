export enum SessionState {
  IDLE = 'IDLE',
  FOCUSING = 'FOCUSING',
  BREAK = 'BREAK',
  STORM = 'STORM',
  RECOVERY = 'RECOVERY'
}

export interface ForestStats {
  growth: number;
  scars: number;
  unlockedBunnies: number;
  totalFocusSessions: number;
  streak: number;
  isWinterMode: boolean;
}

export interface AppSettings {
  focusDuration: number;
  breakDuration: number;
  graceDuration: number;
}

export const DEFAULT_STATS: ForestStats = {
  growth: 0,
  scars: 0,
  unlockedBunnies: 0,
  totalFocusSessions: 0,
  streak: 0,
  isWinterMode: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  breakDuration: 5,
  graceDuration: 10,
};

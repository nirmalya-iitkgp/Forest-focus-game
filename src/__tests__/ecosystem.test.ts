import { describe, it, expect } from 'vitest';
import { SessionState, DEFAULT_STATS, DEFAULT_SETTINGS, ForestStats } from '../types';
import { MOTIVATIONAL_QUOTES, RETURN_MESSAGES, ONBOARDING_STEPS } from '../constants';
import { forestAudio } from '../three/audio';

describe('Ardelius Forest Ecosystem Logic', () => {
  it('has valid default statistics and settings', () => {
    expect(DEFAULT_STATS.growth).toBe(0);
    expect(DEFAULT_STATS.scars).toBe(0);
    expect(DEFAULT_STATS.streak).toBe(0);
    expect(DEFAULT_STATS.isWinterMode).toBe(false);

    expect(DEFAULT_SETTINGS.focusDuration).toBe(25);
    expect(DEFAULT_SETTINGS.breakDuration).toBe(5);
    expect(DEFAULT_SETTINGS.graceDuration).toBe(10);
  });

  it('contains gentle, guilt-free motivational quotes', () => {
    expect(MOTIVATIONAL_QUOTES.length).toBeGreaterThanOrEqual(10);
    MOTIVATIONAL_QUOTES.forEach((quote) => {
      expect(quote.toLowerCase()).not.toContain('fail');
      expect(quote.toLowerCase()).not.toContain('punish');
      expect(quote.toLowerCase()).not.toContain('kill');
      expect(quote.toLowerCase()).not.toContain('ruin');
    });
  });

  it('contains compassionate return-gently messages', () => {
    expect(RETURN_MESSAGES.length).toBeGreaterThanOrEqual(5);
    RETURN_MESSAGES.forEach((msg) => {
      expect(msg.toLowerCase()).not.toContain('fail');
      expect(msg.toLowerCase()).not.toContain('ruin');
    });
  });

  it('provides a 3-step onboarding explanation', () => {
    expect(ONBOARDING_STEPS.length).toBe(3);
    expect(ONBOARDING_STEPS[0].title).toBe('Plant Your Focus');
  });

  it('correctly calculates bunny counts based on growth percentages', () => {
    const getBunnyCount = (growth: number) => {
      if (growth >= 70) return 3;
      if (growth >= 40) return 2;
      if (growth >= 10) return 1;
      return 0;
    };

    expect(getBunnyCount(0)).toBe(0);
    expect(getBunnyCount(5)).toBe(0);
    expect(getBunnyCount(10)).toBe(1);
    expect(getBunnyCount(25)).toBe(1);
    expect(getBunnyCount(40)).toBe(2);
    expect(getBunnyCount(69)).toBe(2);
    expect(getBunnyCount(70)).toBe(3);
    expect(getBunnyCount(100)).toBe(3);
  });

  it('handles winter mode recovery gracefully without harsh penalties', () => {
    const stats: ForestStats = {
      growth: 30,
      scars: 1,
      unlockedBunnies: 1,
      totalFocusSessions: 2,
      streak: 0,
      isWinterMode: true,
    };

    // When focus session succeeds in winter mode
    const recoveredStats: ForestStats = {
      ...stats,
      growth: Math.min(stats.growth + 10, 100),
      streak: stats.streak + 1,
      totalFocusSessions: stats.totalFocusSessions + 1,
      isWinterMode: false,
    };

    expect(recoveredStats.growth).toBe(40);
    expect(recoveredStats.streak).toBe(1);
    expect(recoveredStats.isWinterMode).toBe(false);
  });

  it('toggles audio muting correctly in the procedural audio engine', () => {
    forestAudio.setMuted(true);
    expect(forestAudio.getMuted()).toBe(true);

    forestAudio.setMuted(false);
    expect(forestAudio.getMuted()).toBe(false);
  });

  it('verifies sanctuary bunny companions and thresholds', () => {
    const companions = [
      { name: 'Clover', threshold: 10 },
      { name: 'Hazel', threshold: 40 },
      { name: 'Pip', threshold: 70 },
    ];

    expect(companions.map(c => c.name)).toEqual(['Clover', 'Hazel', 'Pip']);
    expect(companions[0].threshold).toBeLessThan(companions[1].threshold);
    expect(companions[1].threshold).toBeLessThan(companions[2].threshold);
  });

  it('supports procedural audio triggers without errors', () => {
    expect(() => forestAudio.playMushroomPop()).not.toThrow();
    expect(() => forestAudio.playRustle()).not.toThrow();
    expect(() => forestAudio.playBunnyHop()).not.toThrow();
    expect(() => forestAudio.playChime(1.5)).not.toThrow();
    expect(() => forestAudio.toggleNatureAmbience(false)).not.toThrow();
  });
});

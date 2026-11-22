"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// The demo's instrumental loop, which Pedro liked, rebuilt so that mute is instant,
// the chime respects mute, and music pauses while a video plays (fixes D10–D12).
const MELODY = [392, 494, 587, 659, 587, 494, 440, 523, 659, 784, 659, 523, 392, 494, 587, 494];
const STEP = 0.5;

type Sound = { on: boolean; toggle: () => void; start: () => void; chime: () => void; duck: (d: boolean) => void };
const Ctx = createContext<Sound>({ on: false, toggle() {}, start() {}, chime() {}, duck() {} });
export const useSound = () => useContext(Ctx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const music = useRef<GainNode | null>(null);
  const timer = useRef<number | null>(null);
  const next = useRef(0);
  const idx = useRef(0);
  const ducked = useRef(false);

  const ensure = () => {
    if (!ac.current) {
      const A = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ac.current = new A();
      master.current = ac.current.createGain();
      master.current.connect(ac.current.destination);
    }
    return ac.current;
  };

  const note = (dest: AudioNode, f: number, t: number, d: number, v: number) => {
    const c = ac.current!;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + d + 0.05);
  };

  const stopMusic = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    const c = ac.current;
    const g = music.current;
    if (c && g) {
      g.gain.cancelScheduledValues(c.currentTime);
      g.gain.setTargetAtTime(0, c.currentTime, 0.03);
      window.setTimeout(() => g.disconnect(), 300);
    }
    music.current = null;
  }, []);

  const startMusic = useCallback(() => {
    const c = ensure();
    void c.resume();
    stopMusic();
    const g = c.createGain();
    g.gain.value = ducked.current ? 0 : 1;
    g.connect(master.current!);
    music.current = g;
    next.current = c.currentTime + 0.1;
    // Look-ahead scheduler: only ~1 s of notes is ever queued, so stopping is immediate.
    timer.current = window.setInterval(() => {
      while (next.current < c.currentTime + 1) {
        const i = idx.current++ % MELODY.length;
        note(g, MELODY[i], next.current, 1.1, 0.08);
        if (i % 4 === 0) note(g, MELODY[i] / 2, next.current, 2, 0.06);
        next.current += STEP;
      }
    }, 200);
  }, [stopMusic]);

  const start = useCallback(() => {
    setOn(true);
    startMusic();
  }, [startMusic]);

  const toggle = useCallback(() => {
    setOn((v) => {
      if (v) stopMusic();
      else startMusic();
      return !v;
    });
  }, [startMusic, stopMusic]);

  const chime = useCallback(() => {
    if (!on || !ac.current || !master.current) return;
    const t = ac.current.currentTime;
    [784, 988, 1175, 1568].forEach((f, i) => note(master.current!, f, t + i * 0.11, 1.2, 0.12));
  }, [on]);

  const duck = useCallback((d: boolean) => {
    ducked.current = d;
    const c = ac.current;
    const g = music.current;
    if (c && g) g.gain.setTargetAtTime(d ? 0 : 1, c.currentTime, 0.08);
  }, []);

  useEffect(() => {
    const vis = () => {
      if (!ac.current) return;
      if (document.hidden) void ac.current.suspend();
      else if (on) void ac.current.resume();
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [on]);

  useEffect(() => () => stopMusic(), [stopMusic]);

  return <Ctx.Provider value={{ on, toggle, start, chime, duck }}>{children}</Ctx.Provider>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { useSound } from "./SoundProvider";

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/** Video with custom controls in the site's style; pauses the music while playing. */
export function VideoPlayer({
  src,
  poster,
  label,
  autoLoop = false,
  className = "",
  onProgress,
  onEnded,
}: {
  src: string;
  poster: string;
  label: string;
  autoLoop?: boolean;
  className?: string;
  onProgress?: (k: number) => void;
  onEnded?: () => void;
}) {
  const v = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const { duck } = useSound();

  useEffect(() => () => duck(false), [duck]);

  const toggle = () => {
    const el = v.current!;
    if (el.paused) void el.play();
    else el.pause();
  };
  const seek = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    v.current!.currentTime = k * (v.current!.duration || 0);
  };

  return (
    <div className={`group relative overflow-hidden bg-[#2a0614] ${className}`}>
      <video
        ref={v}
        src={src}
        poster={poster}
        playsInline
        muted={autoLoop}
        loop={autoLoop}
        autoPlay={autoLoop}
        preload="metadata"
        aria-label={label}
        onPlay={() => {
          setPlaying(true);
          if (!autoLoop) duck(true);
        }}
        onPause={() => {
          setPlaying(false);
          duck(false);
        }}
        onEnded={onEnded}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setT(el.currentTime);
          if (onProgress && el.duration) onProgress(el.currentTime / el.duration);
        }}
        onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
        className="absolute inset-0 block size-full object-cover"
        onClick={toggle}
      />
      {!autoLoop && (
        <>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className={`btn3d gold icon-only lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !rounded-full transition-opacity duration-500 ${playing ? "opacity-0 group-hover:opacity-100" : ""}`}
            style={{ width: 76, minHeight: 76 }}
          >
            <Icon name={playing ? "pause" : "play"} className="size-8 translate-x-[1px] text-wine" />
          </button>
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full bg-black/40 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md">
            <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"} className="grid size-9 place-items-center rounded-full bg-goldfoil text-wine">
              <Icon name={playing ? "pause" : "play"} className="size-4" />
            </button>
            <div
              ref={bar}
              role="slider"
              tabIndex={0}
              aria-label="Progreso del video"
              aria-valuemin={0}
              aria-valuemax={Math.round(d)}
              aria-valuenow={Math.round(t)}
              aria-valuetext={`${fmt(t)} de ${fmt(d)}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                seek(e.clientX);
              }}
              onPointerMove={(e) => e.buttons && seek(e.clientX)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") v.current!.currentTime += 5;
                if (e.key === "ArrowLeft") v.current!.currentTime -= 5;
                e.stopPropagation();
              }}
              className="relative h-2 flex-1 cursor-pointer rounded-full bg-white/25"
            >
              <div className="absolute inset-y-0 left-0 rounded-full bg-goldfoil" style={{ width: `${d ? (t / d) * 100 : 0}%` }} />
              <div className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold shadow" style={{ left: `${d ? (t / d) * 100 : 0}%` }} />
            </div>
            <span className="tabular-nums">{fmt(t)}</span>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icon3D } from "./Assets";
import { Icon } from "./Icons";
import { useSound } from "./SoundProvider";

/**
 * Pedro's videos stay on YouTube (his requirement). The page shows the video's own thumbnail and loads
 * YouTube's privacy-enhanced player only when someone presses play, so nothing from YouTube loads before then.
 * The site music pauses while the player is open.
 */
export function YouTube({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const [on, setOn] = useState(false);
  const { duck } = useSound();
  useEffect(() => {
    if (!on) return;
    duck(true);
    return () => duck(false);
  }, [on, duck]);

  return (
    <div className={`relative overflow-hidden bg-[#2a0614] ${className}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Ver el video: ${title}`} className="group absolute inset-0 size-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail, loaded only when visible */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300 group-hover:scale-110">
            <Icon3D name="video" className="size-20 drop" />
          </span>
          <span className="absolute inset-x-4 bottom-3 flex items-center gap-2 text-left text-sm font-bold text-white [text-shadow:0_1px_6px_rgb(0_0_0/.6)]">
            <Icon name="youtube" className="size-5 shrink-0" />
            <span className="line-clamp-1">{title}</span>
          </span>
        </button>
      )}
    </div>
  );
}

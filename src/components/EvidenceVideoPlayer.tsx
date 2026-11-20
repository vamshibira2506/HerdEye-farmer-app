import React, { useEffect, useState } from 'react';
import { Pause, Play, Video } from 'lucide-react';
import { EvidenceVideo } from '../types';

interface EvidenceVideoPlayerProps {
  video: EvidenceVideo;
  compact?: boolean;
}

export const EvidenceVideoPlayer: React.FC<EvidenceVideoPlayerProps> = ({
  video,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= video.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, video.durationSec]);

  const progress = Math.min(100, (elapsed / video.durationSec) * 100);
  const formatSec = (s: number) => `00:${String(s).padStart(2, '0')}`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-950 text-white">
      <div
        className={`relative w-full ${
          compact ? 'h-36 sm:h-40' : 'h-48 sm:h-56'
        } overflow-hidden bg-slate-900`}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying ? 'scale-105 brightness-95' : 'brightness-75'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Subtle dark scrim for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50" />

        {/* Top camera HUD */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-medium">
          <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-slate-100">
            <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{video.cameraName}</span>
          </span>
          <span className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md font-mono-num text-slate-200 shrink-0">
            {video.recordedAt}
          </span>
        </div>

        {/* Center Play / Pause Button */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          aria-label={isPlaying ? 'Pause evidence video' : 'Play evidence video'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Bottom Progress & Title */}
        <div className="absolute bottom-2.5 left-3 right-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-white truncate">
              {video.title}
            </span>
            <span className="font-mono-num text-[11px] text-slate-200 shrink-0">
              {formatSec(elapsed)} / {formatSec(video.durationSec)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C4963B] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2.5 bg-slate-900 text-xs text-slate-300 border-t border-white/10">
        {video.summary}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { Playlist, NowPlaying, MusicControls } from './components/MusicPlayer';
import { Equalizer } from './components/Equalizer';
import { motion } from 'motion/react';
import { Zap, Volume2 } from 'lucide-react';
import { TRACKS } from './constants';

export default function App() {
  // Music State Management
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const musicState = {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    handleSeek,
    onTrackSelect,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      {/* 12-Column Bento Grid Container */}
      <div className="w-full max-w-[1280px] h-[calc(100vh-4rem)] grid grid-cols-12 grid-rows-6 gap-4">
        
        {/* Left Column: Playlist & Stats */}
        <div className="col-span-12 lg:col-span-3 row-span-4 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden">
            <Playlist state={musicState} />
          </div>
          
          <div className="neon-border bg-slate-900/50 p-6 rounded-2xl h-32 flex flex-col justify-between overflow-hidden group">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Session Stats</h2>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-black neon-text-pink leading-none tracking-tighter">0.8s</span>
                <span className="text-[9px] text-slate-500 uppercase mt-1">RESPONSE TIME</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-white font-mono">1.5x</span>
                <span className="text-[9px] text-fuchsia-400/70 font-mono tracking-widest">BOOST ACTIVE</span>
              </div>
            </div>
            {/* Tiny accent decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>

        {/* Center: Game Window */}
        <div className="col-span-12 lg:col-span-6 row-span-4 neon-border bg-black rounded-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <SnakeGame />
        </div>

        {/* Right Column: Now Playing */}
        <div className="col-span-12 lg:col-span-3 row-span-4">
          <NowPlaying state={musicState} />
        </div>

        {/* Bottom Row: Master Controls & Equalizer */}
        <div className="col-span-12 row-span-2 neon-border bg-slate-900/80 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          {/* Main Playback Controls */}
          <div className="flex-shrink-0">
            <MusicControls state={musicState} />
          </div>

          {/* Visualizer / Equalizer Section */}
          <div className="flex-1 w-full flex flex-col gap-3">
             <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                   <Zap className="w-3 h-3 text-cyan-400" />
                   <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Neural_Sync_Spectrum v2.4</span>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden sm:inline">Bitrate: 320kbps</span>
                   <div className="flex items-center gap-2">
                      <Volume2 className="w-3 h-3 text-slate-500" />
                      <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-slate-500"></div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex-1 bg-black/40 rounded-xl border border-slate-800/30 p-2 flex items-center overflow-hidden">
                <Equalizer isPlaying={isPlaying} />
             </div>
          </div>

          {/* Meta Info */}
          <div className="hidden xl:flex flex-col gap-2 min-w-[120px]">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#39ff14]/40 animate-pulse"></div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Buffer Stable</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">DRM Verified</span>
             </div>
          </div>

        </div>
      </div>

      {/* Grid background decoration for whole page */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5">
          <div className="absolute inset-0 game-grid"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2, Mic2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

interface MusicState {
    currentTrack: Track;
    isPlaying: boolean;
    progress: number;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    currentTime: number;
    duration: number;
    onTrackSelect: (index: number) => void;
}

export const Playlist: React.FC<{ state: MusicState }> = ({ state }) => {
    return (
        <div className="neon-border bg-slate-900/50 p-6 rounded-2xl h-full flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Music2 className="w-3 h-3" />
                SYSTEM PLAYLIST
            </h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {TRACKS.map((track, index) => {
                    const isActive = state.currentTrack.id === track.id;
                    return (
                        <div 
                            key={track.id}
                            onClick={() => state.onTrackSelect(index)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                                isActive 
                                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                                    : 'bg-slate-800/30 border-transparent hover:bg-slate-800/50 hover:border-slate-700/50'
                            }`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono font-bold text-xs ${
                                isActive ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                            }`}>
                                {(index + 1).toString().padStart(2, '0')}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-sm font-semibold truncate ${isActive ? 'neon-text-cyan' : 'text-slate-300'}`}>
                                    {isActive && state.isPlaying && <span className="mr-2 inline-block animate-pulse text-[10px]">▶</span>}
                                    {track.title}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{track.artist}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const NowPlaying: React.FC<{ state: MusicState }> = ({ state }) => {
    return (
        <div className="neon-border bg-slate-900/50 p-8 rounded-2xl flex flex-col items-center justify-center gap-8 h-full text-center">
             <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 rounded-full blur-xl scale-110 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="w-40 h-40 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden z-10 p-1">
                    <motion.div 
                        animate={{ rotate: state.isPlaying ? 360 : 0 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full rounded-full overflow-hidden"
                    >
                        <img 
                            src={state.currentTrack.coverUrl} 
                            alt={state.currentTrack.title} 
                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all opacity-80"
                            referrerPolicy="no-referrer"
                        />
                    </motion.div>
                    {/* Abstract Overlay */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 rotate-45 pointer-events-none opacity-40"></div>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-xl font-bold neon-text-cyan tracking-tight">{state.currentTrack.title}</h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-[0.25em]">{state.currentTrack.artist}</p>
            </div>

            <div className="w-full space-y-3">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono tracking-tighter">
                    <span>{Math.floor(state.currentTime / 60)}:{(Math.floor(state.currentTime % 60)).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(state.duration / 60)}:{(Math.floor(state.duration % 60)).toString().padStart(2, '0')}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div 
                        initial={false}
                        animate={{ width: `${state.progress}%` }}
                        className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]"
                    />
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50 flex items-center gap-2">
                        <Mic2 className="w-3 h-3 text-slate-600" />
                        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">24-BIT HI-RES</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MusicControls: React.FC<{ state: MusicState }> = ({ state }) => {
    return (
        <div className="flex items-center gap-10">
            <button 
                onClick={state.prevTrack} 
                className="text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
                <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button 
                onClick={state.togglePlay}
                className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
                {state.isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button 
                onClick={state.nextTrack}
                className="text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
                <SkipForward className="w-6 h-6 fill-current" />
            </button>
        </div>
    );
};

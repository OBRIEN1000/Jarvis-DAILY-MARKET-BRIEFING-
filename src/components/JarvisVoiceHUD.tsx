import React, { useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Zap,
  Layers,
  Settings2,
  Square,
} from 'lucide-react';
import { VoiceStatus, JarvisPreferences } from '../types';

interface JarvisVoiceHUDProps {
  status: VoiceStatus;
  isListening: boolean;
  interimTranscript: string;
  isSpeaking: boolean;
  preferences: JarvisPreferences;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
  onTriggerQuickPrompt: (prompt: string) => void;
  onOpenSettings: () => void;
  onToggleContinuous: () => void;
}

export const JarvisVoiceHUD: React.FC<JarvisVoiceHUDProps> = ({
  status,
  isListening,
  interimTranscript,
  isSpeaking,
  preferences,
  onToggleListening,
  onStopSpeaking,
  onTriggerQuickPrompt,
  onOpenSettings,
  onToggleContinuous,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Determine activity level
      const isActive = isSpeaking || isListening || status === 'processing';
      const baseAmp = isSpeaking ? 28 : isListening ? 18 : status === 'processing' ? 22 : 4;
      const numWaves = 4;

      for (let w = 0; w < numWaves; w++) {
        ctx.beginPath();
        ctx.lineWidth = w === 0 ? 2.5 : 1.2;

        if (isSpeaking) {
          ctx.strokeStyle = w === 0 ? '#38bdf8' : `rgba(56, 189, 248, ${0.4 - w * 0.08})`;
        } else if (isListening) {
          ctx.strokeStyle = w === 0 ? '#34d399' : `rgba(52, 211, 153, ${0.4 - w * 0.08})`;
        } else if (status === 'processing') {
          ctx.strokeStyle = w === 0 ? '#fbbf24' : `rgba(251, 191, 36, ${0.4 - w * 0.08})`;
        } else {
          ctx.strokeStyle = `rgba(148, 163, 184, 0.2)`;
        }

        for (let x = 0; x < width; x += 4) {
          const freq = (x / width) * 4 * Math.PI;
          const decay = Math.sin((x / width) * Math.PI); // Pin to edges
          const offset = phase + w * 0.7;
          const y = centerY + Math.sin(freq + offset) * baseAmp * decay * (1 + (w % 2) * 0.3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      phase += isActive ? 0.08 : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpeaking, isListening, status]);

  const getStatusText = () => {
    if (isSpeaking) return 'JARVIS IS SPEAKING // TRANSMITTING AUDIO';
    if (status === 'processing') return 'PROCESSING FINANCIAL INTELLIGENCE...';
    if (isListening) return 'ALWAYS-ON VOICE ACTIVE // LISTENING TO TRADER';
    return 'VOICE HUD STANDBY // CLICK TO ACTIVATE';
  };

  const getStatusColor = () => {
    if (isSpeaking) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40 shadow-cyan-500/20';
    if (status === 'processing') return 'text-amber-400 border-amber-500/40 bg-amber-950/40 shadow-amber-500/20';
    if (isListening) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 shadow-emerald-500/20';
    return 'text-slate-400 border-slate-700 bg-slate-900/40 shadow-none';
  };

  const QUICK_COMMANDS = [
    { label: '☀️ Morning Briefing', query: 'Jarvis, give me my full morning market briefing with today\'s key earnings, macro events, and watchlist outlook.' },
    { label: '📊 Market Sentiment', query: 'What is the current market sentiment and Fear & Greed index score across Wall Street and Crypto right now?' },
    { label: '⚡ Pre-Market Movers', query: 'What are the top pre-market gainers and losers today and what are their catalysts?' },
    { label: '🎯 Analyze Tech Leaders', query: 'Give me a live sentiment and key technical level breakdown for NVDA, AAPL, and MSFT.' },
    { label: '🪙 Crypto & Macro', query: 'How are Bitcoin and 10-year Treasury yields trading today relative to equities?' },
  ];

  return (
    <section
      id="jarvis-voice-hud"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl"
    >
      {/* Background Holographic Arc & Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-cyan-400 border-dashed animate-spin-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Controls: Voice Mode, Voice Profile, Settings */}
        <div className="w-full flex items-center justify-between gap-2 pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleContinuous}
              id="btn-toggle-continuous-voice"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                preferences.continuousListening
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Hands-Free Always-On Voice Mode"
            >
              <Radio className={`w-3.5 h-3.5 ${preferences.continuousListening ? 'text-cyan-400 animate-pulse' : ''}`} />
              <span>{preferences.continuousListening ? 'ALWAYS-ON VOICE: ON' : 'ALWAYS-ON VOICE: OFF'}</span>
            </button>
            <span className="hidden sm:inline text-[11px] text-slate-500 font-mono">
              Voice: <strong className="text-cyan-400">{preferences.voiceName}</strong> ({preferences.tone})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                id="btn-interrupt-speech"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs hover:bg-rose-500/30 transition-all font-mono"
                title="Stop Jarvis voice playback"
              >
                <Square className="w-3 h-3 fill-rose-300" />
                <span>INTERRUPT</span>
              </button>
            )}
            <button
              onClick={onOpenSettings}
              id="btn-open-jarvis-settings"
              className="p-1.5 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
              title="JARVIS Voice AI Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central JARVIS Reactor Core & Waveform Visualizer */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          {/* Outer Glowing Ring */}
          <div
            className={`relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-500 ${
              isSpeaking
                ? 'ring-4 ring-cyan-400/40 shadow-xl shadow-cyan-500/30'
                : isListening
                ? 'ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-500/30'
                : status === 'processing'
                ? 'ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/30'
                : 'ring-1 ring-slate-800 shadow-inner'
            }`}
          >
            {/* Spinning Circuit Accents */}
            <div
              className={`absolute inset-0 rounded-full border border-cyan-400/20 border-t-cyan-400 ${
                isSpeaking || isListening || status === 'processing' ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            <div
              className={`absolute -inset-2 rounded-full border border-cyan-400/10 border-b-cyan-400/60 ${
                isSpeaking || isListening ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '8s', animationDirection: 'reverse' }}
            />

            {/* Core Mic / Speaker Interactive Button */}
            <button
              onClick={onToggleListening}
              id="btn-jarvis-core-mic"
              className={`group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/40 scale-105'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-cyan-600 to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/40'
                  : status === 'processing'
                  ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-cyan-400 hover:from-slate-700 hover:to-cyan-900/50 hover:text-cyan-300'
              }`}
              title={isListening ? 'Click to pause voice listening' : 'Click to activate JARVIS voice mode'}
            >
              {isSpeaking ? (
                <Volume2 className="w-9 h-9 animate-bounce" />
              ) : isListening ? (
                <Mic className="w-9 h-9 animate-pulse" />
              ) : status === 'processing' ? (
                <Sparkles className="w-8 h-8 animate-spin" />
              ) : (
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Dynamic Audio Waveform Canvas */}
          <div className="w-full max-w-md h-12 mt-2">
            <canvas ref={canvasRef} width={420} height={48} className="w-full h-full" />
          </div>

          {/* Live Status Badge */}
          <div
            id="jarvis-status-badge"
            className={`mt-1 inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-semibold border shadow-sm transition-all ${getStatusColor()}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isSpeaking
                  ? 'bg-cyan-400 animate-ping'
                  : isListening
                  ? 'bg-emerald-400 animate-ping'
                  : status === 'processing'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-500'
              }`}
            />
            <span>{getStatusText()}</span>
          </div>

          {/* Real-time speech transcript preview */}
          {interimTranscript && (
            <div
              id="interim-voice-transcript"
              className="mt-2 text-sm text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg max-w-lg animate-pulse"
            >
              "{interimTranscript}..."
            </div>
          )}
        </div>

        {/* Quick Voice Trader Command Chips */}
        <div className="w-full mt-2 pt-3 border-t border-cyan-500/15 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Quick Audio Directives:
          </span>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => onTriggerQuickPrompt(cmd.query)}
              id={`btn-quick-voice-${cmd.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-cyan-950 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all font-mono cursor-pointer"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

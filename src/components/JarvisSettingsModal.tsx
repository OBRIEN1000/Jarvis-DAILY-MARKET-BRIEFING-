import React from 'react';
import {
  X,
  Sliders,
  Volume2,
  Mic,
  Clock,
  Shield,
  Sparkles,
  Bot,
  Radio,
} from 'lucide-react';
import { JarvisPreferences, JarvisVoiceTone } from '../types';

interface JarvisSettingsModalProps {
  isOpen: boolean;
  preferences: JarvisPreferences;
  onClose: () => void;
  onSavePreferences: (updated: JarvisPreferences) => void;
}

export const JarvisSettingsModal: React.FC<JarvisSettingsModalProps> = ({
  isOpen,
  preferences,
  onClose,
  onSavePreferences,
}) => {
  if (!isOpen) return null;

  const voices: Array<{ name: JarvisPreferences['voiceName']; description: string }> = [
    { name: 'Puck', description: 'Crisp British AI assistant (Default JARVIS)' },
    { name: 'Fenrir', description: 'Authoritative, deep institutional delivery' },
    { name: 'Zephyr', description: 'Fast-paced, modern tactical cadence' },
    { name: 'Charon', description: 'Resonant, calm risk-management tone' },
    { name: 'Kore', description: 'High-clarity analytic presentation' },
  ];

  const tones: Array<{ id: JarvisVoiceTone; title: string; desc: string }> = [
    {
      id: 'jarvis',
      title: 'Classic JARVIS',
      desc: 'Polite British intelligence assistant, concise market briefings, "Good morning, Sir"',
    },
    {
      id: 'tactical',
      title: 'Quantitative Trader',
      desc: 'Rapid support/resistance breakouts, risk-reward ratios, volatility stops',
    },
    {
      id: 'institutional',
      title: 'Chief Investment Officer',
      desc: 'Macro liquidity cycles, Treasury yield impacts, institutional capital flows',
    },
    {
      id: 'cryptotrader',
      title: 'Crypto Alpha',
      desc: 'On-chain flows, ETF momentum, funding rates, high-beta token volatility',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="jarvis-settings-modal"
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-5 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-slate-100">
                JARVIS VOICE & AI CONFIGURATION
              </h3>
              <p className="text-xs text-slate-400">
                Audio neural engine, personality tones, and voice loop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Voice Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            GEMINI VOICE PROFILE (TTS)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {voices.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => onSavePreferences({ ...preferences, voiceName: v.name })}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                  preferences.voiceName === v.name
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-slate-200">{v.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{v.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Trading Personality Tone */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            JARVIS PERSONA & ANALYTIC TONE
          </label>
          <div className="space-y-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSavePreferences({ ...preferences, tone: t.id })}
                className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all ${
                  preferences.tone === t.id
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-slate-200">{t.title}</div>
                <div className="text-[11px] text-slate-400">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Toggles: Continuous Voice & Auto-Speak */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="font-mono font-bold text-slate-200 block">
                Continuous Always-On Voice Mode
              </span>
              <span className="text-[11px] text-slate-400">
                Keeps microphone actively listening for hands-free trader dialogue
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({
                  ...preferences,
                  continuousListening: !preferences.continuousListening,
                })
              }
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                preferences.continuousListening ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  preferences.continuousListening ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="font-mono font-bold text-slate-200 block">
                Auto-Speak Responses
              </span>
              <span className="text-[11px] text-slate-400">
                Immediately synthesize voice audio for all market answers
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({
                  ...preferences,
                  autoSpeakResponses: !preferences.autoSpeakResponses,
                })
              }
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                preferences.autoSpeakResponses ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  preferences.autoSpeakResponses ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            CONFIRM & APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  X,
  Sliders,
  Volume2,
  Bot,
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
    { name: 'Puck', description: 'Crisp British AI assistant (Default)' },
    { name: 'Fenrir', description: 'Authoritative, deep institutional delivery' },
    { name: 'Zephyr', description: 'Fast-paced, modern tactical cadence' },
    { name: 'Charon', description: 'Resonant, calm risk-management tone' },
    { name: 'Kore', description: 'High-clarity analytic presentation' },
  ];

  const tones: Array<{ id: JarvisVoiceTone; title: string; desc: string }> = [
    {
      id: 'jarvis',
      title: 'JARVIS Protocol',
      desc: 'Polite British intelligence, concise briefings',
    },
    {
      id: 'tactical',
      title: 'Quantitative Trader',
      desc: 'Breakouts, risk-reward ratios, volatility stops',
    },
    {
      id: 'institutional',
      title: 'Chief Investment Officer',
      desc: 'Macro liquidity cycles, Treasury yield impacts',
    },
    {
      id: 'cryptotrader',
      title: 'Crypto Alpha',
      desc: 'On-chain flows, ETF momentum, token volatility',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        id="jarvis-settings-modal"
        className="w-full max-w-lg bg-black border border-yellow-500/50 p-5 space-y-4 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20">
          <div className="flex items-center gap-2 font-mono">
            <Sliders className="w-4 h-4 text-yellow-400" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              VOICE PARAMETERS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Voice Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5 uppercase">
            <Volume2 className="w-3.5 h-3.5" />
            Voice Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {voices.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => onSavePreferences({ ...preferences, voiceName: v.name })}
                className={`p-2 text-left border text-xs transition-all ${
                  preferences.voiceName === v.name
                    ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-mono">{v.name}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{v.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Persona Tone */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5 uppercase">
            <Bot className="w-3.5 h-3.5" />
            Persona Tone
          </label>
          <div className="space-y-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSavePreferences({ ...preferences, tone: t.id })}
                className={`w-full p-2 text-left border text-xs transition-all ${
                  preferences.tone === t.id
                    ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-mono">{t.title}</div>
                <div className="text-[10px] opacity-80">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Toggles */}
        <div className="space-y-2 pt-2 border-t border-yellow-500/20">
          <div className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-800 text-xs">
            <div>
              <span className="font-mono font-bold text-neutral-200 block">
                Continuous Voice Mode
              </span>
              <span className="text-[10px] text-neutral-500">
                Keeps microphone actively listening
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({
                  ...preferences,
                  continuousListening: !preferences.continuousListening,
                })
              }
              className={`px-3 py-1 font-mono text-xs font-bold border transition-colors ${
                preferences.continuousListening
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {preferences.continuousListening ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-800 text-xs">
            <div>
              <span className="font-mono font-bold text-neutral-200 block">
                Auto-Speak Answers
              </span>
              <span className="text-[10px] text-neutral-500">
                Immediately synthesize voice output
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({
                  ...preferences,
                  autoSpeakResponses: !preferences.autoSpeakResponses,
                })
              }
              className={`px-3 py-1 font-mono text-xs font-bold border transition-colors ${
                preferences.autoSpeakResponses
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {preferences.autoSpeakResponses ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-mono font-bold uppercase transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

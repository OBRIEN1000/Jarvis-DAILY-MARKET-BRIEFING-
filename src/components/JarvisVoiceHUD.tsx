import React from 'react';
import {
  Square,
  Settings2,
  Radio,
  Volume2,
} from 'lucide-react';
import { VoiceStatus, JarvisPreferences } from '../types';
import { JarvisThreeVisualizer } from './JarvisThreeVisualizer';

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
  const QUICK_COMMANDS = [
    { label: 'Briefing', query: 'Jarvis, give me my full morning market briefing with today\'s key earnings, macro events, and watchlist outlook.' },
    { label: 'Sentiment', query: 'What is the current market sentiment and Fear & Greed index score across Wall Street and Crypto right now?' },
    { label: 'Pre-Market', query: 'What are the top pre-market gainers and losers today and what are their catalysts?' },
    { label: 'Tech Leaders', query: 'Give me a live sentiment and key technical level breakdown for NVDA, AAPL, and MSFT.' },
    { label: 'BTC & Macro', query: 'How are Bitcoin and 10-year Treasury yields trading today relative to equities?' },
  ];

  return (
    <section
      id="jarvis-voice-hud"
      className="relative overflow-hidden bg-black border border-yellow-500/30 text-white"
    >
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 border-b border-yellow-500/20 bg-black/90">
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={onToggleContinuous}
            id="btn-toggle-continuous-voice"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border transition-all ${
              preferences.continuousListening
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{preferences.continuousListening ? 'MIC: CONTINUOUS' : 'MIC: MANUAL'}</span>
          </button>

          <span className="hidden sm:inline text-neutral-400">
            Voice: <strong className="text-yellow-400">{preferences.voiceName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              id="btn-interrupt-speech"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold hover:bg-red-900 transition-all"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>STOP</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            id="btn-open-jarvis-settings"
            className="p-1.5 bg-neutral-900 border border-neutral-800 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
            title="Voice AI Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Wave Visualizer (Three.js) */}
      <JarvisThreeVisualizer
        status={status}
        isListening={isListening}
        isSpeaking={isSpeaking}
        onToggleListening={onToggleListening}
      />

      {/* Real-time speech transcript preview if speaking */}
      {interimTranscript && (
        <div className="px-4 py-1.5 bg-neutral-950 border-t border-yellow-500/30 text-xs font-mono text-yellow-300">
          "{interimTranscript}..."
        </div>
      )}

      {/* Quick Directives Bar */}
      <div className="w-full px-4 py-2 border-t border-yellow-500/20 bg-black flex flex-wrap items-center gap-1.5 font-mono text-xs">
        <span className="text-neutral-500 mr-1 text-[11px] uppercase tracking-wider">Directives:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd.label}
            onClick={() => onTriggerQuickPrompt(cmd.query)}
            id={`btn-quick-voice-${cmd.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
            className="px-2.5 py-0.5 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-neutral-800 hover:border-yellow-400 text-neutral-300 transition-all font-mono text-xs cursor-pointer"
          >
            {cmd.label}
          </button>
        ))}
      </div>
    </section>
  );
};

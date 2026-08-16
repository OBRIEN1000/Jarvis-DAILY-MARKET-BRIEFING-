import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Radio,
  Sliders,
  Volume2,
  RefreshCw,
  Sun,
  Shield,
  Bot,
  Activity,
  AlertCircle,
} from 'lucide-react';
import {
  VoiceStatus,
  WatchlistItem,
  MarketSentimentData,
  MorningBriefingData,
  VoiceMessage,
  JarvisPreferences,
} from './types';
import { LiveMarketTickerBar } from './components/LiveMarketTickerBar';
import { JarvisVoiceHUD } from './components/JarvisVoiceHUD';
import { MorningBriefingCard } from './components/MorningBriefingCard';
import { MarketSentimentGauge } from './components/MarketSentimentGauge';
import { WatchlistManager } from './components/WatchlistManager';
import { VoiceChatLog } from './components/VoiceChatLog';
import { JarvisSettingsModal } from './components/JarvisSettingsModal';
import { useSpeechRecognition } from './utils/useSpeechRecognition';
import {
  playPcmAudio,
  playWebSpeechSynthesis,
  stopCurrentAudio,
} from './utils/audioPlayer';

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  {
    symbol: 'NVDA',
    name: 'Nvidia Corp',
    sentiment: 'Bullish',
    sentimentScore: 86,
    targetPrice: 155.0,
    stopLoss: 128.0,
    thesis: 'Data center AI accelerator demand remains strong; monitoring key breakout.',
    catalysts: ['Upcoming earnings release', 'Blackwell GPU supply ramp'],
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    sentiment: 'Volatile',
    sentimentScore: 58,
    targetPrice: 280.0,
    stopLoss: 210.0,
    thesis: 'Consolidating near 50-day moving average; Robotaxi deployment catalysts.',
    catalysts: ['FSD v13 rollout', 'Global delivery volume prints'],
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    sentiment: 'Bullish',
    sentimentScore: 82,
    targetPrice: 105000.0,
    stopLoss: 92000.0,
    thesis: 'Institutional ETF net inflows and sovereign reserve accumulation.',
    catalysts: ['Spot ETF daily volumes', 'Macro liquidity expansion'],
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    sentiment: 'Bullish',
    sentimentScore: 74,
    targetPrice: 535.0,
    stopLoss: 495.0,
    thesis: 'Broad-based large-cap tech earnings momentum vs 10-year yield resistance.',
    catalysts: ['Big-tech mega-cap earnings reports', 'Fed interest rate trajectory'],
    lastUpdated: new Date().toISOString(),
  },
];

const DEFAULT_PREFERENCES: JarvisPreferences = {
  voiceName: 'Puck',
  tone: 'jarvis',
  continuousListening: true,
  autoSpeakResponses: true,
  morningBriefingTime: '08:30',
  speechRate: 1.05,
};

export default function App() {
  // Voice & AI States
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [preferences, setPreferences] = useState<JarvisPreferences>(() => {
    try {
      const saved = localStorage.getItem('jarvis_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Data States
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  const [morningBriefing, setMorningBriefing] = useState<MorningBriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [isPlayingBriefingAudio, setIsPlayingBriefingAudio] = useState(false);

  const [marketSentiment, setMarketSentiment] = useState<MarketSentimentData | null>(null);
  const [isSentimentLoading, setIsSentimentLoading] = useState(false);

  const [messages, setMessages] = useState<VoiceMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-1',
        sender: 'jarvis',
        text: "Good morning, Sir. JARVIS trading core online and calibrated to Google Finance feeds. All voice neural channels are open. Speak your market directive or click any preset to begin.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [isChatProcessing, setIsChatProcessing] = useState(false);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('jarvis_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('jarvis_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('jarvis_chat_messages', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  // Audio Playback Controller
  const currentAudioStopRef = useRef<(() => void) | null>(null);

  const stopSpeaking = useCallback(() => {
    stopCurrentAudio();
    if (currentAudioStopRef.current) {
      currentAudioStopRef.current();
      currentAudioStopRef.current = null;
    }
    setIsSpeaking(false);
    setIsPlayingBriefingAudio(false);
    setVoiceStatus('idle');
  }, []);

  // Vocalize response using Gemini TTS or Web Speech fallback
  const speakText = useCallback(
    async (text: string, onDone?: () => void) => {
      stopSpeaking();
      setIsSpeaking(true);
      setVoiceStatus('speaking');

      try {
        // Try Gemini TTS server endpoint first
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: preferences.voiceName,
          }),
        });

        const data = await res.json();

        if (data.success && data.audioBase64) {
          const playback = await playPcmAudio(data.audioBase64, () => {
            setIsSpeaking(false);
            setIsPlayingBriefingAudio(false);
            setVoiceStatus('idle');
            if (onDone) onDone();
          });
          currentAudioStopRef.current = playback.stop;
          return;
        }
      } catch (err) {
        console.warn('Gemini TTS endpoint failed, using Web Speech synthesis:', err);
      }

      // Fallback: Web Speech API synthesis
      const playback = playWebSpeechSynthesis(
        text,
        { rate: preferences.speechRate, voiceName: preferences.voiceName },
        () => {
          setIsSpeaking(false);
          setIsPlayingBriefingAudio(false);
          setVoiceStatus('idle');
          if (onDone) onDone();
        }
      );
      currentAudioStopRef.current = playback.stop;
    },
    [preferences.voiceName, preferences.speechRate, stopSpeaking]
  );

  // Send message to JARVIS AI Core
  const handleSendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isChatProcessing) return;

      stopSpeaking();

      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsChatProcessing(true);
      setVoiceStatus('processing');

      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: historyPayload,
            watchlist,
            tone: preferences.tone,
          }),
        });

        const data = await response.json();
        const replyText =
          data.text ||
          'Market feed updated, Sir. I have scanned the latest financial data.';

        const jarvisMsg: VoiceMessage = {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
        };

        setMessages((prev) => [...prev, jarvisMsg]);
        setIsChatProcessing(false);

        // Speak aloud if enabled
        if (preferences.autoSpeakResponses) {
          speakText(replyText);
        } else {
          setVoiceStatus('idle');
        }
      } catch (err: any) {
        console.error('Error in chat loop:', err);
        const errorMsg: VoiceMessage = {
          id: `error-${Date.now()}`,
          sender: 'jarvis',
          text: 'Apologies, Sir. A momentary interference occurred in the intelligence feed. Please repeat your query.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsChatProcessing(false);
        setVoiceStatus('idle');
      }
    },
    [isChatProcessing, messages, watchlist, preferences.tone, preferences.autoSpeakResponses, speakText, stopSpeaking]
  );

  // Speech Recognition Hook
  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  } = useSpeechRecognition({
    continuous: preferences.continuousListening,
    onResult: (finalTranscript) => {
      if (finalTranscript.trim()) {
        handleSendMessage(finalTranscript.trim());
      }
    },
  });

  // Auto-start listening if continuous mode is enabled
  useEffect(() => {
    if (preferences.continuousListening && !isListening && !isSpeaking) {
      startListening();
    }
  }, [preferences.continuousListening, isListening, isSpeaking, startListening]);

  // Fetch Morning Briefing
  const fetchMorningBriefing = useCallback(async () => {
    setIsBriefingLoading(true);
    try {
      const res = await fetch('/api/morning-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setMorningBriefing(data);
      }
    } catch (err) {
      console.error('Failed to fetch morning briefing:', err);
    } finally {
      setIsBriefingLoading(false);
    }
  }, [watchlist]);

  // Fetch Market Sentiment
  const fetchMarketSentiment = useCallback(async () => {
    setIsSentimentLoading(true);
    try {
      const res = await fetch('/api/market-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data && !data.error) {
        setMarketSentiment(data);
      }
    } catch (err) {
      console.error('Failed to fetch market sentiment:', err);
    } finally {
      setIsSentimentLoading(false);
    }
  }, []);

  // Initial Load: Staggered fetch to prevent concurrent burst spikes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const initData = async () => {
      await fetchMarketSentiment();
      timer = setTimeout(() => {
        fetchMorningBriefing();
      }, 500);
    };
    initData();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Play Morning Audio Briefing
  const handlePlayMorningAudioBriefing = useCallback(() => {
    if (isPlayingBriefingAudio) {
      stopSpeaking();
      return;
    }

    if (!morningBriefing?.audioScript) return;

    setIsPlayingBriefingAudio(true);
    speakText(morningBriefing.audioScript, () => {
      setIsPlayingBriefingAudio(false);
    });
  }, [isPlayingBriefingAudio, morningBriefing, speakText, stopSpeaking]);

  // Ask Jarvis to verbally break down sentiment
  const handleAskJarvisSentiment = useCallback(() => {
    handleSendMessage(
      'Jarvis, deliver a full market sentiment verbal report including Fear and Greed levels, VIX, and asset risk regimes.'
    );
  }, [handleSendMessage]);

  // Ask Jarvis to analyze a specific ticker
  const handleAskJarvisForTicker = useCallback(
    (symbol: string) => {
      handleSendMessage(
        `Jarvis, give me an immediate live analysis, sentiment rating, and key technical price levels for ticker ${symbol}.`
      );
    },
    [handleSendMessage]
  );

  // Watchlist Actions
  const handleAddTicker = (item: WatchlistItem) => {
    setWatchlist((prev) => [item, ...prev]);
    handleSendMessage(
      `Jarvis, I have added ${item.symbol} to my active watchlist. Please provide a preliminary pre-market scan and key catalyst check.`
    );
  };

  const handleRemoveTicker = (symbol: string) => {
    setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
  };

  const handleUpdateTicker = (updated: WatchlistItem) => {
    setWatchlist((prev) => prev.map((w) => (w.symbol === updated.symbol ? updated : w)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Live Ticker Strip */}
      <LiveMarketTickerBar onSelectTicker={handleAskJarvisForTicker} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-6">
        {/* Top Hero: JARVIS Holographic Voice HUD */}
        <JarvisVoiceHUD
          status={voiceStatus}
          isListening={isListening}
          interimTranscript={interimTranscript}
          isSpeaking={isSpeaking}
          preferences={preferences}
          onToggleListening={toggleListening}
          onStopSpeaking={stopSpeaking}
          onTriggerQuickPrompt={handleSendMessage}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleContinuous={() =>
            setPreferences((p) => ({
              ...p,
              continuousListening: !p.continuousListening,
            }))
          }
        />

        {/* 2-Column Grid: Left (Morning Briefing & Sentiment), Right (Watchlist & Live Transcript) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Morning Trader Briefing & Market Sentiment */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            {/* Morning Trader Intelligence Card */}
            <MorningBriefingCard
              briefing={morningBriefing}
              isLoading={isBriefingLoading}
              isPlayingAudio={isPlayingBriefingAudio}
              onPlayAudioBriefing={handlePlayMorningAudioBriefing}
              onRefreshBriefing={fetchMorningBriefing}
            />

            {/* Real-time Market Sentiment & Fear/Greed */}
            <MarketSentimentGauge
              sentiment={marketSentiment}
              isLoading={isSentimentLoading}
              onRefreshSentiment={fetchMarketSentiment}
              onAskJarvisSentiment={handleAskJarvisSentiment}
            />
          </div>

          {/* Right Column: Personalized Watchlist & Voice Transcript Log */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            {/* Personalized Trade Watchlist */}
            <WatchlistManager
              watchlist={watchlist}
              onAddTicker={handleAddTicker}
              onRemoveTicker={handleRemoveTicker}
              onUpdateTicker={handleUpdateTicker}
              onAskJarvisForTicker={handleAskJarvisForTicker}
            />

            {/* Voice Chat Transcript Log */}
            <VoiceChatLog
              messages={messages}
              isProcessing={isChatProcessing}
              onSendMessage={handleSendMessage}
              onReplayAudio={(msg) => speakText(msg.text)}
              onClearMessages={() => setMessages([])}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>JARVIS // VOICE AI TRADER ENGINE</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Powered by Gemini 3.7 Flash, Google Search Grounding & Real-time TTS
        </div>
      </footer>

      {/* Settings Modal */}
      <JarvisSettingsModal
        isOpen={isSettingsOpen}
        preferences={preferences}
        onClose={() => setIsSettingsOpen(false)}
        onSavePreferences={(updated) => setPreferences(updated)}
      />
    </div>
  );
}

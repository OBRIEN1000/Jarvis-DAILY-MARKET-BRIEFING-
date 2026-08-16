import React from 'react';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Activity,
  AlertTriangle,
  Radio,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { MarketSentimentData } from '../types';

interface MarketSentimentGaugeProps {
  sentiment: MarketSentimentData | null;
  isLoading: boolean;
  onRefreshSentiment: () => void;
  onAskJarvisSentiment: () => void;
}

export const MarketSentimentGauge: React.FC<MarketSentimentGaugeProps> = ({
  sentiment,
  isLoading,
  onRefreshSentiment,
  onAskJarvisSentiment,
}) => {
  const score = sentiment?.overallScore ?? 58;

  // Calculate arc needle rotation from 0 to 180 degrees
  const needleRotation = (score / 100) * 180 - 90;

  const getScoreColor = (val: number) => {
    if (val >= 75) return 'text-emerald-400';
    if (val >= 55) return 'text-teal-300';
    if (val >= 45) return 'text-amber-400';
    if (val >= 25) return 'text-orange-400';
    return 'text-rose-500';
  };

  const getScoreBg = (val: number) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 55) return 'bg-teal-400';
    if (val >= 45) return 'bg-amber-400';
    if (val >= 25) return 'bg-orange-400';
    return 'bg-rose-500';
  };

  return (
    <div
      id="market-sentiment-module"
      className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all p-5 backdrop-blur-md shadow-xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono">
              MARKET SENTIMENT & FEAR/GREED
            </h2>
            <p className="text-xs text-slate-400">
              Cross-asset momentum & volatility psychology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAskJarvisSentiment}
            id="btn-voice-sentiment-summary"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium transition-all"
            title="Ask Jarvis to speak current sentiment analysis"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>VOICE SCAN</span>
          </button>
          <button
            onClick={onRefreshSentiment}
            disabled={isLoading}
            id="btn-refresh-sentiment"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all disabled:opacity-50"
            title="Refresh sentiment data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-10 flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-400">Computing real-time market sentiment index...</p>
        </div>
      )}

      {!isLoading && sentiment && (
        <div className="mt-4 space-y-5">
          {/* Fear & Greed Arc Gauge + Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            {/* Left: Gauge Needle visualizer */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                {/* Arc Background */}
                <div className="w-36 h-36 rounded-full border-[12px] border-slate-800 border-t-emerald-500 border-r-teal-400 border-b-rose-500 border-l-rose-500 transform -rotate-45" />
                {/* Needle */}
                <div
                  className="absolute bottom-0 w-1 h-14 bg-white origin-bottom transition-transform duration-700 ease-out shadow-lg"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                />
                {/* Pivot center */}
                <div className="absolute bottom-0 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow" />
              </div>

              <div className="mt-1 text-center font-mono">
                <span className={`text-2xl font-black ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ 100</span>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  {sentiment.overallLabel || 'Neutral'}
                </div>
              </div>
            </div>

            {/* Right: Market Regime & VIX */}
            <div className="sm:col-span-7 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">REGIME:</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                    sentiment.regime === 'Risk-On'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : sentiment.regime === 'Risk-Off'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {sentiment.regime}
                </span>
                <span className="text-slate-400 font-mono ml-auto">VIX: {sentiment.vixLevel}</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {sentiment.keySummary}
              </p>
            </div>
          </div>

          {/* Asset Class Sentiment Matrix */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Cross-Asset Sentiment Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {sentiment.assets?.map((asset, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-200">
                      {asset.symbol}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                        asset.sentiment === 'Bullish'
                          ? 'text-emerald-400 bg-emerald-950/50'
                          : asset.sentiment === 'Bearish'
                          ? 'text-rose-400 bg-rose-950/50'
                          : 'text-amber-400 bg-amber-950/50'
                      }`}
                    >
                      {asset.sentiment}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate" title={asset.keyDriver}>
                    {asset.keyDriver}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Gauge,
  RefreshCw,
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
  const needleRotation = (score / 100) * 180 - 90;

  const getScoreColor = (val: number) => {
    if (val >= 60) return 'text-yellow-400';
    if (val >= 40) return 'text-neutral-300';
    return 'text-red-400';
  };

  return (
    <div
      id="market-sentiment-module"
      className="bg-black border border-yellow-500/30 p-4 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-yellow-500/20">
        <div className="flex items-center gap-2 font-mono">
          <Gauge className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            MARKET SENTIMENT
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAskJarvisSentiment}
            id="btn-voice-sentiment-summary"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-yellow-500/30 text-yellow-400 text-xs font-mono font-medium transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>VOICE SCAN</span>
          </button>
          <button
            onClick={onRefreshSentiment}
            disabled={isLoading}
            id="btn-refresh-sentiment"
            className="p-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-yellow-400 border border-neutral-800 transition-colors disabled:opacity-50"
            title="Refresh sentiment"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-yellow-400' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-neutral-400">Scanning market metrics...</p>
        </div>
      )}

      {!isLoading && sentiment && (
        <div className="mt-3 space-y-4">
          {/* Gauge & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-neutral-950 p-3 border border-neutral-900">
            {/* Needle gauge */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-32 h-16 overflow-hidden flex items-end justify-center">
                <div className="w-32 h-32 border-[10px] border-neutral-800 border-t-yellow-400 border-r-yellow-500 transform -rotate-45" />
                <div
                  className="absolute bottom-0 w-0.5 h-12 bg-white origin-bottom transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                />
                <div className="absolute bottom-0 w-3 h-3 bg-yellow-400 border-2 border-black" />
              </div>

              <div className="mt-1 text-center font-mono">
                <span className={`text-xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-xs text-neutral-500 ml-1">/ 100</span>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  {sentiment.overallLabel || 'Neutral'}
                </div>
              </div>
            </div>

            {/* Regime & VIX */}
            <div className="sm:col-span-7 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-neutral-500">REGIME:</span>
                <span className="px-2 py-0.5 font-bold text-xs bg-neutral-900 text-yellow-400 border border-yellow-500/30">
                  {sentiment.regime}
                </span>
                <span className="text-neutral-400 ml-auto">VIX: {sentiment.vixLevel}</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                {sentiment.keySummary}
              </p>
            </div>
          </div>

          {/* Asset Class Sentiment Matrix */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sentiment.assets?.map((asset, i) => (
                <div
                  key={i}
                  className="p-2 bg-neutral-950 border border-neutral-900 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-white">
                      {asset.symbol}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1 py-0.2 ${
                        asset.sentiment === 'Bullish'
                          ? 'text-yellow-400 bg-yellow-950/40 border border-yellow-500/30'
                          : asset.sentiment === 'Bearish'
                          ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                          : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
                      }`}
                    >
                      {asset.sentiment}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate font-sans">
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

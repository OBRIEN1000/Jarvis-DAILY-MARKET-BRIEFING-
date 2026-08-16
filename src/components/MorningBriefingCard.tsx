import React, { useState } from 'react';
import {
  Sun,
  Pause,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  Volume2,
} from 'lucide-react';
import { MorningBriefingData } from '../types';

interface MorningBriefingCardProps {
  briefing: MorningBriefingData | null;
  isLoading: boolean;
  isPlayingAudio: boolean;
  onPlayAudioBriefing: () => void;
  onRefreshBriefing: () => void;
}

export const MorningBriefingCard: React.FC<MorningBriefingCardProps> = ({
  briefing,
  isLoading,
  isPlayingAudio,
  onPlayAudioBriefing,
  onRefreshBriefing,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'movers' | 'macro'>('overview');

  return (
    <div
      id="morning-briefing-module"
      className="bg-black border border-yellow-500/30 p-4 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-yellow-500/20">
        <div className="flex items-center gap-2 font-mono">
          <Sun className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            MORNING BRIEFING
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayAudioBriefing}
            disabled={isLoading || !briefing}
            id="btn-play-morning-audio"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer border ${
              isPlayingAudio
                ? 'bg-yellow-400 text-black border-yellow-400 animate-pulse'
                : 'bg-neutral-900 hover:bg-yellow-400 hover:text-black border-yellow-500/40 text-yellow-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>PLAY AUDIO</span>
              </>
            )}
          </button>

          <button
            onClick={onRefreshBriefing}
            disabled={isLoading}
            id="btn-refresh-morning-briefing"
            className="p-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-yellow-400 border border-neutral-800 transition-colors disabled:opacity-50"
            title="Refresh briefing"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-yellow-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-neutral-400">
            Synthesizing market briefing...
          </p>
        </div>
      )}

      {/* Briefing Content */}
      {!isLoading && briefing && (
        <div className="mt-3 space-y-3">
          {/* Main Headline */}
          <div className="p-2.5 bg-neutral-950 border border-neutral-900">
            <p className="text-xs font-semibold text-white leading-snug font-sans">
              {briefing.headline}
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-neutral-900 pb-1.5 font-mono text-xs">
            {[
              { id: 'overview', label: 'Summary' },
              { id: 'movers', label: 'Movers' },
              { id: 'macro', label: 'Catalysts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                id={`tab-briefing-${tab.id}`}
                className={`px-2.5 py-1 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Executive Summary */}
          {activeTab === 'overview' && (
            <div className="space-y-1.5">
              {briefing.executiveSummary?.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-neutral-300 bg-neutral-950 p-2 border border-neutral-900"
                >
                  <span className="w-1.5 h-1.5 bg-yellow-400 mt-1 shrink-0" />
                  <span className="font-sans">{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Pre-Market Movers */}
          {activeTab === 'movers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {briefing.preMarketMovers?.map((mover, i) => (
                <div
                  key={i}
                  className="p-2 bg-neutral-950 border border-neutral-900 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">
                        {mover.symbol}
                      </span>
                      <span
                        className={`inline-flex items-center text-[10px] font-mono font-bold px-1 ${
                          mover.direction === 'UP'
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        {mover.direction === 'UP' ? (
                          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                        )}
                        {mover.change}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                      {mover.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Macro Catalysts */}
          {activeTab === 'macro' && (
            <div className="space-y-1.5">
              {briefing.macroCatalysts?.map((macro, i) => (
                <div
                  key={i}
                  className="p-2 bg-neutral-950 border border-neutral-900 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span className="text-white font-sans">{macro.event}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-neutral-400">{macro.timeOrExpectation}</span>
                    <span className="px-1 bg-neutral-900 border border-neutral-800 text-yellow-400 text-[10px] font-bold">
                      {macro.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

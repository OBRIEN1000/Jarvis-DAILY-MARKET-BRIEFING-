import React, { useState } from 'react';
import {
  Sun,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldAlert,
  Compass,
  ExternalLink,
  Volume2,
  CheckCircle2,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'movers' | 'macro' | 'setups'>('overview');

  return (
    <div
      id="morning-briefing-module"
      className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all p-5 backdrop-blur-md shadow-xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sun className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
                MORNING TRADER INTELLIGENCE
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                DAILY BRIEFING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {briefing?.generatedAt
                ? `Generated today at ${briefing.generatedAt} EST`
                : 'Real-time pre-market & global macro scan'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayAudioBriefing}
            disabled={isLoading || !briefing}
            id="btn-play-morning-audio"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE AUDIO</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>PLAY AUDIO BRIEFING</span>
              </>
            )}
          </button>

          <button
            onClick={onRefreshBriefing}
            disabled={isLoading}
            id="btn-refresh-morning-briefing"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all disabled:opacity-50"
            title="Refresh morning market intelligence with Google Search"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-sm font-mono text-slate-300">
            JARVIS is scanning Google Finance, pre-market futures, and earnings reports...
          </p>
          <span className="text-xs text-slate-500 font-mono">Synthesizing vocal market briefing</span>
        </div>
      )}

      {/* Briefing Content */}
      {!isLoading && briefing && (
        <div className="mt-4 space-y-4">
          {/* Main Thematic Headline */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
              SESSION THEME
            </span>
            <p className="text-sm font-semibold text-slate-100 leading-snug">
              {briefing.headline}
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
            {[
              { id: 'overview', label: 'Executive Summary', icon: CheckCircle2 },
              { id: 'movers', label: 'Pre-Market Movers', icon: TrendingUp },
              { id: 'macro', label: 'Macro Catalysts', icon: Calendar },
              { id: 'setups', label: 'Trade Ideation', icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  id={`tab-briefing-${tab.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Executive Summary */}
          {activeTab === 'overview' && (
            <div className="space-y-2.5">
              <ul className="space-y-2">
                {briefing.executiveSummary?.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 2: Pre-Market Movers */}
          {activeTab === 'movers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {briefing.preMarketMovers?.map((mover, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100 text-sm">
                        {mover.symbol}
                      </span>
                      <span
                        className={`inline-flex items-center text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          mover.direction === 'UP'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {mover.direction === 'UP' ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                        )}
                        {mover.change}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {mover.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Macro Catalysts */}
          {activeTab === 'macro' && (
            <div className="space-y-2">
              {briefing.macroCatalysts?.map((macro, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">{macro.event}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">{macro.timeOrExpectation}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        macro.impact === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {macro.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Trade Ideation */}
          {activeTab === 'setups' && (
            <div className="space-y-2.5">
              {briefing.tradeIdeation?.map((trade, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-100 text-sm">
                      {trade.symbol}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        trade.bias === 'Long'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : trade.bias === 'Short'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      BIAS: {trade.bias}
                    </span>
                  </div>
                  <p className="text-slate-300">{trade.setup}</p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Risk: {trade.riskFactor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grounding Sources */}
          {briefing.sources && briefing.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="font-mono text-slate-500">Google Grounding Sources:</span>
              {briefing.sources.slice(0, 3).map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 truncate max-w-[200px]"
                >
                  <span>{src.title || 'Source'}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

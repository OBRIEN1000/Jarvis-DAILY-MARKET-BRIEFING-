import React, { useState } from 'react';
import {
  ListFilter,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Volume2,
  Sparkles,
  Search,
  Tag,
  Target,
  Shield,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { WatchlistItem } from '../types';

interface WatchlistManagerProps {
  watchlist: WatchlistItem[];
  onAddTicker: (item: WatchlistItem) => void;
  onRemoveTicker: (symbol: string) => void;
  onUpdateTicker: (item: WatchlistItem) => void;
  onAskJarvisForTicker: (symbol: string) => void;
}

const PRESET_TICKERS = [
  { symbol: 'NVDA', name: 'Nvidia Corp', sentiment: 'Bullish', sentimentScore: 84 },
  { symbol: 'TSLA', name: 'Tesla Inc', sentiment: 'Volatile', sentimentScore: 56 },
  { symbol: 'AAPL', name: 'Apple Inc', sentiment: 'Bullish', sentimentScore: 72 },
  { symbol: 'BTC-USD', name: 'Bitcoin', sentiment: 'Bullish', sentimentScore: 78 },
  { symbol: 'SPY', name: 'S&P 500 ETF', sentiment: 'Bullish', sentimentScore: 65 },
  { symbol: 'QQQ', name: 'Invesco QQQ', sentiment: 'Bullish', sentimentScore: 70 },
  { symbol: 'PLTR', name: 'Palantir Tech', sentiment: 'Bullish', sentimentScore: 82 },
  { symbol: 'AMD', name: 'Adv Micro Dev', sentiment: 'Neutral', sentimentScore: 54 },
];

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlist,
  onAddTicker,
  onRemoveTicker,
  onUpdateTicker,
  onAskJarvisForTicker,
}) => {
  const [newSymbol, setNewSymbol] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<string>('');
  const [editStop, setEditStop] = useState<string>('');
  const [editThesis, setEditThesis] = useState<string>('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSymbol.trim().toUpperCase();
    if (!clean) return;

    if (watchlist.some((w) => w.symbol === clean)) {
      setNewSymbol('');
      setIsAdding(false);
      return;
    }

    const newItem: WatchlistItem = {
      symbol: clean,
      name: clean,
      sentiment: 'Neutral',
      sentimentScore: 50,
      thesis: 'Monitoring for breakout or key technical support test.',
      catalysts: ['Upcoming earnings / macro print'],
      lastUpdated: new Date().toISOString(),
    };

    onAddTicker(newItem);
    setNewSymbol('');
    setIsAdding(false);
  };

  const handleQuickAdd = (preset: typeof PRESET_TICKERS[0]) => {
    if (watchlist.some((w) => w.symbol === preset.symbol)) return;
    onAddTicker({
      symbol: preset.symbol,
      name: preset.name,
      sentiment: preset.sentiment as any,
      sentimentScore: preset.sentimentScore,
      thesis: `${preset.name} active momentum monitoring.`,
      catalysts: ['Earnings release', 'Sector volume flows'],
      lastUpdated: new Date().toISOString(),
    });
  };

  const startEdit = (item: WatchlistItem) => {
    setEditingSymbol(item.symbol);
    setEditTarget(item.targetPrice ? item.targetPrice.toString() : '');
    setEditStop(item.stopLoss ? item.stopLoss.toString() : '');
    setEditThesis(item.thesis || '');
  };

  const saveEdit = (item: WatchlistItem) => {
    onUpdateTicker({
      ...item,
      targetPrice: editTarget ? parseFloat(editTarget) : undefined,
      stopLoss: editStop ? parseFloat(editStop) : undefined,
      thesis: editThesis || item.thesis,
      lastUpdated: new Date().toISOString(),
    });
    setEditingSymbol(null);
  };

  return (
    <div
      id="trade-watchlist-module"
      className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all p-5 backdrop-blur-md shadow-xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-mono">
                PERSONALIZED TRADE WATCHLIST
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-teal-950/60 border border-teal-500/30 text-teal-300">
                {watchlist.length} ASSETS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live sentiment, price targets, and instant voice scanner
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          id="btn-add-watchlist-ticker"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TICKER</span>
        </button>
      </div>

      {/* Add New Ticker Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g. NVDA, TSLA, BTC-USD, SPY, ETH-USD..."
              autoFocus
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-confirm-add-ticker"
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Quick Add Presets Bar */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-[11px] text-slate-500 font-mono shrink-0">Presets:</span>
        {PRESET_TICKERS.map((preset) => {
          const isAdded = watchlist.some((w) => w.symbol === preset.symbol);
          return (
            <button
              key={preset.symbol}
              onClick={() => handleQuickAdd(preset)}
              disabled={isAdded}
              id={`preset-ticker-${preset.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono border transition-all shrink-0 ${
                isAdded
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-default'
                  : 'bg-slate-800/60 hover:bg-cyan-950/60 border-slate-700 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300'
              }`}
            >
              +{preset.symbol}
            </button>
          );
        })}
      </div>

      {/* Watchlist Grid */}
      <div className="mt-3 space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {watchlist.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl">
            No active tickers in your watchlist. Add symbols to receive tailored morning updates.
          </div>
        ) : (
          watchlist.map((item) => (
            <div
              key={item.symbol}
              id={`watchlist-card-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
              className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all text-xs space-y-2 group"
            >
              {/* Top Row: Symbol, Name, Sentiment, Quick Voice Action, Remove */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {item.symbol}
                  </span>
                  <span className="text-slate-400 font-sans text-xs hidden sm:inline">
                    {item.name !== item.symbol ? item.name : ''}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.sentiment === 'Bullish'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : item.sentiment === 'Bearish'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : item.sentiment === 'Volatile'
                        ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.sentiment} ({item.sentimentScore}/100)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAskJarvisForTicker(item.symbol)}
                    id={`btn-voice-scan-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold transition-all cursor-pointer"
                    title={`Ask Jarvis to analyze ${item.symbol}`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>JARVIS SCAN</span>
                  </button>

                  <button
                    onClick={() => (editingSymbol === item.symbol ? setEditingSymbol(null) : startEdit(item))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                    title="Edit trade thesis and target levels"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveTicker(item.symbol)}
                    id={`btn-remove-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editing Mode */}
              {editingSymbol === item.symbol ? (
                <div className="pt-2 border-t border-slate-800 space-y-2 bg-slate-900/60 p-2.5 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Target Price ($)</label>
                      <input
                        type="number"
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                        placeholder="e.g. 150.00"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Stop Loss ($)</label>
                      <input
                        type="number"
                        value={editStop}
                        onChange={(e) => setEditStop(e.target.value)}
                        placeholder="e.g. 132.00"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-mono">Trade Thesis / Catalyst</label>
                    <input
                      type="text"
                      value={editThesis}
                      onChange={(e) => setEditThesis(e.target.value)}
                      placeholder="e.g. Breakout above 50-day moving average"
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingSymbol(null)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(item)}
                      className="px-2.5 py-1 rounded bg-teal-500 text-slate-950 text-xs font-mono font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Static view */
                <div className="space-y-1">
                  {item.thesis && (
                    <p className="text-slate-300 font-sans text-xs">
                      {item.thesis}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                    {item.targetPrice && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Target className="w-3 h-3" />
                        Target: ${item.targetPrice}
                      </span>
                    )}
                    {item.stopLoss && (
                      <span className="flex items-center gap-1 text-rose-400">
                        <Shield className="w-3 h-3" />
                        Stop: ${item.stopLoss}
                      </span>
                    )}
                    {item.catalysts && item.catalysts.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Tag className="w-3 h-3 text-cyan-400" />
                        {item.catalysts[0]}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

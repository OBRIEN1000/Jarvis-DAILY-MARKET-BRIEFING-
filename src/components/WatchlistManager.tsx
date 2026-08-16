import React, { useState } from 'react';
import {
  ListFilter,
  Plus,
  Trash2,
  Volume2,
  Search,
  Tag,
  Target,
  Shield,
  Edit2,
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
  { symbol: 'PLTR', name: 'Palantir Tech', sentiment: 'Bullish', sentimentScore: 82 },
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
      thesis: 'Active monitoring for breakout or support test.',
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
      className="bg-black border border-yellow-500/30 p-4 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-yellow-500/20">
        <div className="flex items-center gap-2 font-mono">
          <ListFilter className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            WATCHLIST
          </h2>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-yellow-400">
            {watchlist.length}
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          id="btn-add-watchlist-ticker"
          className="flex items-center gap-1 px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-mono font-bold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD TICKER</span>
        </button>
      </div>

      {/* Add New Ticker Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="mt-2 p-2 bg-neutral-950 border border-yellow-500/30 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g. NVDA, TSLA, BTC-USD..."
              autoFocus
              className="w-full pl-8 pr-2 py-1 bg-black border border-neutral-800 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <button
            type="submit"
            id="btn-confirm-add-ticker"
            className="px-3 py-1 bg-yellow-400 text-black text-xs font-mono font-bold hover:bg-yellow-300"
          >
            ADD
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2 py-1 bg-neutral-900 text-neutral-400 text-xs font-mono hover:text-white"
          >
            ✕
          </button>
        </form>
      )}

      {/* Quick Add Presets Bar */}
      <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-[10px] text-neutral-500 shrink-0 uppercase">Presets:</span>
        {PRESET_TICKERS.map((preset) => {
          const isAdded = watchlist.some((w) => w.symbol === preset.symbol);
          return (
            <button
              key={preset.symbol}
              onClick={() => handleQuickAdd(preset)}
              disabled={isAdded}
              id={`preset-ticker-${preset.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
              className={`px-1.5 py-0.5 text-xs border transition-colors shrink-0 ${
                isAdded
                  ? 'bg-neutral-950 border-neutral-900 text-neutral-600 cursor-default'
                  : 'bg-neutral-900 hover:bg-yellow-400 hover:text-black border-neutral-800 text-neutral-300'
              }`}
            >
              +{preset.symbol}
            </button>
          );
        })}
      </div>

      {/* Watchlist Grid */}
      <div className="mt-2 space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {watchlist.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500 font-mono border border-dashed border-neutral-900">
            No active tickers in watchlist.
          </div>
        ) : (
          watchlist.map((item) => (
            <div
              key={item.symbol}
              id={`watchlist-card-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
              className="p-2.5 bg-neutral-950 border border-neutral-900 hover:border-yellow-500/30 transition-colors text-xs space-y-1.5"
            >
              {/* Row: Symbol, Sentiment, Scan, Delete */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-xs">
                    {item.symbol}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                      item.sentiment === 'Bullish'
                        ? 'text-yellow-400 bg-yellow-950/40 border border-yellow-500/30'
                        : item.sentiment === 'Bearish'
                        ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                        : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
                    }`}
                  >
                    {item.sentiment} ({item.sentimentScore})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAskJarvisForTicker(item.symbol)}
                    id={`btn-voice-scan-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
                    className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-yellow-500/30 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                    title={`Scan ${item.symbol}`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>SCAN</span>
                  </button>

                  <button
                    onClick={() => (editingSymbol === item.symbol ? setEditingSymbol(null) : startEdit(item))}
                    className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors"
                    title="Edit levels"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onRemoveTicker(item.symbol)}
                    id={`btn-remove-${item.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Editing Mode */}
              {editingSymbol === item.symbol ? (
                <div className="pt-2 border-t border-neutral-800 space-y-2 bg-black p-2 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Target ($)</label>
                      <input
                        type="number"
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                        placeholder="150.00"
                        className="w-full px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Stop ($)</label>
                      <input
                        type="number"
                        value={editStop}
                        onChange={(e) => setEditStop(e.target.value)}
                        placeholder="132.00"
                        className="w-full px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block">Thesis</label>
                    <input
                      type="text"
                      value={editThesis}
                      onChange={(e) => setEditThesis(e.target.value)}
                      placeholder="Breakout monitoring"
                      className="w-full px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-1 pt-1">
                    <button
                      onClick={() => setEditingSymbol(null)}
                      className="px-2 py-0.5 bg-neutral-900 text-neutral-400 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(item)}
                      className="px-2.5 py-0.5 bg-yellow-400 text-black text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Static view */
                <div className="space-y-1">
                  {item.thesis && (
                    <p className="text-neutral-300 font-sans text-xs">
                      {item.thesis}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-neutral-400 pt-0.5">
                    {item.targetPrice && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Target className="w-3 h-3" />
                        Target: ${item.targetPrice}
                      </span>
                    )}
                    {item.stopLoss && (
                      <span className="flex items-center gap-1 text-red-400">
                        <Shield className="w-3 h-3" />
                        Stop: ${item.stopLoss}
                      </span>
                    )}
                    {item.catalysts && item.catalysts.length > 0 && (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Tag className="w-3 h-3 text-yellow-400/80" />
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

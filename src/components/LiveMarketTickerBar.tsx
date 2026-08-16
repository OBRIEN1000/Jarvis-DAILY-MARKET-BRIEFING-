import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Radio } from 'lucide-react';

interface TickerQuote {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const DEFAULT_TICKERS: TickerQuote[] = [
  { symbol: 'SPX', name: 'S&P 500', price: '5,965.20', change: '+0.42%', isPositive: true },
  { symbol: 'QQQ', name: 'Nasdaq 100', price: '512.80', change: '+0.78%', isPositive: true },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$96,450', change: '+2.15%', isPositive: true },
  { symbol: 'US10Y', name: '10-Yr Yield', price: '4.29%', change: '-0.03%', isPositive: false },
  { symbol: 'GOLD', name: 'Gold Oz', price: '$2,740', change: '+0.31%', isPositive: true },
  { symbol: 'WTI', name: 'Crude Oil', price: '$71.20', change: '-0.68%', isPositive: false },
  { symbol: 'VIX', name: 'Volatility', price: '14.85', change: '-3.10%', isPositive: false },
];

interface LiveMarketTickerBarProps {
  onSelectTicker?: (symbol: string) => void;
}

export const LiveMarketTickerBar: React.FC<LiveMarketTickerBarProps> = ({ onSelectTicker }) => {
  const [time, setTime] = useState<string>('');
  const [marketStatus, setMarketStatus] = useState<string>('MARKET ACTIVE');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="market-ticker-bar"
      className="w-full bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-md px-3 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 select-none z-30"
    >
      {/* Left: JARVIS System Status & Market Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-cyan-400 tracking-wider">JARVIS // TRADING CORE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400/70" />
          <span>NYC:</span>
          <span className="text-slate-200 font-bold">{time || '09:30:00'} EST</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>GOOGLE FINANCE FEED</span>
        </div>
      </div>

      {/* Center/Right: Live Tickers Strip */}
      <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none font-mono">
        {DEFAULT_TICKERS.map((t) => (
          <button
            key={t.symbol}
            onClick={() => onSelectTicker && onSelectTicker(t.symbol)}
            id={`ticker-item-${t.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all text-left cursor-pointer group"
            title={`Ask Jarvis for live analysis on ${t.symbol}`}
          >
            <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
              {t.symbol}
            </span>
            <span className="text-slate-400">{t.price}</span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                t.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {t.isPositive ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
              )}
              {t.change}
            </span>
          </button>
        ))}
      </div>
    </header>
  );
};

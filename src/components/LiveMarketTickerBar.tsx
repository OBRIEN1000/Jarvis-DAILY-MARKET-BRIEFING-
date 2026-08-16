import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

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
      className="w-full bg-black border-b border-yellow-500/20 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-neutral-300 select-none z-30 font-mono"
    >
      {/* Left: Market Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-yellow-400 animate-pulse" />
          <span className="font-bold text-yellow-400 tracking-wider">JARVIS // TERMINAL</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-neutral-400">
          <Clock className="w-3.5 h-3.5 text-yellow-400/80" />
          <span>EST:</span>
          <span className="text-white font-bold">{time || '09:30:00'}</span>
        </div>
      </div>

      {/* Right: Live Tickers Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
        {DEFAULT_TICKERS.map((t) => (
          <button
            key={t.symbol}
            onClick={() => onSelectTicker && onSelectTicker(t.symbol)}
            id={`ticker-item-${t.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-950 hover:bg-yellow-400 hover:text-black border border-neutral-900 hover:border-yellow-400 transition-colors text-left cursor-pointer group"
          >
            <span className="font-bold text-neutral-200 group-hover:text-black">
              {t.symbol}
            </span>
            <span className="text-neutral-400 group-hover:text-black">{t.price}</span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                t.isPositive ? 'text-emerald-400 group-hover:text-black' : 'text-red-400 group-hover:text-black'
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

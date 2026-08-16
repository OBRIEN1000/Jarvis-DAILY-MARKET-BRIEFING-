export type JarvisVoiceTone = 'jarvis' | 'tactical' | 'institutional' | 'cryptotrader';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'muted';

export interface WatchlistItem {
  symbol: string;
  name: string;
  price?: number;
  changePercent?: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  sentimentScore: number; // 0 to 100
  targetPrice?: number;
  stopLoss?: number;
  thesis?: string;
  catalysts?: string[];
  lastUpdated?: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  time: string;
  url?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  impact: 'High' | 'Medium' | 'Low';
  relevantSymbols: string[];
}

export interface AssetSentiment {
  asset: string;
  symbol: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number; // -100 to +100
  keyDriver: string;
  change: string;
}

export interface MarketSentimentData {
  overallScore: number; // 0 to 100 (0=Extreme Fear, 100=Extreme Greed)
  overallLabel: string;
  regime: 'Risk-On' | 'Risk-Off' | 'Neutral' | 'High Volatility';
  vixLevel: string;
  keySummary: string;
  assets: AssetSentiment[];
  topNews: NewsItem[];
  lastUpdated: string;
}

export interface MorningBriefingData {
  date: string;
  headline: string;
  audioScript: string;
  executiveSummary: string[];
  macroCatalysts: {
    event: string;
    impact: string;
    timeOrExpectation: string;
  }[];
  preMarketMovers: {
    symbol: string;
    direction: 'UP' | 'DOWN';
    change: string;
    reason: string;
  }[];
  tradeIdeation: {
    symbol: string;
    bias: 'Long' | 'Short' | 'Watch';
    setup: string;
    riskFactor: string;
  }[];
  sources?: GroundingSource[];
  generatedAt: string;
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  audioBase64?: string;
  sources?: GroundingSource[];
  isMorningBriefing?: boolean;
}

export interface JarvisPreferences {
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  tone: JarvisVoiceTone;
  continuousListening: boolean;
  autoSpeakResponses: boolean;
  morningBriefingTime: string; // e.g. "08:00"
  speechRate: number; // 0.8 to 1.3
}

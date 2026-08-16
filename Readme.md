JARVIS Trading Copilot 🌟

Executive Summary

JARVIS Trading Copilot is a real-time market telemetry workstation designed to provide traders, investors, and analysts with instant financial intelligence.

Powered by Google Gemini models with live Google Search grounding, custom multi-persona text-to-speech (TTS), and a local quantitative scanning engine, JARVIS delivers macroeconomic briefings, ticker-level technical deep dives, institutional sentiment metrics, and automated risk parameters through a responsive, cyber-tactical interface.

Key Features

Institutional Voice AI Copilot — JARVIS

- Conversational voice and text interface powered by Gemini.
- Multiple voice personality profiles:
  - JARVIS Protocol
  - Tactical Officer
  - Chief Investment Officer
  - Crypto Alpha Trader
- In-memory audio caching for low-latency verbal reporting.
- Intelligent Web Speech API fallback for improved browser compatibility.

Quantitative Ticker Analysis & Scanners

Instant technical and fundamental deep dives for US equities, ETFs, and digital assets, including:

"NVDA" · "TSLA" · "AAPL" · "PLTR" · "BTC-USD" · "ETH-USD" · "SPY" · "QQQ"

The quantitative engine automatically evaluates:

- Exponential Moving Average (EMA) support shelves
- Overhead breakout resistance bands
- 14-period RSI momentum
- Institutional volume profiling
- Primary and extended profit targets
- Stop-loss parameters
- Risk-to-reward ratios

Macro Market Sentiment & Fear & Greed Radar

JARVIS provides a real-time view of the broader market environment through:

- Aggregate market sentiment scoring from 0–100
- Market regime classification:
  - Risk-On
  - Risk-Off
  - Neutral
  - High Volatility
- CBOE VIX monitoring
- 10-Year US Treasury Yield tracking
- Crude oil and gold market monitoring
- Curated, impact-rated financial news
- Live source attribution

Automated Pre-Market & Morning Briefings

Prepare for the trading session with automated briefings covering:

- Pre-market futures
- Economic calendar catalysts
- Earnings schedules
- Sector leadership rotations
- Key market-moving events

A one-click audio playback system enables hands-free market preparation.

Active Watchlist Management

Manage assets and positions through a dynamic watchlist with:

- Custom position tracking
- Automated background technical scanning
- Real-time market posture assessment
- Asset allocation synchronization

Tech Stack

Layer| Technology
Frontend| React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
Backend| Node.js, Express
Build System| esbuild
AI & Intelligence| Google GenAI SDK ("@google/genai"), Gemini 2.5 Flash / Flash Lite
Search & Grounding| Google Search Grounding
Voice & Audio| Gemini TTS, Web Audio PCM 24kHz Decoder
Fallback TTS| Browser SpeechSynthesis API
Architecture| Server-side proxying for API keys and LLM interactions

Architecture

JARVIS follows a server-side architecture designed to keep API credentials secure while providing a responsive market intelligence experience.

┌───────────────────────────────┐
│       JARVIS Frontend         │
│ React + TypeScript + Tailwind │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Express Backend         │
│      Server-side Proxy        │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌───────────────┐
│ Google Gemini│  │ Market / Web  │
│ AI + TTS     │  │ Intelligence  │
└──────────────┘  └───────────────┘

Getting Started

Prerequisites

Before running JARVIS Trading Copilot, make sure you have:

- Node.js v18 or higher
- A Gemini API key from Google AI Studio

Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/jarvis-trading-copilot.git
cd jarvis-trading-copilot

Install the dependencies:

npm install

Environment Configuration

Create your environment file:

cp .env.example .env

Add your Gemini API key:

GEMINI_API_KEY=your_api_key_here

Launch the Development Server

Start the application:

npm run dev

Then open:

http://localhost:3000

Disclaimer

JARVIS Trading Copilot is designed as a market intelligence and analytical workstation. Its technical indicators, sentiment metrics, market summaries, and risk parameters are provided for informational and analytical purposes and should not be considered financial advice or a guarantee of trading performance.

Roadmap

Potential future enhancements include:

- Advanced portfolio optimization
- Backtesting engine
- Options flow analysis
- Institutional order-flow intelligence
- Advanced volatility modeling
- Multi-market support
- Custom trading strategies
- Automated alert systems
- Expanded voice command capabilities
- Personalized AI trading workflows

---

JARVIS Trading Copilot — Real-Time Financial Intelligence.
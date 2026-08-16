import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ExternalLink,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { VoiceMessage } from '../types';

interface VoiceChatLogProps {
  messages: VoiceMessage[];
  isProcessing: boolean;
  onSendMessage: (text: string) => void;
  onReplayAudio: (msg: VoiceMessage) => void;
  onClearMessages: () => void;
}

export const VoiceChatLog: React.FC<VoiceChatLogProps> = ({
  messages,
  isProcessing,
  onSendMessage,
  onReplayAudio,
  onClearMessages,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="voice-chat-transcript-log"
      className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all p-5 backdrop-blur-md shadow-xl flex flex-col h-[520px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono">
              JARVIS AUDIO LOG & TRANSCRIPTS
            </h2>
            <p className="text-xs text-slate-400">
              Live verbal exchange with Google Search grounding
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearMessages}
            id="btn-clear-chat-log"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 font-mono text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
            <Bot className="w-8 h-8 text-cyan-500/40" />
            <p className="max-w-xs">
              Voice mode is primed. Speak aloud or click any quick command to converse with JARVIS.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              className={`flex flex-col space-y-1 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender info & timestamp */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                {msg.sender === 'jarvis' ? (
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Sparkles className="w-3 h-3" />
                    JARVIS AI
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <User className="w-3 h-3" />
                    TRADER (YOU)
                  </span>
                )}
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed transition-all ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tr-none'
                    : 'bg-slate-950/80 text-cyan-100 border border-cyan-500/30 rounded-tl-none shadow-sm shadow-cyan-500/10'
                }`}
              >
                <p className="whitespace-pre-wrap font-sans text-sm">{msg.text}</p>

                {/* Sources / Grounding links */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-mono">Sources:</span>
                    {msg.sources.slice(0, 3).map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline truncate max-w-[160px]"
                      >
                        <span>{src.title || 'Google Finance'}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Quick actions: Replay Audio & Copy */}
                {msg.sender === 'jarvis' && (
                  <div className="mt-2 flex items-center justify-end gap-1 text-[11px] opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onReplayAudio(msg)}
                      id={`btn-replay-audio-${msg.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 transition-all font-mono"
                      title="Play JARVIS voice audio for this message"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>JARVIS is querying real-time market data & preparing voice report...</span>
          </div>
        )}

        <div ref={scrollBottomRef} />
      </div>

      {/* Manual Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type market question or trade command for Jarvis..."
          disabled={isProcessing}
          id="input-manual-chat-command"
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          id="btn-send-manual-chat"
          className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-all cursor-pointer"
          title="Send command"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

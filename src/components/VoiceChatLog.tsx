import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  Send,
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
      className="bg-black border border-yellow-500/30 flex flex-col h-[520px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-500/20 bg-neutral-950">
        <div className="flex items-center gap-2 font-mono">
          <MessageSquare className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-bold text-white tracking-wider uppercase">
            COMMUNICATION LOG
          </h2>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearMessages}
            id="btn-clear-chat-log"
            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-mono text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2">
            <Bot className="w-7 h-7 text-yellow-500/40" />
            <p className="max-w-xs text-xs">
              Directives active. Speak or type to interact.
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
              {/* Sender & Timestamp */}
              <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                {msg.sender === 'jarvis' ? (
                  <span className="text-yellow-400 font-bold">JARVIS</span>
                ) : (
                  <span className="text-emerald-400 font-bold">TRADER</span>
                )}
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3 max-w-[90%] text-xs leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-neutral-900 text-neutral-100 border-neutral-800'
                    : 'bg-neutral-950 text-yellow-100 border-yellow-500/30'
                }`}
              >
                <p className="whitespace-pre-wrap font-sans text-sm">{msg.text}</p>

                {/* Sources / Grounding links */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-yellow-500/20 flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="text-yellow-400 font-mono">Sources:</span>
                    {msg.sources.slice(0, 3).map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-yellow-300 hover:underline truncate max-w-[160px]"
                      >
                        <span>{src.title || 'Source'}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Quick actions: Replay Audio & Copy */}
                {msg.sender === 'jarvis' && (
                  <div className="mt-2 flex items-center justify-end gap-2 text-[11px]">
                    <button
                      onClick={() => onReplayAudio(msg)}
                      id={`btn-replay-audio-${msg.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-yellow-500/30 text-yellow-400 transition-colors font-mono text-[10px]"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>REPLAY</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors"
                      title="Copy text"
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
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono bg-neutral-950 p-2.5 border border-yellow-500/20 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span>JARVIS is scanning markets & preparing response...</span>
          </div>
        )}

        <div ref={scrollBottomRef} />
      </div>

      {/* Manual Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-yellow-500/20 bg-neutral-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command or query..."
          disabled={isProcessing}
          id="input-manual-chat-command"
          className="flex-1 px-3 py-1.5 bg-black border border-neutral-800 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-yellow-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          id="btn-send-manual-chat"
          className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 text-black disabled:text-neutral-600 font-mono text-xs font-bold transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

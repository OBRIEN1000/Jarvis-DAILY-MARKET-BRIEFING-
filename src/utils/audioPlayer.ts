/**
 * Audio playback and speech synthesis manager for JARVIS Voice AI.
 */

let globalAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let analyzerNode: AnalyserNode | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

export function getAudioAnalyzer(): AnalyserNode | null {
  return analyzerNode;
}

/**
 * Decode 16-bit PCM raw base64 data to an AudioBuffer at 24kHz
 */
export function pcmBase64ToAudioBuffer(base64: string, sampleRate = 24000): AudioBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // 16-bit PCM little endian
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);

  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  const ctx = getAudioContext();
  const audioBuffer = ctx.createBuffer(1, float32Array.length, sampleRate);
  audioBuffer.copyToChannel(float32Array, 0);

  return audioBuffer;
}

/**
 * Play PCM audio with live frequency analyzer node
 */
export async function playPcmAudio(
  base64Audio: string,
  onEnded?: () => void
): Promise<{ stop: () => void }> {
  stopCurrentAudio();

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  try {
    const buffer = pcmBase64ToAudioBuffer(base64Audio, 24000);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Analyzer for visualizer
    if (!analyzerNode) {
      analyzerNode = ctx.createAnalyser();
      analyzerNode.fftSize = 64;
      analyzerNode.smoothingTimeConstant = 0.8;
    }

    source.connect(analyzerNode);
    analyzerNode.connect(ctx.destination);

    currentSourceNode = source;

    source.onended = () => {
      if (currentSourceNode === source) {
        currentSourceNode = null;
      }
      if (onEnded) onEnded();
    };

    source.start(0);

    return {
      stop: () => {
        try {
          source.stop();
        } catch {
          // ignore if already stopped
        }
        if (currentSourceNode === source) {
          currentSourceNode = null;
        }
      },
    };
  } catch (err) {
    console.error('Error playing PCM audio buffer:', err);
    if (onEnded) onEnded();
    return { stop: () => {} };
  }
}

/**
 * Fallback Web Speech Synthesis with British / Jarvis persona
 */
export function playWebSpeechSynthesis(
  text: string,
  options?: { rate?: number; pitch?: number; voiceName?: string },
  onEnded?: () => void
): { stop: () => void } {
  stopCurrentAudio();

  if (!('speechSynthesis' in window)) {
    if (onEnded) onEnded();
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel();

  // Strip markdown, asterisks, brackets for clean voice speech
  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options?.rate || 1.05;
  utterance.pitch = options?.pitch || 0.95;

  const voices = window.speechSynthesis.getVoices();
  // Find a good British or English voice
  const preferredVoice =
    voices.find((v) => v.lang === 'en-GB' || v.name.includes('British') || v.name.includes('UK') || v.name.includes('Daniel') || v.name.includes('Oliver')) ||
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male'))) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onend = () => {
    if (onEnded) onEnded();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    if (onEnded) onEnded();
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
    },
  };
}

/**
 * Stop any currently playing audio (Gemini PCM or Web Speech)
 */
export function stopCurrentAudio() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {
      // ignore
    }
    currentSourceNode = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

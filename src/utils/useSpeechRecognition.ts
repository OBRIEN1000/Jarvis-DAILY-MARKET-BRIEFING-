import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onInterimResult?: (transcript: string) => void;
  onError?: (error: any) => void;
}

export function useSpeechRecognition({
  continuous = true,
  onResult,
  onInterimResult,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);
  const onErrorRef = useRef(onError);

  onResultRef.current = onResult;
  onInterimResultRef.current = onInterimResult;
  onErrorRef.current = onError;

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
        setHasPermission(true);
      };

      recognition.onresult = (event: any) => {
        let currentFinal = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinal += res[0].transcript;
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
          if (onInterimResultRef.current) {
            onInterimResultRef.current(currentInterim);
          }
        }

        if (currentFinal.trim()) {
          const finalClean = currentFinal.trim();
          setTranscript(finalClean);
          setInterimTranscript('');
          if (onResultRef.current) {
            onResultRef.current(finalClean);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setHasPermission(false);
        }
        if (onErrorRef.current) {
          onErrorRef.current(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If continuous mode is enabled and user didn't manually stop, auto-restart
        if (continuous && !isManuallyStoppedRef.current) {
          setTimeout(() => {
            if (!isManuallyStoppedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignore if already started
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize SpeechRecognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [continuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    isManuallyStoppedRef.current = false;
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // Ignore if already started
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    hasPermission,
    startListening,
    stopListening,
    toggleListening,
    setTranscript,
  };
}

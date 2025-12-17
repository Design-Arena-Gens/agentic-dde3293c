'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          processVoiceInput(speechResult);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);

    const newHistory = [...conversationHistory, { role: 'user', content: input }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, history: conversationHistory }),
      });

      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
        setConversationHistory([...newHistory, { role: 'assistant', content: data.response }]);
        speak(data.response);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMsg = 'Sorry, I encountered an error. Please try again.';
      setResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setTranscript('');
    setResponse('');
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">Hudson Heights Bistro</h1>
            <p className="text-xl text-purple-200">AI Voice Assistant</p>
            <p className="text-sm text-purple-300 mt-2">Premium Fine Dining in New York City</p>
          </div>

          {/* Main Voice Interface */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-6">
            <div className="text-center mb-8">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || isSpeaking}
                className={`relative w-40 h-40 rounded-full transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
                    : isProcessing || isSpeaking
                    ? 'bg-yellow-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
                } shadow-2xl`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isListening ? (
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : isProcessing ? (
                    <svg className="w-20 h-20 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
              <p className="mt-6 text-white text-lg font-medium">
                {isListening
                  ? 'Listening...'
                  : isProcessing
                  ? 'Processing...'
                  : isSpeaking
                  ? 'Speaking...'
                  : 'Click to speak'}
              </p>
            </div>

            {/* Transcript and Response */}
            {transcript && (
              <div className="mb-6 p-4 bg-blue-500/20 rounded-xl border border-blue-300/30">
                <p className="text-sm text-blue-200 mb-1">You said:</p>
                <p className="text-white text-lg">{transcript}</p>
              </div>
            )}

            {response && (
              <div className="mb-6 p-4 bg-purple-500/20 rounded-xl border border-purple-300/30">
                <p className="text-sm text-purple-200 mb-1">Assistant:</p>
                <p className="text-white text-lg">{response}</p>
              </div>
            )}

            {/* Conversation History */}
            {conversationHistory.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">Conversation History</h3>
                  <button
                    onClick={clearConversation}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conversationHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500/20 border border-blue-300/30'
                          : 'bg-purple-500/20 border border-purple-300/30'
                      }`}
                    >
                      <p className="text-xs text-white/60 mb-1">
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </p>
                      <p className="text-white text-sm">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-white font-semibold mb-2">Reservations</h3>
              <p className="text-purple-200 text-sm">Book tables, modify or cancel reservations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🍽️</div>
              <h3 className="text-white font-semibold mb-2">Menu Info</h3>
              <p className="text-purple-200 text-sm">Ask about dishes, ingredients, and specials</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">📍</div>
              <h3 className="text-white font-semibold mb-2">Information</h3>
              <p className="text-purple-200 text-sm">Hours, location, parking, and directions</p>
            </div>
          </div>

          {/* Info */}
          <div className="text-center text-purple-300 text-sm">
            <p>🎤 Click the microphone to start speaking</p>
            <p className="mt-1">Powered by AI • Voice Recognition Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

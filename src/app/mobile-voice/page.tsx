'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, Phone, PhoneOff, Volume2, MessageSquare, Settings } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type CallState = 'ringing' | 'active' | 'idle' | 'ended';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface PendingAction {
  tool: string;
  params: any;
  confirmation_message: string;
}

export default function MobileVoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callState, setCallState] = useState<CallState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en');
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<Window['speechSynthesis'] | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-start call if ?call=true in URL (from PWA shortcut / contact)
  useEffect(() => {
    const shouldCall = searchParams.get('call');
    if (shouldCall === 'true') {
      startCall();
    }
  }, [searchParams]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Call duration timer
  useEffect(() => {
    if (callState === 'active') {
      callTimerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ====== SPEECH RECOGNITION ======
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'en' ? 'en-IN' : `${language}-IN`;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        handleUserMessage(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart if call is still active
      if (callState === 'active') {
        setTimeout(() => startListening(), 300);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, callState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // ====== SPEECH SYNTHESIS ======
  const speak = useCallback((text: string, lang?: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || `${language}-IN`;
    utterance.rate = 0.9; // Slightly slower for elderly users
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find an Indian voice
    const voices = synthRef.current.getVoices();
    const indianVoice = voices.find(
      (v) => v.lang.startsWith(language) || v.lang.includes('IN')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Resume listening after speaking
      if (callState === 'active') {
        setTimeout(() => startListening(), 500);
      }
    };

    synthRef.current.speak(utterance);
  }, [language, callState, startListening]);

  // ====== API CALL ======
  const handleUserMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    stopListening();

    // Check for confirmation response
    if (pendingAction) {
      const normalized = text.toLowerCase().trim();
      const isYes = ['yes', 'yeah', 'sure', 'ok', 'okay', 'confirm', 'haan', 'hmm', 'sari'].some(w => normalized.includes(w));
      const isNo = ['no', 'cancel', 'stop', 'na', 'nahi', 'illai', 'illaiya'].some(w => normalized.includes(w));

      if (isYes) {
        // Execute the confirmed action
        speak('Confirmed. Executing now.', language ? `${language}-IN` : undefined);
        await executeConfirmedAction(pendingAction);
        setPendingAction(null);
        setTimeout(() => startListening(), 2000);
        return;
      } else if (isNo) {
        speak('Cancelled. How else can I help you?', language ? `${language}-IN` : undefined);
        setPendingAction(null);
        setTimeout(() => startListening(), 2000);
        return;
      }
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentTranscript('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('looca_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/voice/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          language,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) throw new Error('Voice chat failed');

      const data = await response.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      if (data.language_detected) {
        setLanguage(data.language_detected);
      }

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Speak the reply
      speak(data.reply, data.language_detected ? `${data.language_detected}-IN` : undefined);

      // Handle actions
      if (data.action) {
        // Check if action needs confirmation
        if (data.action.status === 'awaiting_confirmation') {
          setPendingAction({
            tool: data.action.tool,
            params: data.action.params,
            confirmation_message: data.action.confirmation_message || 'Should I proceed?',
          });
          // Prompt user to confirm
          setTimeout(() => {
            speak(data.action.confirmation_message + ' Say yes to confirm or no to cancel.', 
                  data.language_detected ? `${data.language_detected}-IN` : undefined);
          }, 1000);
        } else {
          handleAction(data.action);
        }
      }
    } catch (error) {
      console.error('Voice chat error:', error);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      speak("I'm having trouble connecting right now. Please try again.");
    }
  }, [conversationId, language, stopListening, speak, pendingAction]);

  // ====== ACTION HANDLER ======
  const handleAction = (action: { tool: string; params: any; status: string }) => {
    switch (action.tool) {
      case 'book_appointment':
        // In production, this would call the browser service
        console.log('Booking appointment:', action.params);
        speak('Opening appointment booking page.', language ? `${language}-IN` : undefined);
        break;
      case 'send_whatsapp':
        // Open WhatsApp with pre-filled message
        const msg = encodeURIComponent(action.params.whatsapp_url || action.params.message || '');
        window.open(`https://wa.me/?text=${msg}`, '_blank');
        speak('Opening WhatsApp to send your message.', language ? `${language}-IN` : undefined);
        break;
      case 'open_website':
        window.open(action.params.url || action.params, '_blank');
        break;
      case 'make_call':
        window.open(`tel:${action.params.tel_url || action.params.phone || action.params}`, '_self');
        break;
      case 'search_buses':
        // Display bus results in chat
        if (action.params.buses && action.params.buses.length > 0) {
          const busInfo = action.params.buses.slice(0, 3).map((b: any) => 
            `${b.name} - ${b.departure} to ${b.arrival}, ₹${b.price}`
          ).join('. ');
          const infoMsg: ChatMessage = {
            role: 'assistant',
            content: `Available buses: ${busInfo}`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, infoMsg]);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // ====== EXECUTE CONFIRMED ACTION ======
  const executeConfirmedAction = async (action: PendingAction) => {
    // Call API to confirm and execute the action
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('looca_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/voice/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: `[CONFIRM_ACTION] ${action.tool} ${JSON.stringify(action.params)}`,
          language,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) throw new Error('Action confirmation failed');

      const data = await response.json();

      const confirmMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
      speak(data.reply, data.language_detected ? `${data.language_detected}-IN` : undefined);

      // Handle any resulting action
      if (data.action) {
        handleAction(data.action);
      }
    } catch (error) {
      console.error('Action execution error:', error);
      speak('Sorry, I could not complete that action. Please try again.', 
            language ? `${language}-IN` : undefined);
    }
  };

  // ====== CALL MANAGEMENT ======
  const startCall = () => {
    setCallState('ringing');
    setTimeout(() => {
      setCallState('active');
      // Greeting
      const greeting: ChatMessage = {
        role: 'assistant',
        content: 'Hello! This is Looca. How can I help you today?',
        timestamp: Date.now(),
      };
      setMessages([greeting]);
      speak('Hello! This is Looca. How can I help you today?', 'en-IN');
      // Start listening after greeting
      setTimeout(() => startListening(), 3000);
    }, 1500);
  };

  const endCall = () => {
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
    setCallState('ended');
    setIsListening(false);
    setIsSpeaking(false);
    setCallDuration(0);
  };

  const resetCall = () => {
    setCallState('idle');
    setMessages([]);
    setConversationId(null);
    setCurrentTranscript('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Image src="/l.png" alt="Looca" width={36} height={36} className="rounded-full" />
          <div>
            <h1 className="text-base font-bold">Looca</h1>
            <p className="text-xs text-zinc-400">
              {callState === 'idle' && 'Tap to call'}
              {callState === 'ringing' && 'Calling...'}
              {callState === 'active' && `Active • ${formatDuration(callDuration)}`}
              {callState === 'ended' && 'Call ended'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {callState === 'active' && (
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Idle State — Call Button */}
        {callState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Image src="/l.png" alt="Looca" width={120} height={120} className="rounded-3xl mx-auto shadow-2xl shadow-white/10" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Call Looca</h2>
            <p className="text-zinc-400 mb-8 text-sm max-w-xs mx-auto">
              Talk to Looca like you talk to a person. Ask in your own language — Tamil, Hindi, Telugu, and more.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center mx-auto shadow-lg shadow-green-500/30"
            >
              <Phone className="w-8 h-8 text-white" />
            </motion.button>
            <p className="text-zinc-500 text-xs mt-4">Tap to start a voice call</p>
          </motion.div>
        )}

        {/* Ringing State */}
        {callState === 'ringing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                  style={{ width: 120, height: 120, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
              ))}
              <Image src="/l.png" alt="Looca" width={80} height={80} className="rounded-2xl mx-auto relative z-10" />
            </div>
            <h3 className="text-lg font-semibold mt-6">Calling Looca...</h3>
            <p className="text-zinc-400 text-sm">Ringing</p>
          </motion.div>
        )}

        {/* Active Call State */}
        {callState === 'active' && (
          <div className="flex-1 w-full flex flex-col">
            {/* Voice Orb */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative">
                {/* Pulse rings */}
                {isSpeaking && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute inset-0 rounded-full bg-blue-400/20"
                        style={{ width: 160, height: 160, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      />
                    ))}
                  </>
                )}
                {isListening && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        className="absolute inset-0 rounded-full bg-green-400/20"
                        style={{ width: 160, height: 160, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      />
                    ))}
                  </>
                )}
                <motion.div
                  animate={{
                    scale: isSpeaking ? [1, 1.1, 1] : isListening ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: isSpeaking || isListening ? Infinity : 0 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center relative z-10 border-2 border-zinc-600"
                >
                  <Image src="/l.png" alt="Looca" width={48} height={48} className="rounded-full" />
                </motion.div>
              </div>

              {/* Status */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                {pendingAction ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-3 mx-4 mb-2"
                  >
                    <p className="text-sm font-semibold text-yellow-400">Awaiting Confirmation</p>
                    <p className="text-xs text-yellow-300/80 mt-1">{pendingAction.confirmation_message}</p>
                    <p className="text-xs text-yellow-200/60 mt-1">Say "yes" to confirm or "no" to cancel</p>
                  </motion.div>
                ) : (
                  <p className="text-sm font-medium">
                    {isSpeaking && 'Looca is speaking...'}
                    {isListening && 'Listening...'}
                    {!isSpeaking && !isListening && 'Looca is ready'}
                  </p>
                )}
                {currentTranscript && (
                  <p className="text-xs text-zinc-400 mt-1 px-8 truncate">{currentTranscript}</p>
                )}
                <p className="text-xs text-zinc-500 mt-1">{formatDuration(callDuration)}</p>
              </div>
            </div>

            {/* Chat Panel (toggleable) */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: '40%', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-800 bg-zinc-950 overflow-y-auto"
                >
                  <div className="p-4 space-y-3">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-zinc-800 text-zinc-200 rounded-bl-md'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-6 py-6 bg-zinc-950 border-t border-zinc-800">
              <button
                onClick={() => {
                  if (isListening) stopListening();
                  else startListening();
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-green-500 hover:bg-green-400'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  if (synthRef.current) {
                    synthRef.current.cancel();
                  }
                  setIsSpeaking(false);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'bg-blue-500 hover:bg-blue-400'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Call Ended State */}
        {callState === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center px-6"
          >
            <Image src="/l.png" alt="Looca" width={80} height={80} className="rounded-2xl mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-1">Call Ended</h3>
            <p className="text-zinc-400 text-sm mb-2">Duration: {formatDuration(callDuration)}</p>
            {messages.length > 0 && (
              <p className="text-zinc-500 text-xs mb-8">
                {messages.filter((m) => m.role === 'user').length} messages exchanged
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCall}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center"
              >
                <Phone className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="h-14 px-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2 text-sm"
              >
                Dashboard
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

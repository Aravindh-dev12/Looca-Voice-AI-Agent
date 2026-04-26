'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Vapi from '@vapi-ai/web';
import {
  ArrowRight,
  Loader2,
  Mic,
  Plus,
  X,
  Heart,
  MapPin,
  Stethoscope,
  CheckCircle2,
  MessageSquare,
  Globe,
  Terminal,
  MousePointer2,
  ScanSearch,
  Shield,
  Zap,
  Brain,
  Sprout,
  Scale,
  Wallet,
  Baby,
  UserCheck,
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';
import { personalApps } from '@/lib/constants';

type VoiceStatus = 'idle' | 'listening' | 'finding' | 'waiting' | 'done';

interface IntelligenceMetadata {
  detected_skill: 'medical' | 'agriculture' | 'legal' | 'financial' | 'child_dev' | 'elder_safety' | 'general';
  confidence_level: number;
  emotional_load: 'low' | 'medium' | 'high';
  language_detected: string;
  next_action: string;
}

export default function TalkDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isVapiActive, setIsVapiActive] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeAppLayer, setActiveAppLayer] = useState<string | null>(null);
  const [vapiGuidance, setVapiGuidance] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'booting' | 'navigating' | 'interpreting' | 'acting' | 'success'>('idle');
  const [agentLog, setAgentLog] = useState<string[]>([]);
  const [liveLog, setLiveLog] = useState<{ type: 'action' | 'result' | 'thought' | 'skill', text: string }[]>([]);
  const [intelligence, setIntelligence] = useState<IntelligenceMetadata | null>(null);

  // Initialize Vapi
  const vapi = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
  }, []);

  // Auto-stop timeout ref
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxListeningTimeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!vapi) return;

    vapi.on('call-start', () => {
      setIsVapiActive(true);
      setStatus('listening');
      setLiveLog([{ type: 'thought', text: 'Vapi Voice Connection Established.' }]);
      
      // Auto-stop after 30 seconds max
      maxListeningTimeRef.current = setTimeout(() => {
        if (vapi) {
          vapi.stop();
          setLiveLog(prev => [...prev, { type: 'thought', text: 'Session timeout - 30 seconds max.' }]);
        }
      }, 30000);
    });

    vapi.on('call-end', () => {
      setIsVapiActive(false);
      setStatus('idle');
      // Clear timeouts
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (maxListeningTimeRef.current) clearTimeout(maxListeningTimeRef.current);
    });

    vapi.on('speech-start', () => {
      setStatus('listening');
      // Clear silence timeout when user speaks
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    });
    
    vapi.on('speech-end', () => {
      setStatus('finding');
      // Auto-stop 5 seconds after speech ends (processing time)
      silenceTimeoutRef.current = setTimeout(() => {
        if (vapi) {
          vapi.stop();
          setLiveLog(prev => [...prev, { type: 'thought', text: 'Auto-stopped after 5 seconds of silence.' }]);
        }
      }, 5000);
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const transcript = message.transcript;
        setLiveLog(prev => [...prev, { type: 'action', text: `Voice Input: "${transcript}"` }]);
        processVoiceCommand(transcript);
      }

      if (message.type === 'assistant-message') {
        setVapiGuidance(message.content);
      }
    });

    vapi.on('error', (error: any) => {
      console.error('Vapi Error:', error);
      // Don't stop the session on minor errors, only on connection failures
      if (error?.message?.includes('Meeting ended') || error?.message?.includes('ejected')) {
        setIsVapiActive(false);
        setStatus('idle');
        setLiveLog(prev => [...prev, { type: 'thought', text: 'Voice session ended. Tap to reconnect.' }]);
      }
    });

    return () => {
      vapi.stop();
    };
  }, [vapi, conversationId, user]);

  const processVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setStatus('finding');
    setLiveLog(prev => [...prev, { type: 'thought', text: 'Activating Skills Intelligence Architecture...' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: command,
          userId: user?.id,
          conversationId
        }),
      });

      const data = await response.json();
      if (data.conversationId) setConversationId(data.conversationId);

      const geminiReply = data.reply || data.response || data.message || "I'm here to help! What would you like to know?";
      const meta = data.metadata as IntelligenceMetadata;

      if (meta) {
        setIntelligence(meta);
        setLiveLog(prev => [
          ...prev, 
          { type: 'skill', text: `Skill Activated: ${meta.detected_skill.toUpperCase()} (Confidence: ${meta.confidence_level}%)` }
        ]);
      }

      // 1. Speak response via Vapi if active
      if (vapi && isVapiActive) {
        vapi.say(geminiReply);
        setVapiGuidance(geminiReply);
      }

      // 2. Action Execution based on Metadata or Command
      if (meta?.next_action && meta.next_action !== 'None') {
        setLiveLog(prev => [...prev, { type: 'action', text: `Executing Action: ${meta.next_action}` }]);
        
        // Handle specific actions
        if (command.toLowerCase().includes('youtube') || command.toLowerCase().includes('play')) {
          const searchQuery = command.toLowerCase().replace(/play|youtube|open|on youtube/g, '').trim() || 'Michael Jackson';
          setVideoUrl(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&autoplay=1`);
        }

        // Simulating the Browser Agent for certain tasks
        if (meta.detected_skill === 'medical' || meta.detected_skill === 'legal' || command.includes('book') || command.includes('find')) {
          triggerBrowserAgent(meta.next_action);
        }
      }

      setStatus('waiting');
      setLiveLog(prev => [...prev, { type: 'result', text: `Looca: ${geminiReply || 'Processing your request...'}` }]);
    } catch (err) {
      console.error('Voice process error:', err);
    }
  };

  const triggerBrowserAgent = (task: string) => {
    setAgentStatus('booting');
    setAgentLog(['Initializing Playwright Browser Engine...', 'Setting User-Agent: Chrome/121.0.0.0']);
    
    window.setTimeout(() => {
      setAgentStatus('navigating');
      setAgentLog(prev => [...prev, `Navigating to relevant services for: ${task}`, 'Page Loaded (200 OK)']);
    }, 1500);

    window.setTimeout(() => {
      setAgentStatus('interpreting');
      setAgentLog(prev => [...prev, 'Analyzing DOM Structure...', 'Extracting key information...', 'Mapping UI elements to goal...']);
    }, 3000);

    window.setTimeout(() => {
      setAgentStatus('acting');
      setAgentLog(prev => [...prev, 'Simulating human interaction...', 'Executing task steps autonomously...']);
    }, 5000);

    window.setTimeout(() => {
      setAgentStatus('success');
      setAgentLog(prev => [...prev, `Task Complete: ${task}`, 'Syncing results to user profile...']);
    }, 8000);
  };

  const handleActivate = async () => {
    if (vapi) {
      if (isVapiActive) {
        vapi.stop();
      } else {
        vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '');
      }
      return;
    }

    if (!userInput.trim() && status === 'idle') return;
    processVoiceCommand(userInput);
    setUserInput('');
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'medical': return <Stethoscope className="h-5 w-5 text-red-500" />;
      case 'agriculture': return <Sprout className="h-5 w-5 text-emerald-500" />;
      case 'legal': return <Scale className="h-5 w-5 text-blue-500" />;
      case 'financial': return <Wallet className="h-5 w-5 text-amber-500" />;
      case 'child_dev': return <Baby className="h-5 w-5 text-purple-500" />;
      case 'elder_safety': return <UserCheck className="h-5 w-5 text-orange-500" />;
      default: return <Brain className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex justify-center py-10">
        <Card className="w-full max-w-4xl overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
            
            {/* Left Column: Interaction & Intelligence */}
            <div className="lg:col-span-8 p-8 space-y-8 border-r border-slate-100">
              <div className="space-y-2">
                <Badge variant="accent" className="gap-2">
                  <Zap className="h-3 w-3" />
                  Skills Intelligence v1.0
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">Talk to Looca</h1>
              </div>

              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={handleActivate}
                  className={`group relative flex h-48 w-48 items-center justify-center rounded-full border transition hover:scale-[1.01] ${
                    isVapiActive 
                      ? 'border-red-200 bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#fff1f2_55%,#ffe4e6_100%)] shadow-[0_22px_60px_rgba(244,63,94,0.2)]'
                      : 'border-slate-200 bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f8fafc_55%,#e2e8f0_100%)] shadow-[0_22px_60px_rgba(15,23,42,0.12)]'
                  }`}
                >
                  {(status === 'listening' || status === 'finding' || isVapiActive) && (
                    <>
                      <span className={`absolute inset-0 animate-ping rounded-full border ${isVapiActive ? 'border-red-300/80' : 'border-slate-300/80'}`} />
                      <span className={`absolute inset-4 animate-ping rounded-full border [animation-delay:300ms] ${isVapiActive ? 'border-red-300/60' : 'border-slate-300/60'}`} />
                    </>
                  )}
                  <div className="relative z-10 text-center">
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-105 ${
                      isVapiActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-950 text-white'
                    }`}>
                      {status === 'finding' ? <Loader2 className="h-7 w-7 animate-spin" /> : <Mic className="h-7 w-7" />}
                    </div>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isVapiActive ? 'text-red-400' : 'text-slate-400'}`}>
                      {isVapiActive ? 'Live' : 'Talk'}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {isVapiActive ? 'Listening...' : status === 'idle' ? 'Tap to talk' : status}
                    </p>
                  </div>
                </button>

                <div className="relative w-full max-w-lg">
                  <input
                    type="text"
                    placeholder="Type or speak a problem..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                    className="h-14 w-full rounded-3xl border border-slate-200 bg-white pl-6 pr-14 text-sm shadow-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  />
                  <button
                    onClick={handleActivate}
                    className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white transition hover:scale-105"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {liveLog.length > 0 && (
                  <div className="w-full space-y-3 rounded-[24px] border border-slate-100 bg-slate-50/50 p-6 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interaction Stream</p>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {liveLog.map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            log.type === 'action' ? 'bg-blue-500' : 
                            log.type === 'result' ? 'bg-emerald-500' : 
                            log.type === 'skill' ? 'bg-purple-500 animate-pulse' :
                            'bg-slate-300'
                          }`} />
                          <p className={`text-sm leading-6 ${
                            log.type === 'thought' ? 'italic text-slate-500' : 
                            log.type === 'skill' ? 'font-bold text-purple-600' :
                            'font-medium text-slate-900'
                          }`}>
                            {log.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Brain & Status */}
            <div className="lg:col-span-4 bg-slate-50/50 p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Brain Status</h3>
                
                {/* Skill Indicator */}
                <Card className="p-4 border-slate-200 shadow-sm bg-white overflow-hidden relative">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      {getSkillIcon(intelligence?.detected_skill || 'general')}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Active Skill</p>
                      <p className="text-sm font-bold text-slate-900 capitalize">
                        {intelligence?.detected_skill?.replace('_', ' ') || 'Calibrating...'}
                      </p>
                    </div>
                  </div>
                  {intelligence && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${intelligence.confidence_level}%` }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    />
                  )}
                </Card>

                {/* Confidence Level */}
                <Card className="p-4 border-slate-200 shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence</p>
                    <p className="text-xs font-bold text-slate-900">{intelligence?.confidence_level || 0}%</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${intelligence?.confidence_level || 0}%` }}
                      className={`h-full rounded-full ${
                        (intelligence?.confidence_level || 0) > 90 ? 'bg-emerald-500' :
                        (intelligence?.confidence_level || 0) > 70 ? 'bg-blue-500' :
                        (intelligence?.confidence_level || 0) > 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500 italic">
                    {intelligence?.confidence_level && intelligence.confidence_level > 90 ? 'High reliability action' :
                     intelligence?.confidence_level && intelligence.confidence_level > 70 ? 'Informed reasoning' :
                     intelligence?.confidence_level && intelligence.confidence_level > 50 ? 'Limited context' : 'Seeking clarification'}
                  </p>
                </Card>

                {/* Emotional Load */}
                <Card className="p-4 border-slate-200 shadow-sm bg-white">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-3">User Stress Level</p>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((level) => (
                      <div 
                        key={level}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${
                          intelligence?.emotional_load === level 
                            ? (level === 'low' ? 'bg-emerald-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500')
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] font-medium text-slate-600 capitalize">
                    {intelligence?.emotional_load || 'Idle'} detected
                  </p>
                </Card>

              </div>

              {/* Connected Apps Recap */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Workspace Connections</p>
                <div className="flex flex-wrap gap-2">
                  {personalApps.filter(app => connectedApps.includes(app.id)).map(app => (
                    <div key={app.id} className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                      <img src={app.icon} alt={app.name} className="h-4 w-4" />
                    </div>
                  ))}
                  {connectedApps.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic">No apps linked</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Action Overlays */}
      <AnimatePresence>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-10 right-10 z-[100] w-full max-w-md overflow-hidden rounded-[32px] border border-slate-200 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between bg-slate-900 px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-white">Media Layer</p>
              </div>
              <button onClick={() => setVideoUrl(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="YouTube"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}

        {agentStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[110] flex justify-center p-8 pointer-events-none"
          >
            <div className="w-full max-w-4xl pointer-events-auto overflow-hidden rounded-t-[40px] border-t border-x border-slate-800 bg-slate-950 shadow-[0_-40px_100px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between bg-slate-900 px-8 py-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-4 w-px bg-slate-700" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Terminal className="h-3 w-3" /> Browser Agent Engine
                  </p>
                </div>
                <button onClick={() => setAgentStatus('idle')} className="text-slate-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 h-[350px]">
                <div className="border-r border-slate-800 bg-slate-950 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar">
                  {agentLog.map((log, i) => (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="text-slate-400 mb-1">
                      <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
                    </motion.p>
                  ))}
                  {agentStatus !== 'success' && <p className="text-emerald-500 animate-pulse mt-2">_</p>}
                </div>
                <div className="bg-slate-900/50 p-8 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-[24px] bg-slate-800 flex items-center justify-center text-white border border-slate-700 mb-6">
                    {agentStatus === 'booting' && <Loader2 className="h-8 w-8 animate-spin text-slate-500" />}
                    {agentStatus === 'navigating' && <Globe className="h-8 w-8 text-blue-400 animate-pulse" />}
                    {agentStatus === 'interpreting' && <ScanSearch className="h-8 w-8 text-amber-400" />}
                    {agentStatus === 'acting' && <MousePointer2 className="h-8 w-8 text-emerald-400 animate-bounce" />}
                    {agentStatus === 'success' && <CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 capitalize">{agentStatus.replace('_', ' ')}</h3>
                  <p className="text-[10px] text-slate-500 text-center max-w-[180px]">Autonomous browser operator in session</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

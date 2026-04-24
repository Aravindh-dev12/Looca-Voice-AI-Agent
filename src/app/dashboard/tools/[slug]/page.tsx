'use client';

import { use, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Mic, Sparkles, Type, Heart,
  Play, Pause, Volume2, ShieldCheck, ArrowLeft, ArrowRight,
  Upload, Loader2, CheckCircle2, Music, Waves, Download, Share2,
  Settings, Sliders, ChevronDown, MessageSquare, BookOpen, Smile,
  Megaphone, Globe, User, RotateCcw, Info, HelpCircle, FileText, Bell,
  Circle, Square, Languages, Zap, Folder, Search, X, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Card, Button, Badge, Slider, Switch } from '@/components/ui';
import Link from 'next/link';

const toolConfig: Record<string, any> = {
  'isolator': {
    title: 'Voice Isolator',
    description: 'Remove background noise and make the speaker sound crystal clear.',
    icon: Users,
    action: 'Select Audio to Clean',
    helper: 'VIOS uses deep neural networks to strip away traffic, wind, and background chatter.',
    successMsg: 'Background noise removed successfully.'
  },
  'tts': {
    title: 'Text to Speech',
    description: 'Turn written words into a clear voice that reads to you.',
    icon: Mic,
    action: 'Enter Text to Speak',
    helper: 'VIOS can read messages, letters, or news articles out loud.',
    successMsg: 'Voice generated successfully.'
  },
  'vfx': {
    title: 'Sound Effects',
    description: 'Add clear sounds to make your voice messages better.',
    icon: Sparkles,
    action: 'Add Sound Effect',
    helper: 'VIOS adds simple sounds like alerts, bells, or background music.',
    successMsg: 'Effects applied successfully.'
  },
  'stt': {
    title: 'Speech to Text',
    description: 'Turn your voice into written words.',
    icon: Type,
    action: 'Tap to Record',
    helper: 'VIOS writes down exactly what you say in any language.',
    successMsg: 'Transcribed successfully.'
  },
  'voice-changer': {
    title: 'Voice Changer',
    description: 'Make your voice sound clearer or change how it talks.',
    icon: Heart,
    action: 'Record Voice',
    helper: 'VIOS can make your voice deeper, higher, or just more stable.',
    successMsg: 'Voice adjusted successfully.'
  }
};

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = toolConfig[slug] || toolConfig['tts'];

  const [stage, setStage] = useState<'upload' | 'processing' | 'result'>('upload');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resultUrls, setResultUrls] = useState<{ original: string, cleared: string } | null>(null);

  const [ttsText, setTtsText] = useState('');
  const [vfxPrompt, setVfxPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('roger');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('google/lyria-3-pro-preview');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isOutputFormatDropdownOpen, setIsOutputFormatDropdownOpen] = useState(false);
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0,
    speakerBoost: true,
    languageOverride: false,
    outputFormat: 'MP3 44.1 kHz (128kbps)'
  });

  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/audio/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateMenuOpen, setIsGenerateMenuOpen] = useState(false);
  const voiceUploadRef = useRef<HTMLInputElement>(null);
  const [generatedAudioInfo, setGeneratedAudioInfo] = useState<{
    voice: string,
    model: string,
    speed: number,
    stability: number,
    similarity: number,
    styleExaggeration: number
  } | null>(null);

  const startProcessing = async (file?: File) => {
    if (slug !== 'tts' && slug !== 'vfx' && !file) return;

    setStage('processing');
    setProgress(10);

    try {
      const token = localStorage.getItem('looca_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      let res;
      if (slug === 'tts') {
        const payload = {
          text: ttsText,
          voice: selectedVoice,
          model: selectedModel || "google/lyria-3-pro-preview",
          settings: ttsSettings
        };
        res = await fetch(`${baseUrl}/api/vios/tts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else if (slug === 'vfx') {
        const payload = {
          prompt: vfxPrompt,
          model: selectedModel || "google/lyria-3-pro-preview"
        };
        res = await fetch(`${baseUrl}/api/vios/vfx`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        const formData = new FormData();
        if (file) formData.append('file', file);
        res = await fetch(`${baseUrl}/api/vios/process?tool_type=${slug}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Processing failed');
      }

      const data = await res.json();
      setResultUrls({
        original: data.original_url || '',
        cleared: data.cleared_url || data.audio_url
      });
      setGeneratedAudioInfo({
        voice: selectedVoice,
        model: selectedModel,
        speed: ttsSettings.speed,
        stability: ttsSettings.stability,
        similarity: ttsSettings.similarity,
        styleExaggeration: ttsSettings.styleExaggeration
      });

      setProgress(100);
      setTimeout(() => setStage('result'), 500);
      fetchHistory(); 
    } catch (error: any) {
      alert(`Error: ${error.message || 'Something went wrong'}`);
      setStage('upload');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startProcessing(file);
  };

  const [playing, setPlaying] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (url: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`;

    if (playing === url) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.ontimeupdate = null;
      }

      const audio = new Audio(fullUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        const p = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(p || 0);
      };

      audio.play();
      setPlaying(url);
      audio.onended = () => {
        setPlaying(null);
        setAudioProgress(0);
      };
    }
  };

  const handleDownload = async () => {
    if (!resultUrls) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${resultUrls.cleared}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `looca_${slug}_${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          <div className="flex-1 p-10 overflow-y-auto relative flex flex-col">
            {slug === 'tts' ? (
              <textarea
                className="w-full h-full text-2xl font-medium text-zinc-900 placeholder:text-zinc-200 resize-none focus:outline-none bg-transparent leading-relaxed"
                placeholder="Start typing here..."
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value.slice(0, 5000))}
              />
            ) : slug === 'vfx' && stage !== 'processing' ? (
              <div className="flex flex-col h-full space-y-8">
                <div className="flex items-center gap-6 border-b border-zinc-100 pb-4">
                  <h2 className="text-2xl font-black text-black">Sound Effects</h2>
                  <div className="flex items-center gap-4 text-sm font-bold text-zinc-400 ml-4">
                    <span className="text-zinc-900 cursor-pointer">Explore</span>
                    <span className="cursor-pointer hover:text-zinc-600 transition-colors">History</span>
                    <span className="cursor-pointer hover:text-zinc-600 transition-colors">Favorites</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  {['Animals', 'Bass', 'Booms', 'Braams', 'Brass', 'Cymbals'].map((cat, i) => (
                    <div key={cat} className="aspect-square rounded-2xl bg-zinc-900 overflow-hidden relative group cursor-pointer">
                      <div className={`absolute inset-0 opacity-40 bg-gradient-to-br from-indigo-500 to-purple-600`} />
                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <span className="text-white font-black text-sm relative z-10">{cat}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search sound effects..." className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-xl text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300" />
                  </div>
                  <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-zinc-200 text-zinc-600">Trending <ChevronDown className="w-4 h-4 ml-2" /></Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-end pb-10">
                  <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl p-4 flex flex-col gap-4">
                    <div className="flex gap-2">
                      {['Footsteps on gravel', 'Rain on window', 'Cat purring'].map(suggestion => (
                        <button key={suggestion} onClick={() => setVfxPrompt(suggestion)} className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        value={vfxPrompt}
                        onChange={(e) => setVfxPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && vfxPrompt && startProcessing()}
                        placeholder="Describe a sound..." 
                        className="flex-1 text-lg font-medium text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none"
                      />
                      <Button onClick={() => startProcessing()} disabled={!vfxPrompt} className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-black text-white p-0 flex items-center justify-center disabled:opacity-50">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400 pt-2 border-t border-zinc-100">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Off</span>
                        <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Auto</span>
                      </div>
                      <span>50 credits / 9,991 credits</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : stage === 'processing' ? (
              <div className="h-full flex flex-col items-center justify-center space-y-12">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-50" />
                    <motion.circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="6" strokeDasharray="565.48" animate={{ strokeDashoffset: 565.48 * (1 - progress / 100) }} fill="transparent" className="text-black" />
                  </svg>
                  <span className="absolute text-4xl font-black">{progress}%</span>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-black">Processing Audio</h3>
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Wait a moment...</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col p-12 space-y-8 relative overflow-hidden">
                {slug === 'tts' ? (
                  <div className="flex-1 bg-white rounded-[40px] border border-zinc-100 shadow-sm p-10 flex flex-col space-y-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                          <Type className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-black">Voice Editor</h2>
                      </div>
                      
                      <AnimatePresence>
                        {stage === 'result' && resultUrls && (
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-2xl shadow-lg border border-white/10"
                          >
                            <div className="flex items-center gap-3 pr-3 border-r border-white/10">
                              <Button 
                                variant="ghost"
                                className="w-8 h-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
                                onClick={() => togglePlay(resultUrls.cleared)}
                              >
                                {playing === resultUrls.cleared ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Ready</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="h-8 px-3 rounded-xl text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest"
                              onClick={handleDownload}
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-8 h-8 p-0 rounded-xl text-white/40 hover:text-white"
                              onClick={() => setStage('upload')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <textarea
                      className="flex-1 w-full bg-transparent border-none resize-none text-4xl font-black text-zinc-900 placeholder:text-zinc-100 focus:outline-none"
                      placeholder="Start typing..."
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                    />

                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-full px-4 py-1.5 border-zinc-100 text-[10px] font-black uppercase text-zinc-400">OpenRouter V3</Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-1.5 border-zinc-100 text-[10px] font-black uppercase text-zinc-400">HQ Audio</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-12">
                    <div className="space-y-4 text-center">
                      <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <tool.icon className="w-10 h-10 text-white" />
                      </div>
                      <h1 className="text-5xl font-black text-black tracking-tight">{tool.title}</h1>
                      <p className="text-zinc-500 font-medium text-lg max-w-xl mx-auto">{tool.description}</p>
                    </div>

                    <div
                      className="w-full max-w-xl p-12 border-4 border-dashed border-zinc-100 rounded-[48px] bg-white hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group shadow-2xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" />
                      <div className="space-y-6 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-zinc-100 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-black transition-all duration-500">
                          <Upload className="w-10 h-10 text-zinc-400 group-hover:text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-black">{tool.action}</h3>
                          <p className="text-zinc-400 font-medium text-xs font-black uppercase tracking-widest">Click to choose an audio file</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {slug !== 'vfx' && (
            <div className="h-20 border-t border-zinc-50 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {slug === 'tts' && (
                  <>
                    <div className="text-xs font-bold text-zinc-300">
                      <span className={ttsText.length > 4500 ? 'text-amber-500' : 'text-zinc-400'}>{ttsText.length.toLocaleString()}</span> / 5,000
                    </div>
                  </>
                )}

                <Button
                  className="h-12 px-12 rounded-2xl text-sm font-black transition-all bg-black text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 disabled:opacity-30 active:scale-95"
                  disabled={(slug === 'tts' ? !ttsText : false) || stage === 'processing'}
                  onClick={() => slug === 'tts' ? startProcessing() : fileInputRef.current?.click()}
                >
                  {slug === 'tts' ? (stage === 'result' ? 'Regenerate' : 'Generate speech') : 'Upload Audio'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {slug !== 'vfx' && (
          <aside className="w-[420px] border-l border-zinc-100 bg-white flex flex-col shrink-0 overflow-hidden">
            <div className="px-6 pt-6 shrink-0 bg-white">
              <div className="flex border-b border-zinc-100">
                <button
                  className={`pb-4 pr-8 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'settings' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                  {activeTab === 'settings' && (
                    <motion.div layoutId="sidebar-tab" className="absolute bottom-0 left-0 right-8 h-[2px] bg-black" />
                  )}
                </button>
                <button
                  className={`pb-4 px-8 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  onClick={() => setActiveTab('history')}
                >
                  History
                  {activeTab === 'history' && (
                    <motion.div layoutId="sidebar-tab" className="absolute bottom-0 left-8 right-8 h-[2px] bg-black" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {activeTab === 'settings' ? (
                <>
                  {slug === 'tts' ? (
                    <>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Select Voice</label>
                        <div className="space-y-3">
                          <div className="relative group">
                            <button
                              onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                              className="w-full h-12 px-4 flex items-center justify-between bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 shadow-sm cursor-pointer transition-all hover:bg-zinc-50"
                            >
                              <span>
                                {[
                                  { id: 'roger', name: 'Roger', description: 'Deep, Authoritative' },
                                  { id: 'rachel', name: 'Rachel', description: 'Soft, Friendly' },
                                  { id: 'emma', name: 'Emma', description: 'Bright, Energetic' },
                                  { id: 'james', name: 'James', description: 'Smooth, British' },
                                  { id: 'lily', name: 'Lily', description: 'Warm, Narrative' },
                                  { id: 'clyde', name: 'Clyde', description: 'Deep, Bass' }
                                ].find(v => v.id === selectedVoice)?.name || 'Select Voice'}
                                <span className="text-zinc-400 font-medium ml-2">
                                  — {[
                                  { id: 'roger', name: 'Roger', description: 'Deep, Authoritative' },
                                  { id: 'rachel', name: 'Rachel', description: 'Soft, Friendly' },
                                  { id: 'emma', name: 'Emma', description: 'Bright, Energetic' },
                                  { id: 'james', name: 'James', description: 'Smooth, British' },
                                  { id: 'lily', name: 'Lily', description: 'Warm, Narrative' },
                                  { id: 'clyde', name: 'Clyde', description: 'Deep, Bass' }
                                ].find(v => v.id === selectedVoice)?.description || ''}
                                </span>
                              </span>
                              <motion.div animate={{ rotate: isVoiceDropdownOpen ? 180 : 0 }}>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {isVoiceDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden z-50 py-2"
                                >
                                  {[
                                    { id: 'roger', name: 'Roger', description: 'Deep, Authoritative' },
                                    { id: 'rachel', name: 'Rachel', description: 'Soft, Friendly' },
                                    { id: 'emma', name: 'Emma', description: 'Bright, Energetic' },
                                    { id: 'james', name: 'James', description: 'Smooth, British' },
                                    { id: 'lily', name: 'Lily', description: 'Warm, Narrative' },
                                    { id: 'clyde', name: 'Clyde', description: 'Deep, Bass' }
                                  ].map(v => (
                                    <button
                                      key={v.id}
                                      onClick={() => {
                                        setSelectedVoice(v.id);
                                        setIsVoiceDropdownOpen(false);
                                      }}
                                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors hover:bg-zinc-50 ${selectedVoice === v.id ? 'bg-zinc-50' : ''}`}
                                    >
                                      <div>
                                        <span className="text-xs font-bold text-zinc-900">{v.name}</span>
                                        <p className="text-[10px] font-medium text-zinc-500 mt-0.5">{v.description}</p>
                                      </div>
                                      {selectedVoice === v.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                      )}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="space-y-10 pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Speed</label>
                          </div>
                          <Slider
                            labelStart="Slower"
                            labelEnd="Faster"
                            value={ttsSettings.speed * 50}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, speed: parseInt(e.target.value) / 50 })}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stability</label>
                          </div>
                          <Slider
                            labelStart="More variable"
                            labelEnd="More stable"
                            value={ttsSettings.stability * 100}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, stability: parseInt(e.target.value) / 100 })}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Similarity</label>
                            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-black text-white">{Math.round(ttsSettings.similarity * 100)}%</span>
                          </div>
                          <Slider
                            labelStart="Low"
                            labelEnd="High"
                            value={ttsSettings.similarity * 100}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, similarity: parseInt(e.target.value) / 100 })}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest underline decoration-dotted underline-offset-4">Style Exaggeration</label>
                          </div>
                          <Slider
                            labelStart="None"
                            labelEnd="Exaggerated"
                            value={ttsSettings.styleExaggeration * 100}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, styleExaggeration: parseInt(e.target.value) / 100 })}
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest underline decoration-dotted underline-offset-4">Language Override</label>
                          <Switch checked={ttsSettings.languageOverride} onChange={() => setTtsSettings({ ...ttsSettings, languageOverride: !ttsSettings.languageOverride })} />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Output Format</label>
                          <div className="relative group">
                            <button
                              onClick={() => setIsOutputFormatDropdownOpen(!isOutputFormatDropdownOpen)}
                              className="w-full h-12 px-4 flex items-center justify-between bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 shadow-sm cursor-pointer transition-all hover:bg-zinc-50"
                            >
                              <span>{ttsSettings.outputFormat}</span>
                              <motion.div animate={{ rotate: isOutputFormatDropdownOpen ? 180 : 0 }}>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {isOutputFormatDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden z-50 py-2"
                                >
                                  {['MP3 44.1 kHz (128kbps)', 'MP3 44.1 kHz (192kbps)', 'WAV 44.1 kHz'].map(format => (
                                    <button
                                      key={format}
                                      onClick={() => {
                                        setTtsSettings({ ...ttsSettings, outputFormat: format });
                                        setIsOutputFormatDropdownOpen(false);
                                      }}
                                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors hover:bg-zinc-50 ${ttsSettings.outputFormat === format ? 'bg-zinc-50' : ''}`}
                                    >
                                      <span className="text-xs font-bold text-zinc-900">{format}</span>
                                      {ttsSettings.outputFormat === format && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                      )}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Generic Tool Settings */
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-black uppercase tracking-widest">Tool Settings</h3>
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">Adjust the parameters for {tool.title} to get the best results.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Intensity</label>
                          <Slider labelStart="Low" labelEnd="High" defaultValue={50} />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Auto-Enhance</label>
                          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <span className="text-xs font-bold text-zinc-600">Enable Smart Processing</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* History Tab */
                <div className="space-y-4">
                  {history.length > 0 ? history.map((rec) => (
                    <div 
                      key={rec.id} 
                    className="p-4 rounded-2xl border border-zinc-50 bg-white hover:border-zinc-100 transition-all cursor-pointer group"
                    onClick={() => {
                      setResultUrls({ original: rec.file_url, cleared: rec.file_url });
                      setStage('result');
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{new Date(rec.created_at).toLocaleString()}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); window.open(rec.file_url); }}><Download className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-zinc-600 line-clamp-2 leading-relaxed mb-3">
                      {rec.ai_insight || 'Generated audio session'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-tight">{rec.tool_type.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                      <RotateCcw className="w-5 h-5 text-zinc-200" />
                    </div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No history yet</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Bottom Player Bar */}
      <AnimatePresence>
        {resultUrls && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="h-20 border-t border-zinc-100 bg-white flex flex-col shrink-0"
          >
            <div className="flex-1 flex items-center px-6 gap-8">
              <div className="truncate flex flex-col">
                <span className="text-[11px] font-black text-zinc-900 block truncate">
                  {generatedAudioInfo ? (
                    `${generatedAudioInfo.voice.split(' - ')[0]} • ${generatedAudioInfo.model.split('/').pop()?.toUpperCase() || 'V3'}`
                  ) : (
                    'No audio generated'
                  )}
                </span>
                {generatedAudioInfo && (
                  <div className="flex gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    <span>Spd: {generatedAudioInfo.speed.toFixed(1)}x</span>
                    <span>Stb: {Math.round(generatedAudioInfo.stability * 100)}%</span>
                    <span>Sim: {Math.round(generatedAudioInfo.similarity * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <RotateCcw className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-900 transform scale-x-[-1]" />
                  <button
                    className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                    onClick={() => resultUrls && togglePlay(resultUrls.cleared)}
                  >
                    {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>
                  <RotateCcw className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-900" />
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-400 tabular-nums">0:00</span>
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full relative group cursor-pointer">
                    <div className="absolute inset-0 bg-zinc-100 rounded-full" />
                    <motion.div
                      className="absolute top-0 left-0 bottom-0 bg-zinc-900 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${audioProgress}%` }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-zinc-900 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${audioProgress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 tabular-nums">0:00</span>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-[280px] justify-end">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" className="h-9 w-9 p-0 text-zinc-400 hover:text-zinc-900"><ThumbsUp className="w-4 h-4" /></Button>
                  <Button variant="ghost" className="h-9 w-9 p-0 text-zinc-400 hover:text-zinc-900"><ThumbsDown className="w-4 h-4" /></Button>
                </div>
                <div className="w-[1px] h-4 bg-zinc-100 mx-1" />
                <Button variant="outline" className="h-9 px-4 rounded-lg bg-white border border-zinc-200 text-xs font-bold flex gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="outline" className="h-9 w-9 p-0 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </Button>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const voices = [
  'Roger - Laid-Back, Casual, Resonant',
  'Rachel - Calm, Professional, Warm',
  'Clyde - Deep, Authoritative, Gravelly',
  'Emma - Energetic, Bright, Friendly',
  'James - Sophisticated, British, Smooth'
];

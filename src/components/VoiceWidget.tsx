'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE } from '@/lib/api';

type Status = 'idle' | 'connecting' | 'live' | 'processing';
type Mode = 'cloud' | 'offline' | 'unknown';
type VoiceResult = {
  transcript?: string;
  reply?: string;
  language?: string;
  audio_url?: string;
  providers?: { stt?: string; llm?: string; tts?: string };
};

export function VoiceWidget() {
  const [status, setStatus] = useState<Status>('idle');
  const [mode, setMode] = useState<Mode>('unknown');
  const [runtime, setRuntime] = useState('Checking voice runtime...');
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(true);

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
  const vapiConfigured = useMemo(() => Boolean(assistantId && publicKey), [assistantId, publicKey]);

  const vapiRef = useRef<any>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    let cancelled = false;
    const syncOnline = () => setOnline(navigator.onLine);
    syncOnline();
    window.addEventListener('online', syncOnline);
    window.addEventListener('offline', syncOnline);

    fetch(`${API_BASE}/api/offline/status`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) {
          setRuntime(
            `Hybrid ready · STT ${data?.stt?.engine || 'local'} · TTS ${data?.tts?.engine || 'local'} · LLM ${data?.llm?.model || 'fallback'}`,
          );
        }
      })
      .catch(() => {
        if (!cancelled) setRuntime(vapiConfigured ? 'Cloud ready · local backend not detected' : 'Start the FastAPI backend for offline voice');
      });

    return () => {
      cancelled = true;
      window.removeEventListener('online', syncOnline);
      window.removeEventListener('offline', syncOnline);
      stopTracks();
    };
  }, [vapiConfigured]);

  function reset() {
    try { recorderRef.current?.stop(); } catch {}
    recorderRef.current = null;
    stopTracks();
    try { vapiRef.current?.stop(); } catch {}
    vapiRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    setStatus('idle');
    setMode('unknown');
  }

  async function startVapi() {
    setMode('cloud');
    setStatus('connecting');
    const mod = await import('@vapi-ai/web');
    const Vapi = mod.default as any;
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;
    vapi.on('call-start', () => { setStatus('live'); setMode('cloud'); });
    vapi.on('call-end', () => reset());
    vapi.on('error', async () => {
      try { await startOffline(); }
      catch { setError('Cloud voice failed and the offline backend is unavailable.'); reset(); }
    });
    await vapi.start(assistantId);
  }

  async function startOffline() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      throw new Error('This browser does not support microphone recording.');
    }
    setMode('offline');
    setStatus('connecting');
    setResult(null);
    setError('');

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    streamRef.current = stream;

    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
      .find((item) => MediaRecorder.isTypeSupported(item));
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => void processRecording(recorder.mimeType || mime || 'audio/webm');
    recorder.onerror = () => { setError('Microphone recording failed.'); reset(); };
    recorder.start(250);
    setStatus('live');
  }

  async function processRecording(mimeType: string) {
    setStatus('processing');
    stopTracks();
    const blob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];
    if (!blob.size) { setError('No audio was captured.'); setStatus('idle'); return; }

    const form = new FormData();
    form.append('file', blob, mimeType.includes('ogg') ? 'recording.ogg' : 'recording.webm');
    form.append('language', 'auto');
    form.append('voice', 'rachel');
    form.append('speed', '1.0');

    try {
      const response = await fetch(`${API_BASE}/api/offline/voice`, { method: 'POST', body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.detail || `Voice error (${response.status})`);
      setResult(data);
      setMode('offline');
      if (data.audio_url) {
        const audio = new Audio(`${API_BASE}${data.audio_url}`);
        audioRef.current = audio;
        await audio.play().catch(() => undefined);
      }
    } catch (err: any) {
      setError(err?.message || 'Offline voice processing failed.');
    } finally {
      setStatus('idle');
    }
  }

  async function start() {
    setError('');
    if (online && vapiConfigured) {
      try { await startVapi(); return; }
      catch (err) { console.error('Vapi failed; switching to local voice', err); }
    }
    try { await startOffline(); }
    catch (err: any) { setError(err?.message || 'Unable to start microphone.'); setStatus('idle'); setMode('unknown'); }
  }

  function stop() {
    if (mode === 'offline' && recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
      recorderRef.current = null;
    } else {
      reset();
    }
  }

  const statusText = status === 'connecting'
    ? 'Calibrating...'
    : status === 'processing'
      ? 'Transcribing and responding...'
      : mode === 'offline'
        ? 'Looca is Recording Locally'
        : 'Looca is Listening';

  return (
    <div className="voice-container">
      {status === 'idle' ? (
        <div className="voice-idle">
          <button className="voice-trigger-btn-round" onClick={start}>
            <div className="trigger-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="7" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor" />
                <rect x="15" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <span style={{ fontWeight: 500, letterSpacing: '0.5px', fontSize: 14 }}>Initialize</span>
          </button>
          <p className="voice-footer-text">{online && vapiConfigured ? 'Cloud + Local Fallback' : 'Local Voice Mode'}</p>
          <p className="subtle" style={{ fontSize: 12, marginTop: 8 }}>{runtime}</p>

          {result && (
            <div className="small-card" style={{ marginTop: 18, textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                Language: {result.language || 'auto'}{result.providers?.stt ? ` · STT: ${result.providers.stt}` : ''}
              </div>
              {result.transcript && <p style={{ margin: '0 0 10px' }}><strong>You:</strong> {result.transcript}</p>}
              {result.reply && <p style={{ margin: 0 }}><strong>Looca:</strong> {result.reply}</p>}
            </div>
          )}
          {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}
        </div>
      ) : (
        <div className={`voice-active ${status}`}>
          <div className="orb-wrapper"><div className="orb-container"><div className="orb-ripple"></div><div className="orb-ripple"></div><div className="orb-main"></div></div></div>
          <div className="voice-status-info">
            <h4 className="status-text">{statusText}</h4>
            <p className="subtle">{status === 'processing' ? 'Speech recognition, reasoning, and synthesis' : mode === 'offline' ? 'Speak, then press Send' : 'Speak now to get support'}</p>
          </div>
          {status !== 'processing' && <button className="btn-end-session" onClick={stop}>{mode === 'offline' ? 'Send' : 'End Interaction'}</button>}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

export function VoiceWidget() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live'>('idle');
  const [error, setError] = useState<string | null>(null);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'your-assistant-id';
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'your-public-key';

  async function startDemo() {
    setStatus('connecting');
    setError(null);
    
    // Check if VAPI keys are configured
    if (!publicKey || publicKey === 'your-public-key') {
      setError('VAPI Public Key not configured. Please set NEXT_PUBLIC_VAPI_PUBLIC_KEY in your .env file.');
      setStatus('idle');
      return;
    }
    if (!assistantId || assistantId === 'your-assistant-id') {
      setError('VAPI Assistant ID not configured. Please set NEXT_PUBLIC_VAPI_ASSISTANT_ID in your .env file.');
      setStatus('idle');
      return;
    }
    
    try {
      console.log('[VAPI] Starting with Public Key:', publicKey.slice(0, 8) + '...');
      console.log('[VAPI] Assistant ID:', assistantId);
      
      // Check if SDK is available
      const mod = await import('@vapi-ai/web');
      console.log('[VAPI] SDK loaded:', mod);
      
      // Vapi SDK exports differently - check both default and named exports
      const VapiClient = mod.default || (mod as any).Vapi;
      if (!VapiClient) {
        throw new Error('Vapi SDK not found in module. Check @vapi-ai/web installation.');
      }
      
      const vapi = new VapiClient(publicKey);
      console.log('[VAPI] Client initialized');
      
      // Log all events for debugging
      vapi.on('call-start', () => {
        console.log('[VAPI] ✅ Call started successfully');
        setStatus('live');
        setError(null);
      });
      
      vapi.on('call-end', () => {
        console.log('[VAPI] Call ended');
        setStatus('idle');
      });
      
      vapi.on('error', (err: any) => {
        console.error('[VAPI] ❌ Error:', err);
        const errorMsg = err?.message || err?.error?.message || 'Connection failed';
        setError(`VAPI Error: ${errorMsg}. Check console for details.`);
        setStatus('idle');
      });
      
      // Log speech events
      vapi.on('speech-start', () => {
        console.log('[VAPI] 🎤 User started speaking');
      });
      
      vapi.on('speech-end', () => {
        console.log('[VAPI] 🎤 User stopped speaking');
      });
      
      vapi.on('message', (message: any) => {
        console.log('[VAPI] 📨 Message:', message);
        // Handle tool call results or custom messages for browser actions
        if (message.type === 'tool-calls' || message.type === 'tool-call-result') {
          const result = message.toolCallResult?.result || message.result;
          if (result && result.browser_action && result.url) {
            console.log('[VAPI] Opening browser action URL:', result.url);
            window.open(result.url, '_blank');
          }
          if (result && result.voice_response) {
            console.log('[VAPI] Voice response:', result.voice_response);
          }
        }
      });

      console.log('[VAPI] 🚀 Calling vapi.start()...');
      vapi.start(assistantId);
      console.log('[VAPI] start() called successfully');
      
    } catch (err: any) {
      console.error('[VAPI] ❌ Failed to initialize:', err);
      setError(`Failed to start VAPI: ${err.message || 'Unknown error'}. Check that @vapi-ai/web is installed (npm install @vapi-ai/web).`);
      setStatus('idle');
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const hasVapiKeys = publicKey && publicKey !== 'your-public-key' && assistantId && assistantId !== 'your-assistant-id';

  return (
    <div className="voice-container">
      {/* Setup Instructions */}
      {!hasVapiKeys && status === 'idle' && (
        <div style={{ 
          background: '#f3f4f6', 
          border: '1px solid #d1d5db', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '16px',
          color: '#374151',
          fontSize: '12px',
          maxWidth: '320px',
          textAlign: 'left'
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>🔧 VAPI Setup Required</strong>
          <ol style={{ paddingLeft: '16px', margin: '8px 0', lineHeight: '1.6' }}>
            <li>Create account at <a href="https://vapi.ai" target="_blank" style={{color: '#2563eb'}}>vapi.ai</a></li>
            <li>Get your Public Key from dashboard</li>
            <li>Create an Assistant & copy ID</li>
            <li>Add to <code style={{background: '#e5e7eb', padding: '2px 4px', borderRadius: '4px'}}>.env.local</code>:
              <pre style={{background: '#e5e7eb', padding: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'auto'}}>
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
NEXT_PUBLIC_API_URL=http://localhost:8000</pre>
            </li>
            <li>Start backend: <code style={{background: '#e5e7eb', padding: '2px 4px', borderRadius: '4px'}}>uvicorn app.main:app --port 8000</code></li>
          </ol>
        </div>
      )}
      
      {error && (
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          marginBottom: '16px',
          color: '#92400e',
          fontSize: '13px',
          maxWidth: '320px'
        }}>
          <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ Error</strong>
          {error}
          <div style={{marginTop: '8px', fontSize: '11px', color: '#a16207'}}>
            Backend: {apiUrl}
          </div>
        </div>
      )}
      {status === 'idle' ? (
        <div className="voice-idle">
          <button className="voice-trigger-btn-round" onClick={startDemo} disabled={!hasVapiKeys} style={{opacity: hasVapiKeys ? 1 : 0.5}}>
            <div className="trigger-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="7" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor" />
                <rect x="15" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <span style={{ fontWeight: 500, letterSpacing: '0.5px', fontSize: 14 }}>
              {hasVapiKeys ? 'Initialize' : 'Setup Required'}
            </span>
          </button>
          <p className="voice-footer-text">{hasVapiKeys ? 'Built for Accessibility & Impact' : 'Configure VAPI keys to enable voice'}</p>
        </div>
      ) : (
        <div className={`voice-active ${status}`}>
          <div className="orb-wrapper">
             <div className="orb-container">
               <div className="orb-ripple"></div>
               <div className="orb-ripple"></div>
               <div className="orb-main"></div>
             </div>
          </div>
          
          <div className="voice-status-info">
             <h4 className="status-text">
               {status === 'connecting' ? 'Calibrating...' : 'Looca is Listening'}
             </h4>
             <p className="subtle">Speak now to get support</p>
          </div>

          <button className="btn-end-session" onClick={() => window.location.reload()}>
            End Interaction
          </button>
        </div>
      )}
    </div>
  );
}

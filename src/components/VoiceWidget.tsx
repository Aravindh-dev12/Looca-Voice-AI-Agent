'use client';

import { useMemo, useState } from 'react';

export function VoiceWidget() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live'>('idle');
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'your-assistant-id';
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'your-public-key';

  async function startDemo() {
    setStatus('connecting');
    try {
      console.log('Starting Vapi with Public Key:', publicKey.slice(0, 8) + '...');
      const mod = await import('@vapi-ai/web');
      const Vapi = mod.default as any;
      const vapi = new Vapi(publicKey);
      
      vapi.on('call-start', () => {
        console.log('Call started successfully');
        setStatus('live');
      });
      
      vapi.on('call-end', () => {
        console.log('Call ended');
        setStatus('idle');
      });
      
      vapi.on('error', (err: any) => {
        console.error('Vapi Error:', err);
        setStatus('idle');
      });

      vapi.start(assistantId);
    } catch (err) {
      console.error('Failed to load Vapi SDK:', err);
      setStatus('idle');
      alert('Vapi SDK error. Check console for details.');
    }
  }

  return (
    <div className="voice-container">
      {status === 'idle' ? (
        <div className="voice-idle">
          <button className="voice-trigger-btn-round" onClick={startDemo}>
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
          <p className="voice-footer-text">Built for Accessibility & Impact</p>
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

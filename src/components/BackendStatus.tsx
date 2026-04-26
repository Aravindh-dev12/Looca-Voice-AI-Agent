'use client';

import { useState, useEffect } from 'react';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Create abort controller for timeout (fallback for older browsers)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch(`${API_URL}/api/health`, { 
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        console.error('Backend check failed:', err);
        setStatus('offline');
      }
    };

    checkBackend();
    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (status === 'online') return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: status === 'checking' ? '#f59e0b' : '#dc2626',
        color: 'white',
        padding: '12px 20px',
        zIndex: 9999,
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>{status === 'checking' ? '⏳' : '❌'}</span>
        <span>
          {status === 'checking' 
            ? 'Checking backend connection...' 
            : `Backend server is OFFLINE at ${API_URL}`}
        </span>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {showDetails ? 'Hide' : 'How to fix'}
        </button>
      </div>
      
      {showDetails && (
        <div style={{ 
          marginTop: '12px', 
          padding: '16px', 
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '12px auto 0',
          textAlign: 'left',
          fontSize: '13px',
          lineHeight: '1.6',
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            🛠️ To fix this issue:
          </strong>
          <ol style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Open a new terminal</li>
            <li>Navigate to backend folder: <code>cd backend</code></li>
            <li>Activate virtualenv: <code>venv\Scripts\activate</code> (Windows) or <code>source venv/bin/activate</code> (Mac/Linux)</li>
            <li>Start the server: <code>uvicorn app.main:app --reload --port 8000</code></li>
            <li>Wait for "Application startup complete" message</li>
            <li>Refresh this page</li>
          </ol>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <strong>Current API URL:</strong> {API_URL}<br/>
            <strong>Expected backend:</strong> http://localhost:8000
          </div>
        </div>
      )}
    </div>
  );
}

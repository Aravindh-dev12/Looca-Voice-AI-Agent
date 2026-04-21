'use client';

import { useState } from 'react';
import Link from 'next/link';

type Perspective = 'personal' | 'enterprise';

const personalUseCases = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Healthcare Navigation',
    desc: 'Call Looca → describe symptoms → get directed to the right department, book appointment, receive reminders. Proactive health monitoring across calls.',
    example: '"I\'ve had a headache for 3 days" → Looca checks your health timeline, asks follow-up questions, books neurology at the nearest hospital with available beds.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Government Services',
    desc: 'Ration card, Aadhaar update, pension scheme — Looca knows the forms, the offices, the queue times, and can pre-fill documents from a photo.',
    example: '"I need to apply for ration card" → Looca tells you which documents to bring, best time to visit, and reads your form photo to pre-fill the application.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Financial Inclusion',
    desc: 'Bank account opening, loan applications, insurance claims — all through voice. No literacy barrier, no form fear.',
    example: '"How do I open a Jan Dhan account?" → Looca walks you through step-by-step in your dialect, tells you what to carry, and sets a reminder for the visit.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    title: 'Education Access',
    desc: 'School admissions, scholarship applications, mid-day meal issues. Looca adapts its language to the parent\'s comfort level.',
    example: '"My daughter needs school admission" → Looca lists nearby schools, scholarship eligibility, and walks you through the application in your language.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Emergency SOS',
    desc: 'Shake phone = instant emergency call. Baby crying = pediatrician suggestion. Looca detects distress in your voice before you explain.',
    example: 'Voice detected as fearful + urgent → Looca auto-connects to emergency services, shares your location, and stays on the line until help arrives.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Cognitive Care',
    desc: 'For dementia patients and elderly users — Looca remembers so they don\'t have to. Repetition is welcomed, complexity is reduced, family can set simplicity levels.',
    example: 'Dementia protocol active → Looca never says "as I mentioned before", repeats instructions patiently, and alerts family if confusion patterns worsen.',
  },
];

const enterpriseUseCases = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Customer Support AI',
    category: 'Enterprise',
    desc: 'Deploy conversational AI that reduces contact center costs, cuts response times, and improves CSAT across phone and chat. Looca handles 80% of queries autonomously.',
    features: ['Multi-language support out of the box', 'Emotion-adaptive responses', 'Seamless human handoff', 'Real-time analytics dashboard'],
    metric: '80%',
    metricLabel: 'Query Resolution',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Payment Collection Agent',
    category: 'Fintech',
    desc: 'AI voice agents collect payments over the phone through a single API call, handling card processing and PCI compliance across all payment gateways.',
    features: ['PCI-compliant voice payments', 'Multi-gateway support', 'Automated follow-up calls', 'Payment plan negotiation'],
    metric: '3x',
    metricLabel: 'Collection Rate',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    ),
    title: 'Restaurant Operations',
    category: 'Hospitality',
    desc: 'AI-powered restaurant systems with built-in voice and email agents that manage bookings, customer relationships and communication.',
    features: ['Voice booking agent', 'Email reservation confirmations', 'Customer preference memory', 'Waitlist management'],
    metric: '40%',
    metricLabel: 'Cost Reduction',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Continuous Health Provider',
    category: 'Healthcare',
    desc: 'Replaces the reactive 15-minute annual physical with continuous, proactive care. Connects to medical records and wearables to watch for clinical drift, catching subtle declines that human doctors miss between visits.',
    features: ['Always-on physician AI', 'Lab result explanation', 'Prescription management', 'Wearable data integration'],
    metric: '90%',
    metricLabel: 'Automated Triage',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Operations Intelligence',
    category: 'Logistics',
    desc: 'Swarm intelligence for fleet and resource management. Hundreds of Looca agents coordinate in real time — if route A is blocked, the swarm finds B, C, or the nearest alternative in 2 seconds.',
    features: ['Real-time swarm coordination', 'Predictive routing', 'Resource optimization', 'Anomaly detection'],
    metric: '2s',
    metricLabel: 'Route Resolution',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Global Multilingual Agent',
    category: 'International',
    desc: 'Federated dialect emergence means Looca learns your customers\' language from their calls. No translation layer — native understanding in Bhojpuri, Chhattisgarhi, Tanglish, and 22+ languages.',
    features: ['Zero-annotation learning', 'Dialect emergence', 'Cultural context awareness', 'Voice biometric identity'],
    metric: '22+',
    metricLabel: 'Languages',
  },
];

export default function EnterprisePage() {
  const [perspective, setPerspective] = useState<Perspective>('personal');

  return (
    <main className="page-grid">
      <section className="ent-hero">
        <div className="card glass-premium" style={{ padding: '40px 32px' }}>
          <div className="wave-container">
            <div className="wave-layer l1"></div>
            <div className="wave-layer l2"></div>
          </div>
          <div className="impact-header">
            <span className="pill-success">Looca Platform</span>
            <h2>One AI. Two Worlds.<br/>Infinite Impact.</h2>
            <p className="impact-description">
              Personal users get a voice guardian that knows them. Companies get an AI workforce 
              that scales infinitely. Same architecture, different superpowers.
            </p>
          </div>
        </div>
      </section>

      {/* Perspective Toggle */}
      <div className="perspective-toggle">
        <button
          className={`perspective-btn ${perspective === 'personal' ? 'active' : ''}`}
          onClick={() => setPerspective('personal')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          For People
        </button>
        <button
          className={`perspective-btn ${perspective === 'enterprise' ? 'active' : ''}`}
          onClick={() => setPerspective('enterprise')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          For Enterprise
        </button>
      </div>

      {/* Personal Use Cases */}
      {perspective === 'personal' && (
        <section className="usecases-grid">
          {personalUseCases.map((uc) => (
            <div key={uc.title} className="card usecase-card">
              <div className="usecase-icon">{uc.icon}</div>
              <h3>{uc.title}</h3>
              <p>{uc.desc}</p>
              <div className="usecase-example">
                <strong>Example:</strong>
                <p>{uc.example}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Enterprise Use Cases */}
      {perspective === 'enterprise' && (
        <section className="ent-grid">
          {enterpriseUseCases.map((uc) => (
            <div key={uc.title} className="card ent-card">
              <div className="ent-top">
                <div className="usecase-icon">{uc.icon}</div>
                <span className="ent-category">{uc.category}</span>
              </div>
              <h3>{uc.title}</h3>
              <p>{uc.desc}</p>
              <div className="ent-features">
                {uc.features.map((f) => (
                  <span key={f} className="ent-feature">{f}</span>
                ))}
              </div>
              <div className="ent-metric">
                <strong>{uc.metric}</strong>
                <span>{uc.metricLabel}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      <section className="ent-cta">
        <div className="card glass-premium" style={{ padding: '48px 32px' }}>
          <h2>Ready to Deploy Looca?</h2>
          <p>Whether you&apos;re a village health worker or a Fortune 500 CTO — same intelligence, different scale.</p>
          <div className="hero-actions">
            <Link className="btn-grand btn-primary" href="/agent">
              <span>Try Voice Agent</span>
            </Link>
            <Link className="btn-grand btn-secondary" href="/architecture">
              <span>View Architecture</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tab = 'tiers' | 'callflow' | 'seventh';

const tiers = [
  {
    id: 'tier1',
    badge: 'Tier 1',
    label: 'Connectivity Fabric',
    symbol: '◈',
    color: '#7cdbff',
    items: [
      {
        name: 'Cognitive Mesh Radio Network',
        tag: 'Infrastructure',
        symbol: '◈',
        desc: 'Every phone becomes a relay node. Voice hops across devices till it reaches internet. No tower needed — the people ARE the network.',
        metrics: [
          { label: 'Multi-Hop', detail: 'Voice relays device-to-device' },
          { label: 'Self-Healing', detail: 'Routes around dead nodes' },
          { label: 'Zero Infra', detail: 'No cell towers required' },
        ],
      },
      {
        name: 'USSD-Voice Hybrid for ₹500 Phones',
        tag: 'Offline Access',
        symbol: '◉',
        desc: 'Works on basic keypad phones with zero internet using USSD audio channels. Reaches the most disconnected communities.',
        metrics: [
          { label: '₹500 Phones', detail: 'Keypad-only devices' },
          { label: 'USSD Channels', detail: 'Audio over GSM signaling' },
          { label: 'Zero Data', detail: 'No internet needed' },
        ],
      },
      {
        name: 'Phantom Signal Architecture',
        tag: 'Dead Zone Fix',
        symbol: '◎',
        desc: 'Matchbox-sized SDR repeaters on trees/poles create local radio coverage from nothing.',
        metrics: [
          { label: 'Matchbox-Sized', detail: 'SDR repeater hardware' },
          { label: 'Tree/Pole Mount', detail: 'Deploy in any terrain' },
          { label: 'Local Coverage', detail: 'Radio mesh from nothing' },
        ],
      },
    ],
  },
  {
    id: 'tier2',
    badge: 'Tier 2',
    label: 'Distributed Intelligence',
    symbol: '◑',
    color: '#8b5cf6',
    items: [
      {
        name: 'Federated Dialect Emergence Engine',
        tag: 'Language AI',
        symbol: '◑',
        desc: 'Model continuously learns Bhojpuri, Chhattisgarhi, Tanglish from live usage — zero annotation needed. The more people speak, the smarter it gets.',
        metrics: [
          { label: 'Live Learning', detail: 'Dialects emerge from usage' },
          { label: 'Zero Annotation', detail: 'No manual labeling' },
          { label: '22+ Languages', detail: 'All Indian scheduled languages' },
        ],
      },
      {
        name: 'Voice Biometric Sovereign Identity',
        tag: 'Identity',
        symbol: '◐',
        desc: 'Your voice IS your Aadhaar. No passwords, no documents, no card — just speak. Biometric authentication through vocal patterns.',
        metrics: [
          { label: 'Voice = ID', detail: 'No passwords ever' },
          { label: 'Anti-Spoof', detail: 'Liveness detection built-in' },
          { label: 'Aadhaar-Grade', detail: 'Government-compliant security' },
        ],
      },
      {
        name: 'Anticipatory Pre-cache Intelligence',
        tag: 'Offline First',
        symbol: '◒',
        desc: 'Before your appointment, everything you\'ll need is already downloaded offline on your phone. Predictive caching based on calendar + context.',
        metrics: [
          { label: 'Pre-emptive', detail: 'Caches before you need it' },
          { label: 'Calendar-Aware', detail: 'Knows your schedule' },
          { label: 'Zero Latency', detail: 'Offline-ready always' },
        ],
      },
    ],
  },
  {
    id: 'tier3',
    badge: 'Tier 3',
    label: 'Cognitive AGI Layer',
    symbol: '⬡',
    color: '#34d399',
    items: [
      {
        name: 'Proactive Cognitive Guardian',
        tag: 'Autonomous Agency',
        symbol: '⬡',
        desc: 'Looca calls YOU. It monitors deadlines, eligibility, health signals — and acts before you even know you need help.',
        metrics: [
          { label: 'Outbound Calls', detail: 'Looca initiates contact' },
          { label: 'Deadline Watch', detail: 'Never miss a cutoff' },
          { label: 'Health Signals', detail: 'Proactive wellness checks' },
        ],
      },
      {
        name: 'Swarm Intelligence Resource Router',
        tag: 'Multi-Agent',
        symbol: '⬢',
        desc: 'Hundreds of Looca agents coordinate in real time — if hospital A is full, the swarm finds B, C, or the nearest NGO in 2 seconds.',
        metrics: [
          { label: 'Swarm Coord', detail: '100s of agents in parallel' },
          { label: '2-Second Route', detail: 'Real-time resource finding' },
          { label: 'NGO Network', detail: 'Connected to aid ecosystem' },
        ],
      },
      {
        name: 'Predictive Bureaucracy Navigator',
        tag: 'Behavioral AI',
        symbol: '⬟',
        desc: 'Knows that the ration office has a 2-hour queue Monday 9am but zero queue Thursday 3pm — from collective anonymized data.',
        metrics: [
          { label: 'Queue Prediction', detail: 'Anonymized crowd data' },
          { label: 'Best-Time Tips', detail: 'When to visit offices' },
          { label: 'Collective Intel', detail: 'Community-sourced patterns' },
        ],
      },
      {
        name: 'Cognitive Load Adaptive Interface',
        tag: 'Accessibility AI',
        symbol: '⬠',
        desc: 'Measures confusion in real time from voice patterns and dynamically adjusts complexity of language. 5 levels of adaptation.',
        metrics: [
          { label: '5 Complexity Levels', detail: 'Dynamic language model' },
          { label: 'Confusion Detection', detail: 'Voice prosody analysis' },
          { label: 'Dementia Protocol', detail: 'Special memory care mode' },
        ],
      },
    ],
  },
  {
    id: 'tier4',
    badge: 'Tier 4',
    label: 'ASI Vision',
    symbol: '★',
    color: '#fbbf24',
    items: [
      {
        name: 'Temporal Context Intelligence',
        tag: 'World Model',
        symbol: '★',
        desc: 'Knows it\'s monsoon season, Diwali next week, and elections in 6 weeks — and proactively shifts what it knows you need.',
        metrics: [
          { label: 'Seasonal AI', detail: 'Context-aware by default' },
          { label: 'Cultural Events', detail: 'Festival + election cycles' },
          { label: 'Proactive Shift', detail: 'Anticipates needs' },
        ],
      },
      {
        name: 'Multi-Modal Ambient Intelligence',
        tag: 'Beyond Voice',
        symbol: '✦',
        desc: 'Shake phone = emergency. Baby crying in background = suggest pediatrician. Photo of form = Looca reads and fills it for you.',
        metrics: [
          { label: 'Shake → SOS', detail: 'Gestural emergency trigger' },
          { label: 'Ambient Audio', detail: 'Background sound analysis' },
          { label: 'Vision OCR', detail: 'Photo-to-form filling' },
        ],
      },
      {
        name: 'Neuromorphic Edge AI Chips',
        tag: 'Hardware ASI',
        symbol: '✧',
        desc: 'Brain-inspired chips run full NLP inference on ₹800 phones at 1mW — completely offline, permanent intelligence.',
        metrics: [
          { label: '1mW Inference', detail: 'Brain-inspired chips' },
          { label: '₹800 Phones', detail: 'Ultra-low-cost hardware' },
          { label: 'Full Offline', detail: 'Permanent on-device AI' },
        ],
      },
      {
        name: 'Cognitive Time Banking Network',
        tag: 'Human-AI Economy',
        symbol: '✩',
        desc: 'Villagers who help others navigate services earn time credits — redeemable for extra Looca services, creating a self-sustaining human-AI economy.',
        metrics: [
          { label: 'Time Credits', detail: 'Earn by helping others' },
          { label: 'Self-Sustaining', detail: 'Community-driven economy' },
          { label: 'Redeemable', detail: 'Extra Looca services' },
        ],
      },
    ],
  },
];

const seventhSense = [
  {
    id: '01',
    name: 'Psychoacoustic Pre-verbal Emotion Engine',
    stack: 'VAPI + Claude',
    desc: 'Reads fear, confusion, urgency from voice prosody BEFORE words are processed. Claude adapts its entire response strategy in the first 50ms.',
    detail: 'VAPI gives raw audio in parallel with STT via call.media. We run prosody analysis on the audio stream before Deepgram finishes transcription. Claude receives an emotion vector alongside the transcript — fear=0.8, confusion=0.6, urgency=0.3 — and adapts tone, pace, and complexity instantly.',
  },
  {
    id: '02',
    name: 'Episodic Qdrant Memory with Temporal Decay',
    stack: 'Qdrant + Claude',
    desc: 'Every call is stored as a semantic episode. Next call, Claude already knows 3 months of your history. Memory fades naturally like human memory.',
    detail: '4 Qdrant collections: services (sparse+dense hybrid RAG), episodes (temporal memory with recency boost), health_timeline (time-series scrolling), offline_cache (edge subset). Voyage-3 embeddings + upsert on every call.ended webhook. Recency boost ensures recent episodes rank higher — old memories fade naturally.',
  },
  {
    id: '03',
    name: 'Predictive Intent Pre-loader',
    stack: 'VAPI + Qdrant + Redis',
    desc: 'Before the user speaks a word, Looca predicts 3 likely call reasons and pre-fetches all Qdrant chunks into Redis. First response in under 200ms.',
    detail: 'VAPI call.started webhook fires BEFORE the user speaks. We query Qdrant for this user\'s top 3 recent topics, pre-load all relevant chunks into Redis. When STT completes, Claude already has context — zero retrieval latency. Judges will feel the speed difference.',
  },
  {
    id: '04',
    name: 'VAPI Action Agent — Claude tool_use Does Real Bookings',
    stack: 'VAPI + Claude Sonnet + APIs',
    desc: 'Looca doesn\'t answer "how to book" — it books. VAPI routes to Claude Sonnet with real tool_use. One voice command → actual appointment confirmed.',
    detail: 'Claude Sonnet with tool_use: book_appointment(hospital, date, dept), check_bed_availability(hospital), find_nearest_ngo(service_type). VAPI function_calling routes these to real APIs. The user says "book me at AIIMS" and gets a confirmation number — not instructions.',
  },
  {
    id: '05',
    name: 'Causal Knowledge Graph — Qdrant + FalkorDB',
    stack: 'Qdrant + FalkorDB + Claude',
    desc: 'Qdrant finds WHAT is relevant. FalkorDB tracks WHY things happen and what fixes them. Together they give Claude reasoning that RAG alone cannot.',
    detail: 'Qdrant handles semantic similarity (WHAT documents match). FalkorDB handles causal chains (WHY was this form rejected → missing address proof → HOW to fix). Claude gets both retrieval + reasoning. This is the difference between "here\'s a document" and "here\'s why this happened and exactly what to do".',
  },
  {
    id: '06',
    name: 'Longitudinal Health Trajectory via Time-Series Qdrant',
    stack: 'Qdrant + Claude + Celery',
    desc: 'Symptom mentions across months of calls are tracked as vectors. When patterns escalate, Looca makes a proactive outbound VAPI call — before the user knows they need help.',
    detail: 'Every health mention is embedded and stored in health_timeline collection with timestamp. Celery background job runs trend analysis — if symptom frequency/severity vector drifts toward escalation, trigger outbound VAPI call. "I noticed you\'ve mentioned chest discomfort 3 times this month. Shall I connect you to a doctor?"',
  },
  {
    id: '07',
    name: 'Zero-Shot Service Auto-Ingestion Pipeline',
    stack: 'Qdrant + Claude + Playwright',
    desc: 'New scheme announced at 9am. By 9:15am every Looca user can ask about it in their language. Zero human intervention, zero retraining — pure automated RAG.',
    detail: 'Playwright scrapes government scheme pages on schedule. Claude auto-generates structured knowledge docs from raw HTML. Voyage-3 embeds → upsert to Qdrant services collection. From announcement to queryable in <15 minutes. No retraining, no annotation, no human in the loop.',
  },
];

export default function ArchitecturePage() {
  const [tab, setTab] = useState<Tab>('tiers');
  const [expandedTier, setExpandedTier] = useState<string | null>('tier1');
  const [expandedSense, setExpandedSense] = useState<string | null>(null);

  return (
    <main className="page-grid">
      <section className="arch-hero">
        <div className="card glass-premium" style={{ padding: '40px 32px' }}>
          <div className="wave-container">
            <div className="wave-layer l1"></div>
            <div className="wave-layer l2"></div>
          </div>
          <div className="impact-header">
            <span className="pill-success">AGI/ASI Architecture</span>
            <h2>Looca Intelligence<br/>Blueprint</h2>
            <p className="impact-description">
              4 tiers of connectivity, intelligence, cognition, and superintelligence.
              7 AGI senses built on VAPI + Qdrant + Claude. Click any idea to go deep.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="arch-tabs">
        <button className={`arch-tab ${tab === 'tiers' ? 'active' : ''}`} onClick={() => setTab('tiers')}>
          <span className="arch-tab-icon">⬡</span> 4 Tiers
        </button>
        <button className={`arch-tab ${tab === 'callflow' ? 'active' : ''}`} onClick={() => setTab('callflow')}>
          <span className="arch-tab-icon">⚡</span> Call Flow
        </button>
        <button className={`arch-tab ${tab === 'seventh' ? 'active' : ''}`} onClick={() => setTab('seventh')}>
          <span className="arch-tab-icon">★</span> 7th Sense
        </button>
      </div>

      {/* TIERS TAB */}
      {tab === 'tiers' && (
        <section className="tiers-container">
          {tiers.map((tier) => (
            <div key={tier.id} className="tier-section">
              <div
                className="tier-header clickable"
                onClick={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
              >
                <div className="tier-header-left">
                  <span className="tier-badge" style={{ background: `${tier.color}20`, color: tier.color, borderColor: `${tier.color}40` }}>
                    {tier.badge}
                  </span>
                  <h2>{tier.label}</h2>
                </div>
                <span className="tier-expand">{expandedTier === tier.id ? '▾' : '▸'}</span>
              </div>

              {expandedTier === tier.id && (
                <div className="tier-grid">
                  {tier.items.map((item) => (
                    <div key={item.name} className="card tier-card">
                      <div className="tier-symbol-lg" style={{ color: tier.color }}>{item.symbol}</div>
                      <h3>{item.name}</h3>
                      <span className="tier-label" style={{ background: `${tier.color}15`, color: tier.color, borderColor: `${tier.color}30` }}>{item.tag}</span>
                      <p>{item.desc}</p>
                      <div className="tier-metrics">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="tier-metric">
                            <strong>{m.label}</strong>
                            <span>{m.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Cognitive Load Deep Dive */}
          <div className="card deep-dive-card">
            <div className="deep-dive-header">
              <span className="tier-badge" style={{ background: '#34d39920', color: '#34d399', borderColor: '#34d39940' }}>Deep Dive</span>
              <h3>Cognitive Load Adaptive Interface</h3>
            </div>
            <div className="deep-dive-content">
              <div className="deep-dive-text">
                <p className="deep-dive-problem">
                  The unsolved accessibility problem: Standard AI assistants speak the same way to a PhD and a first-generation phone user. 
                  This is not accessibility — it&apos;s a digital literacy barrier dressed as a feature.
                </p>
                <h4>Looca&apos;s cognitive load model — real-time confusion signals from voice:</h4>
                <ul className="deep-dive-list">
                  <li><strong>Response latency</strong> — long pauses = confusion</li>
                  <li><strong>Repetition patterns</strong> — &quot;what did you say?&quot;</li>
                  <li><strong>Hesitation markers</strong> — &quot;uh... um...&quot;</li>
                  <li><strong>Interruption frequency</strong></li>
                  <li><strong>Confirmation failures</strong> — &quot;No, that&apos;s not what I meant&quot;</li>
                </ul>
                <h4>Dynamic language adaptation:</h4>
                <ul className="deep-dive-list">
                  <li><strong>High confusion:</strong> Single-step instructions, slower speech, local dialect words</li>
                  <li><strong>Low confusion:</strong> Full information, multiple options, faster pace</li>
                  <li><strong>Detected stress:</strong> Trembling voice / fast heartbeat via band → &quot;calm mode&quot; with slower, reassuring tone</li>
                </ul>
                <h4>Special protocols:</h4>
                <ul className="deep-dive-list">
                  <li><strong>Dementia users:</strong> No overwhelming choices, repetition is expected, family sets &quot;simplicity level&quot; in advance, AI remembers what was asked 5 minutes ago</li>
                  <li><strong>First-time digital users:</strong> Micro-tutorial mode — explains what it&apos;s doing at each step so the user builds mental models over time</li>
                </ul>
              </div>
              <div className="deep-dive-viz">
                <div className="cognitive-viz">
                  <div className="cog-level" data-level="5"><span>Level 5</span><small>Full complexity</small></div>
                  <div className="cog-level" data-level="4"><span>Level 4</span><small>Standard</small></div>
                  <div className="cog-level" data-level="3"><span>Level 3</span><small>Simplified</small></div>
                  <div className="cog-level" data-level="2"><span>Level 2</span><small>Single-step</small></div>
                  <div className="cog-level" data-level="1"><span>Level 1</span><small>Calm mode</small></div>
                </div>
                <div className="cog-sensors">
                  <div className="cog-sensor"><span className="cog-dot live"></span> Voice Prosody Analysis</div>
                  <div className="cog-sensor"><span className="cog-dot live"></span> Real-time Confusion Detection</div>
                  <div className="cog-sensor"><span className="cog-dot live"></span> Dynamic Language Model</div>
                  <div className="cog-sensor"><span className="cog-dot"></span> Stress Voice Detection</div>
                  <div className="cog-sensor"><span className="cog-dot"></span> Dementia Protocol</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CALL FLOW TAB */}
      {tab === 'callflow' && (
        <section className="callflow-container">
          <div className="card callflow-card">
            <h3>Live VAPI Call Flow — What Happens Every Millisecond</h3>
            <div className="callflow-main">
              <div className="cf-step"><div className="cf-node user">User<br/><small>Any phone</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node twilio">Twilio<br/><small>PSTN / SIP</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node vapi">VAPI Session<br/><small>Call orchestrator</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node stt">Deepgram STT<br/><small>Hindi / 22 langs</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node langchain">LangGraph<br/><small>Agent state machine<br/>Claude Haiku &lt;500ms</small></div></div>
              <div className="cf-bidirectional">↔</div>
              <div className="cf-step"><div className="cf-node qdrant">Qdrant RAG<br/><small>Semantic memory<br/>+ Claude Sonnet<br/>Complex tasks</small></div></div>
            </div>
            <div className="callflow-output">
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node tools">Tool Calls<br/><small>Book / Submit / Fetch</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node tts">VAPI TTS<br/><small>Azure Neural voice</small></div></div>
            </div>
          </div>

          <div className="card callflow-card">
            <h3>Background — Fires in Parallel on Every VAPI Call</h3>
            <div className="callflow-bg">
              <div className="cf-step"><div className="cf-node webhook">VAPI Webhook<br/><small>call.started / ended</small></div></div>
              <div className="cf-arrow">→</div>
              <div className="cf-step"><div className="cf-node fastapi">FastAPI Handler<br/><small>async Python</small></div></div>
              <div className="cf-branch">
                <div className="cf-branch-item">
                  <div className="cf-arrow">→</div>
                  <div className="cf-node qdrant-sm">Qdrant Episodic Write<br/><small>voyage-3 embed + upsert</small></div>
                </div>
                <div className="cf-branch-item">
                  <div className="cf-arrow">→</div>
                  <div className="cf-node celery">Celery Tasks<br/><small>Reminders / follow-ups</small></div>
                </div>
                <div className="cf-branch-item">
                  <div className="cf-arrow">→</div>
                  <div className="cf-node postgres">PostgreSQL<br/><small>Booking + audit log</small></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card pitch-card">
            <h3>The Pitch That Wins</h3>
            <blockquote className="pitch-quote">
              &quot;Every other voice AI waits for you to ask. Looca knew you were coming — it read your 
              emotional state before you spoke, pre-loaded your context while the phone was still ringing, 
              and already had your appointment half-booked by the time you finished your sentence.&quot;
            </blockquote>
            <div className="pitch-priorities">
              <h4>Immediate Build Priorities for Demo:</h4>
              <div className="priority-item">
                <span className="priority-num">1</span>
                <span>Wire VAPI call.started → Redis pre-load — most visible latency win</span>
              </div>
              <div className="priority-item">
                <span className="priority-num">2</span>
                <span>Add Claude tool_use for one real action (find nearest hospital) — shows it&apos;s an agent, not a chatbot</span>
              </div>
              <div className="priority-item">
                <span className="priority-num">3</span>
                <span>Show episodic memory callback live — &quot;returning user&quot; scenario where Looca says &quot;Last time you called about X...&quot;</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7TH SENSE TAB */}
      {tab === 'seventh' && (
        <section className="seventh-container">
          <div className="seventh-intro">
            <span className="tier-badge" style={{ background: '#fbbf2420', color: '#fbbf24', borderColor: '#fbbf2440' }}>7th Sense</span>
            <h2>7 AGI Ideas Built on VAPI + Qdrant + Claude</h2>
            <p>Click any idea card to expand the full technical implementation.</p>
          </div>

          <div className="seventh-grid">
            {seventhSense.map((idea) => (
              <div
                key={idea.id}
                className={`card sense-card ${expandedSense === idea.id ? 'expanded' : ''}`}
                onClick={() => setExpandedSense(expandedSense === idea.id ? null : idea.id)}
              >
                <div className="sense-header">
                  <span className="sense-num">{idea.id}</span>
                  <div>
                    <h3>{idea.name}</h3>
                    <span className="sense-stack">{idea.stack}</span>
                  </div>
                </div>
                <p className="sense-desc">{idea.desc}</p>
                {expandedSense === idea.id && (
                  <div className="sense-detail">
                    <div className="sense-detail-label">Technical Implementation</div>
                    <p>{idea.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link className="btn-grand btn-primary" href="/agent" style={{ display: 'inline-flex' }}>
          <span>Launch Voice Agent</span>
        </Link>
        <Link className="btn-grand btn-secondary" href="/upgrade" style={{ display: 'inline-flex', marginLeft: 16 }}>
          <span>See Personal Plans</span>
        </Link>
      </div>
    </main>
  );
}

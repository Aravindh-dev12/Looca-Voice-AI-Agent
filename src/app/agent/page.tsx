import { VoiceWidget } from '@/components/VoiceWidget';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import seedDocs from '../../../data/seed-docs.json' with { type: 'json' };

async function getAgentData() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  
  const categories = [...new Set(seedDocs.map((doc: any) => doc.category))];
  
  return { conversations, categories, seedDocs };
}

const categoryLabels: Record<string, string> = {
  healthcare: 'Clinic & Health',
  education: 'Education & Literacy',
  'public-services': 'Public Services',
  finance: 'Sustainability & Finance',
};

const categoryColors: Record<string, string> = {
  healthcare: '#10b981',
  education: '#3b82f6',
  'public-services': '#f59e0b',
  finance: '#8b5cf6',
};

export default async function AssistantPage() {
  const { conversations, categories, seedDocs } = await getAgentData();

  return (
    <main className="page-grid">
      <section className="card section">
        <div className="pill-success">Interactive Assistant</div>
        <h2 style={{ fontSize: 32, margin: '14px 0 6px' }}>Talk with Looca</h2>
        <p className="muted" style={{ maxWidth: 820 }}>
          This is the primary interaction point. Speak clearly to the assistant to get support or 
          guidance. Qdrant-backed memory is automatically used to provide context-aware responses.
        </p>
      </section>

      <section className="columns-2">
        <div className="card panel">
           <h3>Voice Interaction</h3>
           <p className="muted" style={{ marginBottom: 20 }}>
             Press the button below to start a live session.
           </p>
           <VoiceWidget />
           
           <div className="small-card" style={{ marginTop: 30 }}>
             <h4>Instructions</h4>
             <ul className="muted" style={{ paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
               <li>State your request clearly.</li>
               <li>Ask about specific services (e.g., "Healthcare").</li>
               <li>The assistant will simplify complex steps for you.</li>
             </ul>
           </div>
        </div>

        <div className="card panel">
          <h3>Recent Support Logs</h3>
          <p className="muted" style={{ marginBottom: 20 }}>
            Available support categories and recent interactions.
          </p>
          
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, color: '#94a3b8' }}>Support Categories</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map((cat: string) => (
                <span
                  key={cat}
                  style={{
                    background: `${categoryColors[cat] || '#64748b'}20`,
                    color: categoryColors[cat] || '#94a3b8',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1px solid ${categoryColors[cat] || '#64748b'}40`,
                  }}
                >
                  {categoryLabels[cat] || cat}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, color: '#94a3b8' }}>Interaction History</h4>
            <div className="list">
              {conversations.map((convo: any) => (
                <div key={convo.id} className="list-item">
                  <div>
                    <strong>{convo.userName || 'Visitor'}</strong>
                    <div className="subtle">
                      {convo.issueType || 'General'} • {convo.language.toUpperCase()}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13 }}>
                      {convo.summary || 'Consultation in progress...'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <span className={`status-pill ${convo.status}`}>
                       {convo.status}
                     </span>
                     <div style={{ marginTop: 4 }}>
                       <small>{formatDate(convo.createdAt)}</small>
                     </div>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="muted" style={{ textAlign: 'center', padding: '20px' }}>
                  No interaction history yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

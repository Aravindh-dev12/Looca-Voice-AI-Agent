import { prisma } from '@/lib/prisma';
import { KnowledgePanel } from '@/components/KnowledgePanel';
import { safeJsonParse } from '@/lib/utils';
import { qdrantReady } from '@/lib/qdrant';
import seedDocs from '../../../data/seed-docs.json' with { type: 'json' };

export const dynamic = 'force-dynamic';

async function getDocs() {
  const docs = await prisma.knowledgeDoc.findMany({ orderBy: { createdAt: 'desc' } });
  return docs.map((doc: any) => ({
    ...doc,
    tags: safeJsonParse<string[]>(doc.tagsJson, []),
  }));
}

const categoryStats = () => {
  const cats = seedDocs.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(cats);
};

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

export default async function KnowledgePage() {
  const docs = await getDocs();
  const ready = await qdrantReady();
  const stats = categoryStats();

  return (
    <main className="page-grid">
      <section className="card section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div className="pill" style={{ 
            background: ready ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
            color: ready ? '#a7f3d0' : '#fda4af',
            borderColor: ready ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)',
          }}>
            {ready ? '● Qdrant Ready' : '● Qdrant Offline'}
          </div>
        </div>
        
        <h2 style={{ fontSize: 32, margin: '0 0 12px 0' }}>Knowledge Base</h2>
        <p className="muted" style={{ maxWidth: 820, fontSize: 15, lineHeight: 1.6 }}>
          Semantic memory layer for contextual AI responses. Documents are grouped by category 
          and vectorized for intelligent retrieval.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 16,
          marginTop: 24,
        }}>
          {stats.map(([cat, count]) => (
            <div key={cat} style={{
              padding: 20,
              borderRadius: 20,
              background: 'rgba(148, 163, 184, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${categoryColors[cat] || '#64748b'}15`,
                border: `1px solid ${categoryColors[cat] || '#64748b'}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {cat === 'healthcare' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={categoryColors[cat]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                )}
                {cat === 'education' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={categoryColors[cat]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                )}
                {cat === 'public-services' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={categoryColors[cat]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                )}
                {cat === 'finance' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={categoryColors[cat]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#e5eefb', lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                  {categoryLabels[cat] || cat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card section">
        <KnowledgePanel docs={seedDocs.map((d, i) => ({ ...d, id: String(i), tags: d.tags }))} />
      </section>
    </main>
  );
}

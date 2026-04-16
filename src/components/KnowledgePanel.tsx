import { clampText } from '@/lib/utils';

type Doc = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags?: string[];
  source?: string | null;
};

const categoryColors: Record<string, string> = {
  healthcare: '#10b981',
  education: '#3b82f6',
  'public-services': '#f59e0b',
  finance: '#8b5cf6',
};

const categoryLabels: Record<string, string> = {
  healthcare: 'Clinic & Health',
  education: 'Education & Literacy',
  'public-services': 'Public Services',
  finance: 'Sustainability & Finance',
};

export function KnowledgePanel({ docs }: { docs: Doc[] }) {
  const grouped = docs.reduce((acc, doc) => {
    const cat = doc.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, Doc[]>);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {Object.entries(grouped).map(([category, categoryDocs]) => (
        <div key={category}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16 
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `${categoryColors[category] || '#64748b'}15`,
              border: `1px solid ${categoryColors[category] || '#64748b'}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {category === 'healthcare' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={categoryColors[category]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              )}
              {category === 'education' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={categoryColors[category]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              )}
              {category === 'public-services' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={categoryColors[category]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              )}
              {category === 'finance' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={categoryColors[category]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              )}
            </div>
            <h4 style={{ 
              margin: 0, 
              fontSize: 13, 
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: categoryColors[category] || '#94a3b8',
            }}>
              {categoryLabels[category] || category}
            </h4>
            <span style={{
              padding: '4px 10px',
              borderRadius: 12,
              background: 'rgba(148, 163, 184, 0.1)',
              fontSize: 12,
              color: '#64748b',
            }}>
              {categoryDocs.length}
            </span>
          </div>
          
          <div style={{ display: 'grid', gap: 12 }}>
            {categoryDocs.map((doc) => (
              <div 
                key={doc.id} 
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: 'rgba(148, 163, 184, 0.05)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#e5eefb',
                    }}>
                      {doc.title}
                    </h5>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 13, 
                      lineHeight: 1.6,
                      color: '#94a3b8',
                    }}>
                      {clampText(doc.content, 140)}
                    </p>
                    {doc.source && (
                      <p style={{
                        margin: '10px 0 0 0',
                        fontSize: 11,
                        color: '#64748b',
                      }}>
                        Source: {doc.source}
                      </p>
                    )}
                  </div>
                </div>
                
                {doc.tags && doc.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                    {doc.tags.map((tag) => (
                      <span 
                        key={tag}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          background: 'rgba(124, 219, 255, 0.1)',
                          border: '1px solid rgba(124, 219, 255, 0.2)',
                          fontSize: 11,
                          color: '#7cdbff',
                          textTransform: 'lowercase',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

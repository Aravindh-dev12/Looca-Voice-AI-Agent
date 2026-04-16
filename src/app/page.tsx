import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/StatCard';
import { KnowledgePanel } from '@/components/KnowledgePanel';
import { formatDate } from '@/lib/utils';

async function getDashboardData() {
  const [conversations, knowledgeDocs, voiceSessions] = await Promise.all([
    prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { transcript: true },
    }),
    prisma.knowledgeDoc.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.voiceSession.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
  ]);

  return { conversations, knowledgeDocs, voiceSessions };
}

export default async function OverviewPage() {
  const { conversations, knowledgeDocs } = await getDashboardData();
  const multilingualDocs = knowledgeDocs.filter((doc: any) => doc.language !== 'en').length;

  return (
    <main className="page-grid">
      <section className="hero-full">
        <div className="card glass-premium">
          <div className="wave-container">
            <div className="wave-layer l1"></div>
            <div className="wave-layer l2"></div>
            <div className="wave-layer l3"></div>
          </div>
          <div className="impact-header">
            <span className="pill-success">Societal Impact Project</span>
            <h2>Bridging the Digital Divide with <br/>Voice AI</h2>
            <p className="impact-description">
              Our mission is to provide equal access to essential services. For people facing 
              literacy challenges, visual impairments, or linguistic barriers, this voice-first 
              interface acts as a bridge to healthcare, legal aid, and public welfare.
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-box">
              <h3>{knowledgeDocs.length}</h3>
              <p>Knowledge Clusters in Qdrant</p>
            </div>
            <div className="hero-stat-box">
              <h3>{multilingualDocs}+</h3>
              <p>Languages Supported</p>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="btn-grand btn-primary" href="/agent">
              <span>Get Started</span>
            </Link>
            <Link className="btn-grand btn-secondary" href="/knowledge">
              <span>View Knowledge Graph</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="impact-grid">
        <div className="card impact-card">
          <div className="icon-wrap info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Contextual Understanding</h3>
          <p>Powered by Qdrant, the AI remembers user needs and retrieves specific service documentation based on semantic meaning rather than just keywords.</p>
        </div>
        <div className="card impact-card">
          <div className="icon-wrap help">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>Low-Literacy Design</h3>
          <p>No complex menus or forms. Users interact through natural speech, getting simple, step-by-step oral guidance for complex tasks.</p>
        </div>
        <div className="card impact-card">
          <div className="icon-wrap glob">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h3>Adaptive Response</h3>
          <p>Whether it's healthcare navigation or public school registration, the agent adapts its tone and complexity to match the user's comfort level.</p>
        </div>
      </section>

      <footer className="grand-footer">
        <div className="footer-tagline">
          Empowering Every Voice with Inclusive & Intentional AI
        </div>
        
        <h1 className="footer-logo-massive">LOOCA</h1>

        <div className="footer-content">
          <div className="footer-info">
            <div className="info-group">
               <h4>Mission</h4>
               <p>Accessibility-first voice AI designed to bridge the gap between complex digital systems and essential human needs.</p>
            </div>
            <div className="info-group">
               <h4>Expertise</h4>
               <p>Specializing in low-literacy interfaces, multilingual support, and contextual memory for societal impact.</p>
            </div>
            <div className="info-group">
               <h4>Connect</h4>
               <p>Building the future of inclusive technology. Part of the Global Voice AI Challenge 2026.</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 Looca Voice AI Platform. Built for Societal Impact.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

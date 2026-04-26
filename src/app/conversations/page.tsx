import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ConversationsPage() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { transcript: true },
  });

  return (
    <main className="page-grid">
      <section className="card section">
        <div className="pill">Conversation history</div>
        <h3 style={{ fontSize: 28, marginTop: 10 }}>Calls and transcripts</h3>
        <p className="muted">
          Every conversation can be reviewed for quality, escalation, and support follow-up.
        </p>
      </section>

      <section className="card section">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Language</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((convo) => (
              <tr key={convo.id}>
                <td>{convo.userName || 'Anonymous'}</td>
                <td>{convo.issueType || 'General'}</td>
                <td>{convo.status}</td>
                <td>{convo.language.toUpperCase()}</td>
                <td>{formatDate(convo.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="columns-2">
        {conversations.map((convo) => (
          <div key={convo.id} className="card section">
            <h3>{convo.userName || 'Anonymous'} • {convo.issueType || 'General'}</h3>
            <p className="muted">{convo.summary || 'No summary provided.'}</p>
            <div className="list" style={{ marginTop: 12 }}>
              {convo.transcript.map((message) => (
                <div key={message.id} className="list-item">
                  <div>
                    <strong>{message.role}</strong>
                    <div style={{ marginTop: 6 }}>{message.content}</div>
                  </div>
                  <small>{formatDate(message.createdAt)}</small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

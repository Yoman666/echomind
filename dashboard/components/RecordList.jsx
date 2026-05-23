function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function RecordList({ records }) {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        No records yet. Send a message to your LINE bot to get started.
      </div>
    );
  }

  return (
    <section className="record-list">
      {records.map((record) => {
        const tags = normalizeTags(record.tags);

        return (
          <article key={record.id} className="record-card">
            <div className="record-top">
              <h2 className="record-title">{record.title}</h2>
              <time className="record-date" dateTime={record.created_at}>
                {formatDate(record.created_at)}
              </time>
            </div>
            <span className={`type-badge type-${record.type}`}>{record.type}</span>
            <p className="record-content">{record.content}</p>
            <div className="record-meta">
              {record.amount != null && (
                <span className="amount">${Number(record.amount).toLocaleString()}</span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}

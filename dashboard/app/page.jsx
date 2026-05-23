import './globals.css';
import { getRecords, RECORD_TYPES } from '@/lib/records';
import TypeFilter from '@/components/TypeFilter';
import RecordList from '@/components/RecordList';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const typeParam = (await searchParams)?.type;
  const activeType =
    typeParam && RECORD_TYPES.includes(typeParam) ? typeParam : 'all';

  let records = [];
  let error = null;

  try {
    records = await getRecords({
      type: activeType === 'all' ? undefined : activeType,
      limit: 50,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load records';
  }

  return (
    <main>
      <header>
        <h1>LifeFlow</h1>
        <p>Latest life entries from LINE</p>
      </header>

      <TypeFilter activeType={activeType} />

      {error ? (
        <div className="error-state">{error}</div>
      ) : (
        <>
          <p className="summary">
            Showing {records.length} latest{' '}
            {activeType === 'all' ? 'entries' : `${activeType} entries`}
          </p>
          <RecordList records={records} />
        </>
      )}
    </main>
  );
}

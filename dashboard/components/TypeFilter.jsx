import Link from 'next/link';
import { RECORD_TYPES } from '@/lib/records';

const LABELS = {
  all: 'All',
  expense: 'Expense',
  mood: 'Mood',
  journal: 'Journal',
  learning: 'Learning',
};

export default function TypeFilter({ activeType = 'all' }) {
  const options = ['all', ...RECORD_TYPES];

  return (
    <nav className="filters" aria-label="Filter by type">
      {options.map((type) => {
        const href = type === 'all' ? '/' : `/?type=${type}`;
        const isActive = activeType === type;

        return (
          <Link
            key={type}
            href={href}
            className={`filter-link${isActive ? ' active' : ''}`}
          >
            {LABELS[type]}
          </Link>
        );
      })}
    </nav>
  );
}

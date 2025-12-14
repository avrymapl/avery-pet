'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function KawabaSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/kawaba/dictionary?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="search dictionary..."
        className="kawaba-search-input"
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-body)',
          fontSize: '0.9em',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </form>
  );
}

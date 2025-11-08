import { useState } from 'react';
import api from '../utils/api';

export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string) => {
    if (!q || q.trim().length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/pages/search', { params: { q } });
      // Combine pages and files into a single results array
      const pages = response.data.pages || [];
      const files = response.data.files || [];
      const combinedResults = [
        ...pages.map((page: any) => ({ ...page, type: 'page' })),
        ...files.map((file: any) => ({ ...file, type: 'file' })),
      ];
      setResults(combinedResults);
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, search };
}

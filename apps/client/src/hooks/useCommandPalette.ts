import { useState, useCallback, useEffect } from 'react';
import { usePages } from './usePages';
import { useSearch } from './useSearch';

interface CommandPaletteItem {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
  shortcut?: string;
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const { pages, createPage } = usePages();
  const { results: searchResults, search } = useSearch();

  const openPalette = useCallback(() => setIsOpen(true), []);
  const closePalette = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  // Load recent queries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearchQueries');
    if (stored) {
      setRecentQueries(JSON.parse(stored));
    }
  }, []);

  // Save recent queries to localStorage
  const saveRecentQuery = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentQueries.filter((q) => q !== query)].slice(
      0,
      5
    );
    setRecentQueries(updated);
    localStorage.setItem('recentSearchQueries', JSON.stringify(updated));
  };

  // Search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  }, [searchQuery, search]);

  const commands: CommandPaletteItem[] = [
    {
      id: 'new-page',
      label: 'Create new page',
      action: () => {
        createPage({});
        closePalette();
      },
      icon: '📄',
      shortcut: 'Ctrl+N',
    },
    ...pages.map((page) => ({
      id: `page-${page._id}`,
      label: page.title,
      action: () => {
        window.location.href = `/app/${page._id}`;
        closePalette();
      },
      icon: page.icon || '📄',
    })),
    ...searchResults.map((page) => ({
      id: `search-${page._id}`,
      label: page.title,
      action: () => {
        window.location.href = `/app/${page._id}`;
        saveRecentQuery(searchQuery);
        closePalette();
      },
      icon: page.icon || '🔍',
    })),
  ];

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    isOpen,
    searchQuery,
    setSearchQuery,
    commands: filteredCommands,
    openPalette,
    closePalette,
  };
}

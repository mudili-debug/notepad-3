import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../utils/api';

interface Page {
  _id: string;
  title: string;
  icon?: string;
  userId: string;
  blocks: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreatePageData {
  title?: string;
  icon?: string;
}

interface UpdatePageData {
  title?: string;
  icon?: string;
}

export function usePages() {
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const response = await api.get('/pages/all');
      // API returns an array of pages
      return response.data as Page[];
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: CreatePageData = {}) => {
      const response = await api.post('/pages', data);
      return response.data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePageData }) => {
      const response = await api.patch(`/pages/${id}`, data);
      return response.data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pages/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
    },
  });

  /** ============
   * RECENTLY VISITED PAGE TRACKING
   * ============ */
  const getRecentPages = (): Page[] => {
    const stored = localStorage.getItem('recentPages');
    return stored ? JSON.parse(stored) : [];
  };

  const addRecentPage = (page: Page) => {
    if (!page || !page._id) return;
    const current = getRecentPages();
    // Remove duplicates
    const filtered = current.filter((p) => p._id !== page._id);
    const updated = [page, ...filtered].slice(0, 10); // Keep max 10 items
    localStorage.setItem('recentPages', JSON.stringify(updated));
  };

  return {
    pages,
    isLoading,
    createPage: createPageMutation.mutate,
    updatePage: updatePageMutation.mutate,
    deletePage: deletePageMutation.mutate,
    createPageLoading: createPageMutation.isLoading,
    updatePageLoading: updatePageMutation.isLoading,
    deletePageLoading: deletePageMutation.isLoading,

    // New functions for recent page tracking
    getRecentPages,
    addRecentPage,
  };
}

export function usePage(id: string) {
  const queryClient = useQueryClient();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['pages', id],
    queryFn: async () => {
      const response = await api.get(`/pages/${id}`);
      return response.data as { page: Page; blocks: any[] };
    },
    enabled: !!id,
  });

  const updatePageMutation = useMutation({
    mutationFn: async (data: UpdatePageData) => {
      const response = await api.patch(`/pages/${id}`, data);
      return response.data.page as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      queryClient.invalidateQueries(['pages', id]);
    },
  });

  /** 🕒 Add visited page to recent list */
  useEffect(() => {
    if (pageData?.page) {
      const stored = localStorage.getItem('recentPages');
      const current = stored ? JSON.parse(stored) : [];
      const filtered = current.filter((p: Page) => p._id !== pageData.page._id);
      const updated = [pageData.page, ...filtered].slice(0, 10);
      localStorage.setItem('recentPages', JSON.stringify(updated));
    }
  }, [pageData]);

  return {
    page: pageData?.page,
    blocks: pageData?.blocks || [],
    isLoading,
    updatePage: updatePageMutation.mutate,
    updatePageLoading: updatePageMutation.isLoading,
  };
}

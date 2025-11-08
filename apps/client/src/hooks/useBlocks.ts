import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { BlockType } from '../utils/constants';
import { useEffect } from 'react';

interface Block {
  _id: string;
  type: BlockType;
  content: string;
  pageId: string;
  order: number;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateBlockData {
  type: BlockType;
  content?: string;
  pageId: string;
  order?: number;
}

interface UpdateBlockData {
  type?: BlockType;
  content?: string;
  completed?: boolean;
}

interface ReorderBlocksData {
  pageId: string;
  blockOrders: { id: string; order: number }[];
}

export function useBlocks(pageId: string) {
  const queryClient = useQueryClient();

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['blocks', pageId],
    queryFn: async () => {
      const response = await api.get('/blocks', { params: { pageId } });
      return response.data.blocks as Block[];
    },
    enabled: !!pageId,
  });

  // --------------------------
  // Block Mutations
  // --------------------------
  const createBlockMutation = useMutation({
    mutationFn: async (data: CreateBlockData) => {
      const response = await api.post('/blocks', data);
      return response.data.block as Block;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blocks', pageId]);
      queryClient.invalidateQueries(['pages', pageId]);
    },
  });

  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBlockData }) => {
      const response = await api.patch(`/blocks/${id}`, data);
      return response.data.block as Block;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blocks', pageId]);
      queryClient.invalidateQueries(['pages', pageId]);
    },
  });

  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blocks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blocks', pageId]);
      queryClient.invalidateQueries(['pages', pageId]);
    },
  });

  const reorderBlocksMutation = useMutation({
    mutationFn: async (data: ReorderBlocksData) => {
      const response = await api.patch('/blocks/reorder', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blocks', pageId]);
    },
  });

  // --------------------------
  // Recently Visited Page Tracker
  // --------------------------
  useEffect(() => {
    if (pageId) {
      // Fetch the page info for tracking
      const trackRecentPage = async () => {
        try {
          const response = await api.get(`/pages/${pageId}`);
          const page = response.data.page;
          if (page) {
            const stored = localStorage.getItem('recentPages');
            const current = stored ? JSON.parse(stored) : [];
            const filtered = current.filter((p: any) => p._id !== page._id);
            const updated = [page, ...filtered].slice(0, 10);
            localStorage.setItem('recentPages', JSON.stringify(updated));
          }
        } catch (error) {
          console.error('Error updating recent page list:', error);
        }
      };

      trackRecentPage();
    }
  }, [pageId]);

  // --------------------------
  // Return Hooks
  // --------------------------
  return {
    blocks,
    isLoading,
    createBlock: createBlockMutation.mutate,
    updateBlock: updateBlockMutation.mutate,
    deleteBlock: deleteBlockMutation.mutate,
    reorderBlocks: reorderBlocksMutation.mutate,
    createBlockLoading: createBlockMutation.isLoading,
    updateBlockLoading: updateBlockMutation.isLoading,
    deleteBlockLoading: deleteBlockMutation.isLoading,
    reorderBlocksLoading: reorderBlocksMutation.isLoading,
  };
}

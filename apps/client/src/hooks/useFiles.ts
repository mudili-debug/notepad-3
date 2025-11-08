import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface File {
  _id: string;
  name: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateFileData {
  name: string;
  content?: string;
}

interface UpdateFileData {
  name?: string;
  content?: string;
}

export function useFiles() {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const response = await api.get('/files');
      return response.data as File[];
    },
  });

  const createFileMutation = useMutation({
    mutationFn: async (data: CreateFileData) => {
      const response = await api.post('/files', data);
      return response.data as File;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
    },
  });

  const updateFileMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFileData }) => {
      const response = await api.patch(`/files/${id}`, data);
      return response.data as File;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/files/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
    },
  });

  return {
    files,
    isLoading,
    createFile: createFileMutation.mutate,
    updateFile: updateFileMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    createFileLoading: createFileMutation.isLoading,
    updateFileLoading: updateFileMutation.isLoading,
    deleteFileLoading: deleteFileMutation.isLoading,
  };
}

export function useFile(id: string) {
  const queryClient = useQueryClient();

  const { data: file, isLoading } = useQuery({
    queryKey: ['files', id],
    queryFn: async () => {
      const response = await api.get(`/files/${id}`);
      return response.data as File;
    },
    enabled: !!id,
  });

  const updateFileMutation = useMutation({
    mutationFn: async (data: UpdateFileData) => {
      const response = await api.patch(`/files/${id}`, data);
      return response.data as File;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      queryClient.invalidateQueries(['files', id]);
    },
  });

  return {
    file,
    isLoading,
    updateFile: updateFileMutation.mutate,
    updateFileLoading: updateFileMutation.isLoading,
  };
}

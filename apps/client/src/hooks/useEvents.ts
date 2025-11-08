import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function useEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const eventsUrl = base.replace(/\/api\/?$/, '') + '/api/events';
    const token = localStorage.getItem('accessToken');
    const urlWithToken = token
      ? `${eventsUrl}?token=${encodeURIComponent(token)}`
      : eventsUrl;
    const es = new EventSource(urlWithToken);

    es.addEventListener('pageCreated', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        queryClient.invalidateQueries(['pages']);
        if (payload?.page?._id) {
          // Optionally update recent pages
          queryClient.invalidateQueries(['pages', payload.page._id]);
        }
      } catch (err) {
        queryClient.invalidateQueries(['pages']);
      }
    });

    es.addEventListener('pageUpdated', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        queryClient.invalidateQueries(['pages']);
        if (payload?.page?._id) {
          queryClient.invalidateQueries(['pages', payload.page._id]);
        }
      } catch (err) {
        queryClient.invalidateQueries(['pages']);
      }
    });

    es.addEventListener('pageDeleted', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        queryClient.invalidateQueries(['pages']);
        if (payload?.id) {
          queryClient.invalidateQueries(['pages', payload.id]);
          queryClient.invalidateQueries(['blocks', payload.id]);
        }
      } catch (err) {
        queryClient.invalidateQueries(['pages']);
      }
    });

    es.addEventListener('blockCreated', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        if (payload?.pageId) {
          queryClient.invalidateQueries(['blocks', payload.pageId]);
          queryClient.invalidateQueries(['pages', payload.pageId]);
        }
      } catch (err) {
        // ignore
      }
    });

    es.addEventListener('blockUpdated', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        if (payload?.pageId) {
          queryClient.invalidateQueries(['blocks', payload.pageId]);
          queryClient.invalidateQueries(['pages', payload.pageId]);
        }
      } catch (err) {
        // ignore
      }
    });

    es.addEventListener('blockDeleted', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        if (payload?.pageId) {
          queryClient.invalidateQueries(['blocks', payload.pageId]);
          queryClient.invalidateQueries(['pages', payload.pageId]);
        }
      } catch (err) {
        // ignore
      }
    });

    es.addEventListener('blocksReordered', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data);
        if (payload?.pageId) {
          queryClient.invalidateQueries(['blocks', payload.pageId]);
        }
      } catch (err) {
        // ignore
      }
    });

    es.onerror = () => {
      // EventSource will attempt reconnection automatically
    };

    return () => {
      es.close();
    };
  }, [queryClient]);
}

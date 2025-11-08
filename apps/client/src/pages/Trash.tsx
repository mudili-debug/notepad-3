import PageTemplate from '../components/ui/PageTemplate';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface PageItem {
  _id: string;
  title: string;
  updatedAt: string;
}

const Trash = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pages?status=deleted');
      setPages(res.data || []);
    } catch (err) {
      console.error('Failed to load trash', err);
    } finally {
      setLoading(false);
    }
  };

  const restore = async (id: string) => {
    try {
      await api.post(`/pages/${id}/restore`);
      setPages((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error('Failed to restore', err);
    }
  };

  const deleteForever = async (id: string) => {
    try {
      await api.delete(`/pages/${id}?force=true`);
      setPages((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error('Failed to delete forever', err);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  return (
    <PageTemplate
      title="Trash"
      description="Deleted pages can be restored or permanently removed"
    >
      <div className="space-y-4">
        {loading && <div>Loading…</div>}
        {!loading && pages.length === 0 && (
          <div className="text-gray-600">Trash is empty</div>
        )}

        <div className="space-y-2">
          {pages.map((p) => (
            <div
              key={p._id}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-sm">{p.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(p.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => restore(p._id)}
                >
                  Restore
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteForever(p._id)}
                >
                  Delete forever
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Trash;

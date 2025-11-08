import PageTemplate from '../components/ui/PageTemplate';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const Inbox = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <PageTemplate
      title="Inbox"
      description="View and manage your notifications"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg font-medium">
            All ({notifications.length})
          </button>
          <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
          <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">
            Mentions ({notifications.filter((n) => n.type === 'mention').length}
            )
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          {loading && <div className="p-6">Loading…</div>}
          {!loading && notifications.length === 0 && (
            <div className="p-6 text-gray-600">No notifications</div>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 flex items-start space-x-4 ${
                n.read ? 'bg-gray-50 dark:bg-gray-900' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {n.message}
                  </p>
                  <small className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  {n.link ? (
                    <Link
                      to={n.link}
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => markRead(n._id)}
                    >
                      Go to page
                    </Link>
                  ) : null}
                  {!n.read && (
                    <button
                      className="text-sm text-gray-500"
                      onClick={() => markRead(n._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Inbox;

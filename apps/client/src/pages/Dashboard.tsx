import { useEffect, useState } from 'react';
import { usePages } from '../hooks/usePages';
import { useFiles } from '../hooks/useFiles';
import { useSearch } from '../hooks/useSearch';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Greeting helper
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { getRecentPages } = usePages();
  const { createFile } = useFiles();
  const { search, results, isLoading: searchLoading } = useSearch();
  const [greeting, setGreeting] = useState(getGreeting());
  const [time, setTime] = useState(new Date());
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  // Live update greeting + time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load recently visited pages from localStorage
  useEffect(() => {
    const loadPages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stored = await getRecentPages();
        setRecentPages(stored);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load recent pages'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, [getRecentPages]);

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, search]);

  const handleCreateFile = () => {
    if (fileName.trim()) {
      createFile({ name: fileName, content: fileContent });
      setShowFileModal(false);
      setFileName('');
      setFileContent('');
    }
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-8 space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* ===== Greeting Section ===== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting},{' '}
          <span className="text-indigo-500">Mudili Bhavani Prasad</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{formattedTime}</p>
      </div>

      {/* ===== Search Bar ===== */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search pages and files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* ===== Search Results ===== */}
      {searchQuery && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Search Results
          </h2>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <motion.div
                  key={`${result.type}-${result._id}`}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  {result.type === 'page' ? (
                    <Link to={`/app/${result._id}`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{result.icon || '📄'}</span>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Page
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📄</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {result.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          File
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No results found</p>
          )}
        </section>
      )}

      {/* ===== Recently Visited ===== */}
      {!searchQuery && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Recently Visited
          </h2>
          {recentPages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPages.slice(0, 8).map((page) => (
                <motion.div
                  key={page._id}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-md transition"
                >
                  <Link to={`/app/${page._id}`}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{page.icon || '📄'}</span>
                      <span>{page.title}</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent pages</p>
          )}
        </section>
      )}

      {/* ===== Quick Actions ===== */}
      {!searchQuery && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'New Page',
                desc: 'Start from scratch',
                emoji: '➕',
                action: () => {},
              },
              {
                title: 'New File',
                desc: 'Create text file',
                emoji: '📄',
                action: () => setShowFileModal(true),
              },
              {
                title: 'Monthly Budget',
                desc: 'Track your finances',
                emoji: '💰',
                action: () => {},
              },
              {
                title: 'Weekly To-do List',
                desc: 'Plan your week',
                emoji: '🗓️',
                action: () => {},
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                onClick={item.action}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Learn Section ===== */}
      {!searchQuery && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Learn & Improve
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Template Guides',
                desc: 'Learn how to use templates',
                emoji: '📘',
              },
              {
                title: 'Styling Tips',
                desc: 'Customize your pages',
                emoji: '🎨',
              },
              {
                title: 'Project Management',
                desc: 'Manage your work efficiently',
                emoji: '📊',
              },
              {
                title: 'AI Features',
                desc: 'Use Notion AI for productivity',
                emoji: '🤖',
              },
              {
                title: 'Team Collaboration',
                desc: 'Work with your team',
                emoji: '👥',
              },
              {
                title: 'Quick Start',
                desc: 'Get started in minutes',
                emoji: '⚡',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== File Creation Modal ===== */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Create New File
            </h3>
            <input
              type="text"
              placeholder="File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            />
            <textarea
              placeholder="File content (optional)"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg h-32"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreateFile}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowFileModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePages } from '../../hooks/usePages';
import { SIDEBAR_WIDTH } from '../../utils/constants';
import PageList from './PageList';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ isOpen = true, onToggle }: SidebarProps) => {
  const { createPage } = usePages();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewPage = () => {
    createPage({ title: 'Untitled' });
  };

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? 64 : SIDEBAR_WIDTH;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -sidebarWidth }}
          animate={{ x: 0 }}
          exit={{ x: -sidebarWidth }}
          transition={{ type: 'tween', ease: 'anticipate', duration: 0.3 }}
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40"
          style={{ width: sidebarWidth }}
        >
          <div className="p-4 h-full flex flex-col justify-between">
            {/* === Top Section === */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                {!isCollapsed && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Pages
                  </motion.h2>
                )}
                <motion.button
                  onClick={handleToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={
                    isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                  }
                >
                  <svg
                    className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${
                      isCollapsed ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Navigation Links */}
              {!isCollapsed && (
                <nav className="space-y-1 mb-6">
                  <SidebarLink icon="🏠" label="Home" to="/dashboard" />
                  <SidebarLink icon="📅" label="Meetings" to="/meetings" />
                  <SidebarLink icon="🤖" label="Notion AI" to="/ai" />
                  <SidebarLink icon="📥" label="Inbox" to="/inbox" />
                </nav>
              )}

              {/* Private Section */}
              {!isCollapsed && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Private
                  </p>
                  <motion.button
                    onClick={handleNewPage}
                    className="w-full mb-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>New Page</span>
                  </motion.button>

                  <PageList isCollapsed={isCollapsed} />
                </div>
              )}

              {/* Shared Workspace */}
              {!isCollapsed && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Shared
                  </p>
                  <SidebarLink
                    icon="👥"
                    label="Start Collaborating"
                    to="/collab"
                  />
                </div>
              )}
            </div>

            {/* === Bottom Section === */}
            {!isCollapsed && (
              <div className="mt-auto space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                <SidebarLink icon="⚙️" label="Settings" to="/settings" />
                <SidebarLink icon="🛒" label="Marketplace" to="/marketplace" />
                <SidebarLink icon="🗑️" label="Trash" to="/trash" />
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

// === SidebarLink component ===
interface SidebarLinkProps {
  icon: string;
  label: string;
  to: string;
}

const SidebarLink = ({ icon, label, to }: SidebarLinkProps) => (
  <Link
    to={to}
    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default Sidebar;

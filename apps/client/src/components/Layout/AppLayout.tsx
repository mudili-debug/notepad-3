import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from '../Sidebar/Sidebar';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col bg-white dark:bg-[#191919] transition-colors duration-500 ${theme}`}
    >
      {/* Header with blur effect when scrolled */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/80 dark:bg-[#191919]/80 backdrop-blur-sm shadow-sm'
            : ''
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar with smooth transition */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content Area with smooth animations */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;

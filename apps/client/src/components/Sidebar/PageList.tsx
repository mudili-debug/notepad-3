import { motion } from 'framer-motion';
import { usePages } from '../../hooks/usePages';
import SidebarItem from './SidebarItem';

interface PageListProps {
  isCollapsed?: boolean;
}

const PageList = ({ isCollapsed = false }: PageListProps) => {
  const { pages, isLoading } = usePages();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-muted/20 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto">
      {pages.map((page, index) => (
        <motion.div
          key={page._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <SidebarItem page={page} isCollapsed={isCollapsed} />
        </motion.div>
      ))}
      {pages.length === 0 && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted text-sm"
        >
          No pages yet. Create your first page!
        </motion.div>
      )}
    </div>
  );
};

export default PageList;

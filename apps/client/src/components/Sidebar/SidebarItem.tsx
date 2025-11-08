import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Page {
  _id: string;
  title: string;
  icon?: string;
}

interface SidebarItemProps {
  page: Page;
  isCollapsed?: boolean;
}

const SidebarItem = ({ page, isCollapsed = false }: SidebarItemProps) => {
  return (
    <Link to={`/app/${page._id}`}>
      <motion.div
        className={`flex items-center ${
          isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
        } py-2 rounded-lg hover:bg-muted/20 transition-colors duration-300 cursor-pointer group`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg flex-shrink-0">{page.icon || '📄'}</span>
        {!isCollapsed && (
          <span className="text-text truncate group-hover:text-primary transition-colors duration-300">
            {page.title}
          </span>
        )}
      </motion.div>
    </Link>
  );
};

export default SidebarItem;

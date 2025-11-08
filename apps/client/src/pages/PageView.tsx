import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '../components/Editor';

const PageView = () => {
  const { pageId } = useParams<{ pageId: string }>();

  if (!pageId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full"
      >
        <p className="text-muted">Page not found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Editor pageId={pageId} />
    </motion.div>
  );
};

export default PageView;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-heading font-semibold mb-6 text-text-light dark:text-text-dark">
          Page Not Found
        </h2>
        <p className="text-muted mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/app" className="btn bg-primary hover:bg-primary/90">
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

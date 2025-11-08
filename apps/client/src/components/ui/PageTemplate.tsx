import { motion } from 'framer-motion';

interface PageTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageTemplate = ({ title, description, children }: PageTemplateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </motion.div>
  );
};

export default PageTemplate;

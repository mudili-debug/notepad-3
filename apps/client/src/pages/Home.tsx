import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <motion.h1
            className="text-3xl font-heading font-bold text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            NotionPad
          </motion.h1>
          <div className="space-x-4">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn bg-accent hover:bg-accent/90">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <motion.h2
          className="text-5xl font-heading font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your Ideas, Organized
        </motion.h2>
        <motion.p
          className="text-xl mb-8 text-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A powerful note-taking app inspired by Notion. Create pages, edit
          blocks, and stay organized.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            to="/signup"
            className="btn text-lg px-8 py-4 bg-primary hover:bg-primary/90"
          >
            Get Started
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;

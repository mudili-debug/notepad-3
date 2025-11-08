import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface RecentPage {
  _id: string;
  title: string;
  updatedAt: string;
  type: 'page' | 'database';
}

interface UserContextType {
  recentPages: RecentPage[];
  addRecentPage: (page: RecentPage) => void;
  removeRecentPage: (pageId: string) => void;
  clearRecentPages: () => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [userName, setUserName] = useState<string>('User');

  // Load recent pages from localStorage on mount
  useEffect(() => {
    const storedPages = localStorage.getItem('recentPages');
    if (storedPages) {
      setRecentPages(JSON.parse(storedPages));
    }

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Save recent pages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentPages', JSON.stringify(recentPages));
  }, [recentPages]);

  // Save username to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const addRecentPage = (page: RecentPage) => {
    setRecentPages((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p._id !== page._id);
      // Add to beginning of array
      return [page, ...filtered].slice(0, 20); // Keep last 20 pages
    });
  };

  const removeRecentPage = (pageId: string) => {
    setRecentPages((prev) => prev.filter((p) => p._id !== pageId));
  };

  const clearRecentPages = () => {
    setRecentPages([]);
  };

  return (
    <UserContext.Provider
      value={{
        recentPages,
        addRecentPage,
        removeRecentPage,
        clearRecentPages,
        userName,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

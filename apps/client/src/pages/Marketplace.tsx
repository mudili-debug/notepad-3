import PageTemplate from '../components/ui/PageTemplate';

const Marketplace = () => {
  return (
    <PageTemplate
      title="Marketplace"
      description="Discover templates and integrations"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search templates and integrations..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <option>All Categories</option>
              <option>Templates</option>
              <option>Integrations</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Free</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Add template cards */}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Marketplace;

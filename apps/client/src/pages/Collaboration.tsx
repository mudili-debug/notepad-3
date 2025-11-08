import PageTemplate from '../components/ui/PageTemplate';

const Collaboration = () => {
  return (
    <PageTemplate
      title="Start Collaborating"
      description="Work together with your team"
    >
      <div className="space-y-6">
        {/* Team Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Team Members</h2>
          <div className="space-y-4">{/* Add team members list */}</div>
        </div>

        {/* Shared Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Shared Pages</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Add shared pages grid */}
          </div>
        </div>

        {/* Invite Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Invite Team Members</h2>
          <div className="flex space-x-4">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Collaboration;

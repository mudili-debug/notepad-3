import PageTemplate from '../components/ui/PageTemplate';

const Settings = () => {
  return (
    <PageTemplate
      title="Settings"
      description="Customize your workspace preferences"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          {/* Add profile settings form */}
        </div>

        {/* Appearance Settings */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          {/* Add theme settings */}
        </div>

        {/* Notification Settings */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          {/* Add notification settings */}
        </div>

        {/* Integration Settings */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>
          {/* Add integration settings */}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Settings;

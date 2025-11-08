import PageTemplate from '../components/ui/PageTemplate';
import { useState } from 'react';
import api from '../utils/api';

const NotionAI = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAIAction = async (action: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/ai/run', { action, text });
      setResult(response.data.result);
    } catch (error) {
      console.error('AI action failed:', error);
      setResult('Error: Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      title="Notion AI"
      description="AI-powered features to boost your productivity"
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Enter your text</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-32 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* AI Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => handleAIAction('summarize')}
            disabled={loading || !text.trim()}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            📝 Summarize
          </button>
          <button
            onClick={() => handleAIAction('rewrite')}
            disabled={loading || !text.trim()}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ✏️ Rewrite
          </button>
          <button
            onClick={() => handleAIAction('generate-tasks')}
            disabled={loading || !text.trim()}
            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ✅ Generate Tasks
          </button>
          <button
            onClick={() => handleAIAction('translate')}
            disabled={loading || !text.trim()}
            className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🌍 Translate
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Result</h2>
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {loading ? 'Processing...' : result}
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Writing Assistant */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Writing Assistant</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get help with writing, editing, and improving your content.
            </p>
          </div>

          {/* Smart Summary */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Smart Summary</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically summarize long texts and documents.
            </p>
          </div>

          {/* Translation */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Translation</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Translate text between multiple languages instantly.
            </p>
          </div>

          {/* Code Assistant */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Code Assistant</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get help with coding, debugging, and code generation.
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default NotionAI;

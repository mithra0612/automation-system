import { useState } from 'react';
import axios from 'axios';

function CreateRepository({ token, onRepoCreated }) {
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [addReadme, setAddReadme] = useState(true);

  const createRepo = async () => {
    try {
      const res = await axios.post('http://localhost:3000/create-repo', {
        token,
        name: repoName,
        description: repoDescription,
        private: isPrivate,
        auto_init: addReadme
      });
      alert(`Repo created: ${res.data.full_name}`);
      onRepoCreated();
      // Reset form
      setRepoName('');
      setRepoDescription('');
      setIsPrivate(false);
      setAddReadme(true);
    } catch (error) {
      console.error('Error creating repository:', error);
      alert('Error creating repository');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Create Repository</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Repository name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          placeholder="Repository description (optional)"
          value={repoDescription}
          onChange={(e) => setRepoDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-300 text-sm">Private repository</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addReadme}
                onChange={(e) => setAddReadme(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-300 text-sm">Add README.md</span>
            </label>
          </div>
          <button
            onClick={createRepo}
            disabled={!repoName.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            Create Repository
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRepository;

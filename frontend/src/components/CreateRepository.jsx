import { useState } from 'react';
import axios from 'axios';

function CreateRepository({ token, onRepoCreated }) {
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [addReadme, setAddReadme] = useState(true);

  const createRepo = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/github/create-repo', {
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
    <div className="bg-gray-950/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800/70 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Create Repository</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Repository name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900/95 border border-gray-800/70 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
        />
        <textarea
          placeholder="Repository description (optional)"
          value={repoDescription}
          onChange={(e) => setRepoDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-900/95 border border-gray-800/70 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-200"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-800 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-400 text-sm">Private repository</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addReadme}
                onChange={(e) => setAddReadme(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-800 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-400 text-sm">Add README.md</span>
            </label>
          </div>
          <button
            onClick={createRepo}
            disabled={!repoName.trim()}
            className="px-4 py-2 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-green-500/25 disabled:shadow-none"
          >
            Create Repository
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRepository;

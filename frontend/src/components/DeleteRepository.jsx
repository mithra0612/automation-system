import { useState } from 'react';
import axios from 'axios';

function DeleteRepository({ token, user, repos, onRepoDeleted }) {
  const [deleteTarget, setDeleteTarget] = useState('');

  const deleteRepo = async () => {
    if (!deleteTarget) {
      alert('Please select a repository to delete');
      return;
    }
    try {
      await axios.delete('http://localhost:3000/api/github/delete-repo', {
        data: { token, owner: user.login, repo: deleteTarget }
      });
      alert('Repo deleted');
      onRepoDeleted();
      setDeleteTarget('');
    } catch (error) {
      console.error('Error deleting repository:', error);
      alert('Error deleting repository');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Delete Repository</h3>
      <div className="flex space-x-3">
        <select
          value={deleteTarget}
          onChange={(e) => setDeleteTarget(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select repository to delete</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
        <button
          onClick={deleteRepo}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Delete Repository
        </button>
      </div>
    </div>
  );
}

export default DeleteRepository;

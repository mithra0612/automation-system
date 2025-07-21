import { useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';

function DeleteRepository({ token, user, repos, onRepoDeleted }) {
  const [deleteTarget, setDeleteTarget] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  const handleDeleteClick = () => {
    if (!deleteTarget) {
      alert('Please select a repository to delete');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Delete Repository "${deleteTarget}"`,
      message: `Are you sure you want to delete "${deleteTarget}"? This action cannot be undone and will permanently delete the repository and all its contents.`,
      type: "danger"
    });
  };

  const deleteRepo = async () => {
    try {
      await axios.delete('http://localhost:3000/api/github/delete-repo', {
        data: { token, owner: user.login, repo: deleteTarget }
      });
      alert('Repository deleted successfully');
      onRepoDeleted();
      setDeleteTarget('');
    } catch (error) {
      console.error('Error deleting repository:', error);
      alert('Error deleting repository');
    }
  };

  return (
    <>
      <div className="bg- rounded-lg shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Delete Repository</h3>
        <p className="text-gray-400 text-sm mb-4">
          Select a repository to delete. This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <select
            value={deleteTarget}
            onChange={(e) => setDeleteTarget(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select repository to delete</option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.name}>
                {repo.name} ({repo.private ? 'Private' : 'Public'})
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteClick}
            disabled={!deleteTarget}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            Delete Repository
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={deleteRepo}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete Repository"
        cancelText="Cancel"
        type={confirmModal.type}
      />
    </>
  );
}

export default DeleteRepository;

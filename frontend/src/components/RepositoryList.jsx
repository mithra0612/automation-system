import { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import ChatInterface from './ChatInterface';

function RepositoryList({ repos, token, user, onRepoDeleted, onRepoUpdated }) {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, repo: null });
  const [copiedRepoId, setCopiedRepoId] = useState(null);
  const [readmes, setReadmes] = useState({}); // repo.id -> readme snippet
  const [moreMenuOpen, setMoreMenuOpen] = useState(null); // repo.id or null
  const [chatOpenRepoId, setChatOpenRepoId] = useState(null);

  // Fetch README for visible repos
  useEffect(() => {
    const fetchReadmes = async () => {
      const newReadmes = {};
      for (const repo of repos) {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${repo.full_name}/readme`,
            {
              headers: {
                Accept: 'application/vnd.github.v3.raw',
                Authorization: token ? `token ${token}` : undefined,
              },
            }
          );
          if (res.ok) {
            const text = await res.text();
            newReadmes[repo.id] = text.slice(0, 200); // first 200 chars
          } else {
            newReadmes[repo.id] = null;
          }
        } catch {
          newReadmes[repo.id] = null;
        }
      }
      setReadmes(newReadmes);
    };
    if (repos.length > 0) fetchReadmes();
  }, [repos, token]);

  if (repos.length === 0) return null;

  const handleDeleteClick = (repo) => {
    setConfirmModal({ 
      isOpen: true, 
      repo,
      title: `Delete Repository "${repo.name}"`,
      message: `Are you sure you want to delete "${repo.name}"? This action cannot be undone and will permanently delete the repository and all its contents.`,
      type: "danger"
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.repo) return;

    try {
      const response = await fetch('http://localhost:3000/api/github/delete-repo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          owner: user.login,
          repo: confirmModal.repo.name
        }),
      });

      if (response.ok) {
        alert('Repository deleted successfully');
        onRepoDeleted();
      } else {
        throw new Error('Failed to delete repository');
      }
    } catch (error) {
      console.error('Error deleting repository:', error);
      alert('Error deleting repository');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSize = (size) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      <div className="bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-900/80 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">
            Repositories ({repos.length})
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Public</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Private</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-gray-950/90 border border-gray-800/70 rounded-xl p-5 flex flex-col shadow relative"
            >
              {/* Repository Header */}
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-100 text-lg truncate">{repo.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                      repo.private 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {repo.private ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{repo.full_name}</p>
                </div>
              </div>

              {/* Repository Description */}
              {repo.description && (
                <p className="text-gray-400 mb-3 text-sm line-clamp-2 flex-grow">{repo.description}</p>
              )}

              {/* README snippet */}
              {readmes[repo.id] && (
                <div className="mb-3 text-xs text-gray-300 font-mono">
                  <span className="font-semibold text-blue-400">README:</span>{" "}
                  <span>
                    {readmes[repo.id]}
                    {readmes[repo.id].length === 200 ? (
                      <span className="text-blue-400 cursor-pointer">...read more</span>
                    ) : null}
                  </span>
                </div>
              )}

              {/* Minimal Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition"
                >
                  View
                </a>
                <button
                  onClick={() => setMoreMenuOpen(moreMenuOpen === repo.id ? null : repo.id)}
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition"
                  aria-label="Actions"
                >
                  Actions
                </button>
                <button
                  onClick={() => setChatOpenRepoId(chatOpenRepoId === repo.id ? null : repo.id)}
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition"
                  aria-label="Chat"
                >
                  Chat
                </button>
                {/* Actions dropdown menu */}
                {moreMenuOpen === repo.id && (
                  <div className="absolute mt-8 ml-24 z-10 bg-gray-900 border border-gray-700 rounded shadow-lg flex flex-col min-w-[140px]">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(repo.clone_url);
                        setCopiedRepoId(repo.id);
                        setTimeout(() => setCopiedRepoId(null), 1200);
                        setMoreMenuOpen(null);
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                    >
                      {copiedRepoId === repo.id ? "Copied!" : "Copy Clone URL"}
                    </button>
                    <a
                      href={`${repo.html_url}/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                      onClick={() => setMoreMenuOpen(null)}
                    >
                      Settings
                    </a>
                    <button
                      onClick={() => {
                        setMoreMenuOpen(null);
                        handleDeleteClick(repo);
                      }}
                      className="px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Chat dropdown/modal */}
              {chatOpenRepoId === repo.id && (
                <div className="absolute z-20 top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 rounded-xl">
                  <div className="bg-gray-950/95 p-4 rounded-xl border border-gray-800/80 shadow-2xl w-full max-w-md relative">
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                      onClick={() => setChatOpenRepoId(null)}
                      aria-label="Close chat"
                    >
                      ×
                    </button>
                    <div className="mb-2 text-sm text-gray-300 font-semibold">
                      Chat about <span className="text-blue-400">{repo.name}</span>
                    </div>
                    <ChatInterface repo={repo} user={user} />
                  </div>
                </div>
              )}

              {/* Repository Metadata */}
              <div className="mt-3 pt-3 border-t border-gray-800/50 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Size: {formatSize(repo.size)}</span>
                  <span>Updated: {formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, repo: null })}
        onConfirm={handleConfirmDelete}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete Repository"
        cancelText="Cancel"
        type={confirmModal.type}
      />
    </>
  );
}

export default RepositoryList;
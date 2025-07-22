import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';

function RepositoryDetailPage({
  repo,
  readme,
  token,
  user,
  onBack,
  onDelete,
  onCopied,
  copiedRepoId,
  chatOpenRepoId,
  setChatOpenRepoId
}) {
  // Editable description state
  const [description, setDescription] = useState(repo.description || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descLoading, setDescLoading] = useState(false);

  // New state for commits and collaborators
  const [commits, setCommits] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loadingCommits, setLoadingCommits] = useState(true);
  const [loadingCollabs, setLoadingCollabs] = useState(true);

  // Save description handler
  const handleSaveDescription = async () => {
    setDescLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo.full_name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `token ${token}` : undefined,
        },
        body: JSON.stringify({ description }),
      });
      if (response.ok) {
        setIsEditingDesc(false);
        // Optionally, you can call onRepoUpdated() if passed as prop
      } else {
        alert('Failed to update description');
      }
    } catch (e) {
      alert('Error updating description');
    }
    setDescLoading(false);
  };

  useEffect(() => {
    // Fetch last commit only
    async function fetchCommits() {
      setLoadingCommits(true);
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`,
          {
            headers: token ? { Authorization: `token ${token}` } : {},
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCommits(data);
        }
      } catch {}
      setLoadingCommits(false);
    }
    // Fetch collaborators
    async function fetchCollaborators() {
      setLoadingCollabs(true);
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo.full_name}/collaborators`,
          {
            headers: token ? { Authorization: `token ${token}` } : {},
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCollaborators(Array.isArray(data) ? data : []);
        }
      } catch {}
      setLoadingCollabs(false);
    }
    fetchCommits();
    fetchCollaborators();
  }, [repo.full_name, token]);

  // Guess tech stack from repo.language and repo.topics
  const techStack = [
    repo.language,
    ...(repo.topics || [])
  ].filter(Boolean);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const formatSize = (size) =>
    size < 1024 ? `${size} KB` : `${(size / 1024).toFixed(1)} MB`;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto bg-gray-950 rounded-xl shadow-2xl border border-gray-900/80 items-stretch">
      {/* Left: Repo Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Top section */}
        <div>
          <button onClick={onBack} className="mb-4 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">{repo.name}</h2>
          <div className="mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              repo.private
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {repo.private ? 'Private' : 'Public'}
            </span>
          </div>
          {/* Editable Description */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Description:</label>
            {isEditingDesc ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="flex-1 px-2 py-1 rounded bg-gray-900 text-gray-100 border border-gray-700"
                  disabled={descLoading}
                />
                <button
                  onClick={handleSaveDescription}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500 transition"
                  disabled={descLoading}
                >
                  Save
                </button>
                <button
                  onClick={() => { setIsEditingDesc(false); setDescription(repo.description || ""); }}
                  className="px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition"
                  disabled={descLoading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-gray-300">{description || <span className="italic text-gray-500">No description</span>}</span>
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          {/* Deployed URL */}
          {repo.homepage && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Deployed URL:</label>
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">
                {repo.homepage}
              </a>
            </div>
          )}
          {/* Last Commit */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Last Commit:</label>
            {loadingCommits ? (
              <div className="text-xs text-gray-500">Loading...</div>
            ) : commits.length === 0 ? (
              <div className="text-xs text-gray-500">No commits found.</div>
            ) : (
              <ul className="text-xs text-gray-300 space-y-2">
                {commits.map(commit => (
                  <li key={commit.sha}>
                    <div>
                      <span className="font-semibold">{commit.commit.message.split('\n')[0]}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">by {commit.commit.author.name}</span>
                      <span className="ml-2 text-gray-500">{new Date(commit.commit.author.date).toLocaleString()}</span>
                    </div>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View Commit
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Collaborators */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Collaborators:</label>
            {loadingCollabs ? (
              <div className="text-xs text-gray-500">Loading...</div>
            ) : collaborators.length === 0 ? (
              <div className="text-xs text-gray-500">No collaborators found.</div>
            ) : (
              <ul className="text-xs text-gray-300 flex flex-wrap gap-2">
                {collaborators.map(user => (
                  <li key={user.id} className="flex items-center gap-1">
                    <img src={user.avatar_url} alt={user.login} className="w-5 h-5 rounded-full" />
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {user.login}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Actions at the bottom */}
        <div className="flex gap-2 mb-6">
          <button onClick={onDelete} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500 transition">
            Delete
          </button>
          <button onClick={onCopied} className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition">
            {copiedRepoId === repo.id ? "Copied!" : "Copy Clone URL"}
          </button>
        </div>
      </div>
      {/* Right: Chatbot */}
      <div className="w-full md:w-[700px] flex-shrink-0 flex flex-col justify-between h-full max-w-full">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Chatbot:</label>
        </div>
        <div className="w-full h-full max-w-full">
          <ChatInterface
            repo={repo}
            token={token}
            chatOpenRepoId={repo.id}
            setChatOpenRepoId={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default RepositoryDetailPage;

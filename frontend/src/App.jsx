import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoName, setRepoName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [addReadme, setAddReadme] = useState(true);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      setToken(urlToken);
      // Automatically fetch user and repos when token is available
      fetchUserAndRepos(urlToken);
    }
  }, []);

  const fetchUserAndRepos = async (authToken) => {
    try {
      const userRes = await axios.get('http://localhost:3000/user', {
        headers: { Authorization: authToken }
      });
      setUser(userRes.data);

      const reposRes = await axios.get('http://localhost:3000/repositories', {
        headers: { Authorization: authToken }
      });
      setRepos(reposRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  const getUser = async () => {
    const res = await axios.get('http://localhost:3000/user', {
      headers: { Authorization: token }
    });
    setUser(res.data);
  };

  const getRepos = async () => {
    const res = await axios.get('http://localhost:3000/repositories', {
      headers: { Authorization: token }
    });
    setRepos(res.data);
  };

  const createRepo = async () => {
    const res = await axios.post('http://localhost:3000/create-repo', {
      token,
      name: repoName,
      description: repoDescription,
      private: isPrivate,
      auto_init: addReadme
    });
    alert(`Repo created: ${res.data.full_name}`);
    getRepos();
    // Reset form
    setRepoName('');
    setRepoDescription('');
    setIsPrivate(false);
    setAddReadme(true);
  };

  const deleteRepo = async () => {
    if (!deleteTarget) {
      alert('Please select a repository to delete');
      return;
    }
    await axios.delete('http://localhost:3000/delete-repo', {
      data: { token, owner: user.login, repo: deleteTarget }
    });
    alert('Repo deleted');
    getRepos();
    setDeleteTarget('');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 px-6 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <h1 className="text-2xl font-semibold">GitHub Manager</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-gray-300">@{user.login}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.login.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!token ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <h2 className="text-xl font-semibold text-white mb-3">Connect with GitHub</h2>
              <p className="text-gray-400 mb-6">Manage your repositories with OAuth authentication</p>
              <button
                onClick={login}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Login with GitHub
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={getUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Get User Info
                </button>
                <button
                  onClick={getRepos}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Get Repositories
                </button>
              </div>
            </div>

            {/* Create Repository */}
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

            {/* Delete Repository */}
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

            {/* Repositories List */}
            {repos.length > 0 && (
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Repositories ({repos.length})
                </h3>
                <div className="space-y-3">
                  {repos.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex items-center justify-between p-4 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <div>
                          <h4 className="font-medium text-white">{repo.name}</h4>
                          <p className="text-sm text-gray-400">{repo.full_name}</p>
                          {repo.description && (
                            <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {repo.private ? 'Private' : 'Public'}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${repo.private ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState, useMemo } from 'react';
import axios from 'axios';
import CreateRepository from './CreateRepository';
import RepositoryList from './RepositoryList';
import ChatInterface from './ChatInterface';

function Dashboard({ token, user, repos, onUserFetch, onReposFetch }) {
  const [tab, setTab] = useState('stats');

  const getUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/github/user', {
        headers: { Authorization: token }
      });
      onUserFetch(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const getRepos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/github/repositories', {
        headers: { Authorization: token }
      });
      onReposFetch(res.data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  // Compute stats and repo highlights
  const stats = useMemo(() => ({
    totalRepos: repos?.length || 0,
    followers: user?.followers || 0,
    following: user?.following || 0,
    publicGists: user?.public_gists || 0,
  }), [repos, user]);

  // Most recently used repo (by updated_at)
  const recentRepo = useMemo(() => {
    if (!repos || repos.length === 0) return null;
    return [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
  }, [repos]);

  // Most frequently used repo (by stargazers_count as a proxy)
  const frequentRepo = useMemo(() => {
    if (!repos || repos.length === 0) return null;
    return [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0];
  }, [repos]);

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'stats' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}
          onClick={() => setTab('stats')}
        >
          Stats
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'create' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}
          onClick={() => setTab('create')}
        >
          Create
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'actions' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}
          onClick={() => setTab('actions')}
        >
          Other Actions
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'chat' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}
          onClick={() => setTab('chat')}
        >
          Chat
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'stats' && (
        <div>
          <div className="bg-gray-950/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800/70 p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Your GitHub Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900/95 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.totalRepos}</div>
                <div className="text-gray-300">Repositories</div>
              </div>
              <div className="bg-gray-900/95 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.followers}</div>
                <div className="text-gray-300">Followers</div>
              </div>
              <div className="bg-gray-900/95 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">{stats.following}</div>
                <div className="text-gray-300">Following</div>
              </div>
              <div className="bg-gray-900/95 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-300">{stats.publicGists}</div>
                <div className="text-gray-300">Gists</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/95 rounded-lg p-4">
                <div className="font-semibold text-gray-100 mb-2">Most Recently Used Repo</div>
                {recentRepo ? (
                  <div>
                    <div className="text-blue-400 font-bold">{recentRepo.name}</div>
                    <div className="text-gray-300 text-sm">Updated: {new Date(recentRepo.updated_at).toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">{recentRepo.description}</div>
                  </div>
                ) : <div className="text-gray-400">No repositories found.</div>}
              </div>
              <div className="bg-gray-900/95 rounded-lg p-4">
                <div className="font-semibold text-gray-100 mb-2">Most Frequently Used Repo</div>
                {frequentRepo ? (
                  <div>
                    <div className="text-yellow-400 font-bold">{frequentRepo.name}</div>
                    <div className="text-gray-300 text-sm">Stars: {frequentRepo.stargazers_count}</div>
                    <div className="text-gray-400 text-xs">{frequentRepo.description}</div>
                  </div>
                ) : <div className="text-gray-400">No repositories found.</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div>
          <CreateRepository token={token} onRepoCreated={getRepos} />
        </div>
      )}

      {tab === 'actions' && (
        <div>
          <div className="mb-4">
            <button
              onClick={getUser}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-primary-500/25 mr-2"
            >
              Refresh User Info
            </button>
            <button
              onClick={getRepos}
              className="px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg hover:from-accent-500 hover:to-accent-600 transition-all duration-200 font-medium shadow-lg hover:shadow-accent-500/25"
            >
              Refresh Repositories
            </button>
          </div>
          <RepositoryList 
            repos={repos} 
            token={token}
            user={user}
            onRepoDeleted={getRepos}
            onRepoUpdated={getRepos}
          />
        </div>
      )}

      {tab === 'chat' && (
        <div className="bg-gray-950/90 rounded-xl p-6 text-gray-100">
          <div className="text-lg font-semibold mb-2">Chat Interface</div>
          <ChatInterface user={user} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import axios from 'axios';
import CreateRepository from './CreateRepository';
import DeleteRepository from './DeleteRepository';
import RepositoryList from './RepositoryList';

function Dashboard({ token, user, repos, onUserFetch, onReposFetch }) {
  const getUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/user', {
        headers: { Authorization: token }
      });
      onUserFetch(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const getRepos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/repositories', {
        headers: { Authorization: token }
      });
      onReposFetch(res.data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  return (
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

      <CreateRepository token={token} onRepoCreated={getRepos} />
      
      {user && (
        <DeleteRepository 
          token={token} 
          user={user} 
          repos={repos} 
          onRepoDeleted={getRepos} 
        />
      )}

      <RepositoryList repos={repos} />
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

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
      const userRes = await axios.get('http://localhost:3000/api/github/user', {
        headers: { Authorization: authToken }
      });
      setUser(userRes.data);

      const reposRes = await axios.get('http://localhost:3000/api/github/repositories', {
        headers: { Authorization: authToken }
      });
      setRepos(reposRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = () => {
    window.location.href = 'http://localhost:3000/api/github/login';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={user} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!token ? (
          <Login onLogin={login} />
        ) : (
          <Dashboard 
            token={token}
            user={user}
            repos={repos}
            onUserFetch={setUser}
            onReposFetch={setRepos}
          />
        )}
      </div>
    </div>
  );
}

export default App;
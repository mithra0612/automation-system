const axios = require('axios');

const loginWithGitHub = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=repo,delete_repo,read:user`;
  res.redirect(redirectUrl);
};

const githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
      },
      { headers: { accept: 'application/json' } }
    );

    const accessToken = response.data.access_token;

    res.redirect(`${process.env.FRONTEND_URL}?token=${accessToken}`);
  } catch (error) {
    res.status(500).json({ error: 'OAuth failed' });
  }
};

const getUserInfo = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const user = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(user.data);
  } catch {
    res.status(500).json({ error: 'User info failed' });
  }
};

const getUserRepositories = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const repos = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(repos.data);
  } catch {
    res.status(500).json({ error: 'Repositories fetch failed' });
  }
};

const createRepo = async (req, res) => {
  const { token, name, description, private: isPrivate, auto_init } = req.body;
  try {
    const repoData = {
      name,
      description: description || '',
      private: isPrivate || false,
      auto_init: auto_init || false
    };
    
    const response = await axios.post(
      'https://api.github.com/user/repos',
      repoData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Create repo error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Create repo failed' });
  }
};

const deleteRepo = async (req, res) => {
  const { token, owner, repo } = req.body;
  try {
    await axios.delete(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({ message: 'Repository deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  loginWithGitHub,
  githubCallback,
  getUserInfo,
  getUserRepositories,
  createRepo,
  deleteRepo
};

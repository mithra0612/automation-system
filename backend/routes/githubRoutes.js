const express = require('express');
const router = express.Router();
const {
  loginWithGitHub,
  githubCallback,
  getUserInfo,
  getUserRepositories,
  createRepo,
  deleteRepo
} = require('../controllers/githubController');

router.get('/login', loginWithGitHub);
router.get('/auth/callback', githubCallback);
router.get('/user', getUserInfo);
router.get('/repositories', getUserRepositories);
router.post('/create-repo', createRepo);
router.delete('/delete-repo', deleteRepo);

module.exports = router;

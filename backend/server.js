const express = require('express');
const cors = require('cors');
require('dotenv').config();

const githubRoutes = require('./routes/githubRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/github', githubRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
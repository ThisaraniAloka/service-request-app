// backend/server.js
const express = require('express');
const cors = require('cors');
const router = require('./routes');
const { initDB } = require('./models');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDB(); // ✅ ensures DB and tables are ready
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
};

startServer();

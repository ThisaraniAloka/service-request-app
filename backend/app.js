const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDB } = require('./models');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

initDB()
  .then(() => console.log("DB initialized"))
  .catch(err => console.error("DB init error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

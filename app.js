const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/news-explorer' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'API News Explorer funcionando' });
});

app.listen(PORT);

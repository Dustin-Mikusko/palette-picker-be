import express from 'express';
import cors from 'cors';

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const app = express();

app.locals.title = 'Palette Picker';
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('oh hello')
})

export default app;

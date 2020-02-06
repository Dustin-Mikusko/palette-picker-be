import express from 'express';
import cors from 'cors';
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
import '@babel/polyfill';


const app = express();
app.locals.title = 'Palette Picker';
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('oh hello')
});

app.get('/api/v1/projects/:id', async(request, response) => {
  const { id } = request.params;
  try {
    const project = await database('projects').where('id', id);

    if (project.length) {
      response.status(200).json(project)
    } else {
      response.status(404).json({
        error: `Could not find a project with id: ${request.params.id}`
      });
    }
  } catch (error) {
    response.status(500).json({error: 'internal server error' })
  }
});


export default app;

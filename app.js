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

app.get('/api/v1/projects', async(request, response) => {
  try {
    const projects = await database('projects').select();
    const cleanedProjects = projects.map(project => {
      return {
        id: project.id,
        title: project.title
      }
    });

    response.status(200).json({projects: cleanedProjects})
  } catch (error) {
    response.status(500).json({error: 'internal server error' })
  }
});

app.get('/api/v1/projects/:id', async(request, response) => {
  const { id } = request.params;
  try {
    const project = await database('projects').where('id', id);

    if (project.length) {
      response.status(200).json({id: project[0].id, title: project[0].title});
    } else {
      response.status(404).json({
        error: `Could not find a project with id: ${request.params.id}`
      });
    }
  } catch (error) {
    response.status(500).json({error: 'internal server error' })
  }
});

app.post('/api/v1/projects', async (request, response) => {
  const project = request.body;
  for (let requiredParameter of ['title']) {
    if (!project.hasOwnProperty(requiredParameter)) {
      return response
        .status(422)
        .send({ error: `The expected format is: { title: <String>}. You're missing a "${requiredParameter}" property.`})
    }
  }

  try {
    const id = await database('projects').insert(project, 'id');
    response.status(201).json({id: id[0], title: project.title});
  } catch (error) {
    response.status(500).json({ error });
  }
});


app.patch('/api/v1/projects/:id', async (request, response) => {
  const { id } = request.params;
  console.log(request.body);
  const newProject = request.body;

  try {
    const patchedProject = await database('projects').where('id', id).update({title: newProject.title}, ['id', 'title']);

    if (patchedProject.length) {
      response.status(201).json({id: patchedProject[0].id, title: patchedProject[0].title});
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

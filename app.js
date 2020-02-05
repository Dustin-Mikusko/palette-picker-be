import express from 'express';
import cors from 'cors';
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.locals.title = 'Palette Picker';
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('oh hello')
});

app.get('/api/v1/users/:id:', async(request, response) => {
  const { id } = request.params;
  console.log(request.params);

  try {
    const user = await database('students').where('id', id);

    if (user.length) {
      response.status(200).json({user})
    } else {
      response.status(404).json({
        error: `Could not find a user with id: ${request.params.id}`
      });
    }
  } catch (error) {
    response.status(500).json({error: 'internal server error' })
  }
});



export default app;

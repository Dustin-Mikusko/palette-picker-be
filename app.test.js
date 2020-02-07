import request from 'supertest';
import app from './app.js';
import '@babel/polyfill';

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a happy status code of 200 and a single project object if the project exists', async () => {
      const expectedProject = await database('projects').first();
      const { id } = expectedProject;
        delete expectedProject.created_at;
        delete expectedProject.updated_at;

      const response = await request(app).get(`/api/v1/projects/${id}`);

      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toEqual(expectedProject);
    });

    it('should return a 404 if the specific project is not found', async () => {
      const invalidId = -467;

      const response = await request(app).get(`/api/v1/projects/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Could not find a project with id: ${invalidId}`);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a happy status code of 200 and all project objects', async () => {
      const expectedProjects = await database('projects').select();
      const cleanedProjectsDB = expectedProjects.map(project => {
        delete project.created_at;
        delete project.updated_at;
      });

      const response = await request(app).get(`/api/v1/projects`);
      const projects = response.body;

      expect(response.status).toBe(200);
      expect(projects).toEqual({projects: expectedProjects})
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a new project to the database', async () => {
      const newProject = {title: 'pantry'};

      const response = await request(app).post('/api/v1/projects').send(newProject);
      const projects = await database('projects').where('id', response.body.id);
      const project = projects[0];

      expect(response.status).toBe(201)
      expect(project.title).toEqual(newProject.title)
    });

    it('should return a 422 if there are missing properties from the request body', async () => {
      const newProject = {missingParameter: 'title'};
      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('The expected format is: { title: <String>}. You\'re missing a \"title\" property.')
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should return a happy status of 201 and update a specific project title', async () => {
      const newProject = { title: 'Master bedroom' };
      const targetProject = await database('projects').first();
      const { id } = targetProject;
      console.log(id);

      const response = await request(app).patch(`/api/v1/projects/${id}`).send(newProject)

      const revisedProjectArray = await database('projects').where('id', id);
      const revisedProject = revisedProjectArray[0];
        delete revisedProject.created_at;
        delete revisedProject.updated_at;

      const expectedResult = {id, title: newProject.title };

      expect(response.status).toBe(201);
      expect(revisedProject).toEqual(expectedResult);
    });

    it('should return a sad 404 code if the targeted project is not found', async () => {
      const invalidTargetId = -24;

      const response = await request(app).get(`/api/v1/projects/${invalidTargetId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Could not find a project with id: ${invalidTargetId}`);
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return a happy status of 201 if delete is successful', async () => {
      const targetPalette = await database('palettes').first();
      const { id } = targetPalette;

      const response = await request(app).delete(`/api/v1/palettes/${id}`).send(`${id}`);
      const aftermath = await database('palettes').where('id', id);

      expect(response.status).toBe(200);
      expect(aftermath).toEqual([]);
    });

    it('should return a sad 404 code if the targeted palette is not found', async () => {
      const targetPaletteId = -1234;
      const response = await request(app).delete(`/api/v1/palettes/${targetPaletteId}`).send(`${targetPaletteId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Could not find a palette with id: ${targetPaletteId}`)
    });
  });


  describe('GET /api/v1/palettes/:id', () => {
    it('should return a status code of 200 and a single palette object', async () => {
      const expectedPalette = await database('palettes').first();
        delete expectedPalette.created_at;
        delete expectedPalette.updated_at;

      const { id } = expectedPalette;
      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const result = response.body;
        delete result.created_at;
        delete result.updated_at;

      expect(response.status).toBe(200);
      expect(result).toEqual(expectedPalette);
    });

    it('should return a 404 if the specific palette is not found', async () => {
      const invalidId = -467;
  

      const response = await request(app).get(`/api/v1/palettes/${invalidId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Could not find a palette with id: ${invalidId}`);
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a status code of 200 and an array of palette objects', async () => {
      const receivedPalettes = await database('palettes').select();
      const expectedPalettes = receivedPalettes.map(palette => ({
        id: palette.id,
        title: palette.title,
        color_1_id: palette.color_1_id,
        color_2_id: palette.color_2_id,
        color_3_id: palette.color_3_id,
        color_4_id: palette.color_4_id,
        color_5_id: palette.color_5_id,
        project_id: palette.project_id
      }))
      const response = await request(app).get('/api/v1/palettes');
      const palettes = response.body;

      expect(response.status).toBe(200);
      expect(palettes).toEqual({ palettes: expectedPalettes});
    })
  });

  describe('POST /api/v1/palettes', () => {
    it('should post a new student to the db with a 201 status code', async () => {
      const project = await database('projects').first();
      const newPalette = {
        title: 'floor',
        color_1_id: '#fff443',
        color_2_id: '#fad443',
        color_3_id: '#fcd443',
        color_4_id: '#facd43',
        color_5_id: '#23f443',
        project_id: project.id,
      };
      const response = await request(app).post('/api/v1/palettes').send(newPalette);
      const palettes = await database('palettes').where('id', response.body.id);
      const palette = palettes[0];

      expect(response.status).toBe(201);
      expect(palette.title).toEqual(newPalette.title);
    });

    it('should return a 422 status code if there is a missing property', async () => {
      const project = await database('projects').first();
      const newPalette = {
        title: 'floor',
        color_2_id: '#fad443',
        color_3_id: '#fcd443',
        color_4_id: '#facd43',
        color_5_id: '#23f443',
        project_id: project.id, 
      };
      const response = await request(app).post('/api/v1/palettes').send(newPalette);
  
      expect(response.status).toBe(422);
      expect(response.body.error).toBe(`Expected format: { title: <String>, color_1_id: <String>, color_1_id: <String>, color_1_id: <String>, color_1_id: <String>, color_1_id: <String>, project_id: <Integer> }. You're missing a "color_1_id" property.`)
    });
  });
});

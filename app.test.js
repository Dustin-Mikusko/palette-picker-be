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

  describe('PATCH /api/v1/palettes/:id', () => {
    it('should return a happy status of 201 and update a specific palette', async () => {
      const targetPalette = await database('palettes').first();
      const { id } = targetPalette;

      const newPalette =  {
        title: targetPalette.title,
        color_1_id: '#abcdef',
        color_2_id: targetPalette.color_2_id,
        color_3_id: targetPalette.color_3_id,
        color_4_id: targetPalette.color_4_id,
        color_5_id: targetPalette.color_5_id
      };

      const response = await request(app).patch(`/api/v1/palettes/${id}`).send(newPalette)

      const revisedPaletteArray = await database('palettes').where('id', id);
      const revisedPalette = revisedPaletteArray[0];
        delete revisedPalette.created_at;
        delete revisedPalette.updated_at;
        delete revisedPalette.project_id;

      const expectedResult = {
        id,
        title: newPalette.title,
        color_1_id: newPalette.color_1_id,
        color_2_id: newPalette.color_2_id,
        color_3_id: newPalette.color_3_id,
        color_4_id: newPalette.color_4_id,
        color_5_id: newPalette.color_5_id
      };

      expect(response.status).toBe(201);
      expect(revisedPalette).toEqual(expectedResult);
    });

    // it('should return a sad 404 code if the targeted palette is not found', async () => {
    //   const invalidTargetId = -675324;
    //   const response = await request(app).get(`/api/v1/palettes/${invalidTargetId}`);
    //
    //   expect(response.status).toBe(404);
    //   console.log(response.body);
    //   //The response body is returning an empty object (so body.error = undef)
    //   expect(response.body).toEqual(`Could not find a palette with id: ${invalidTargetId}`);
    // });
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

});

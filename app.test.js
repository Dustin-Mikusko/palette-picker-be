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
      const projects = await database('projects').where('id', response.body.id[0]);
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

});

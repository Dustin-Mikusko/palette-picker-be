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

  // //GET one project
  describe('GET /api/v1/projects/:id', () => {
    it('should return a happy status code of 200 and a single project object', async () => {
      const expectedProject = await database('projects').first();
      delete expectedProject.created_at;
      delete expectedProject.updated_at;
      const { id } = expectedProject;

      const response = await request(app).get(`/api/v1/projects/${id}`);
      const result = response.body[0];
      delete result.created_at;
      delete result.updated_at;
      
      expect(response.status).toBe(200);
      expect(result).toEqual(expectedProject);
    });
  });

  // //GET all project
  // api/v1/projects
  // //Delete a project
  // 'api/v1/projects/:id'
  //   but first
  // Deletes all attached palettes   api/v1/projects/id:/palettes'
  // //POST a project
  // 'api/v1/projects'
  // //PUT title edit


});

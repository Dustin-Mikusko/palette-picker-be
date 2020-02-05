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

  describe('GET /api/v1/users/:id', () => {
    it('should return a happy status code of 200 and a single user object', async () => {
      const expectedUser = await database('users').first().select();
      console.log(expectedUser);
      const { id } = expectedUser;

      const response = await request(app).get(`/api/v1/students/${id}`);
      console.log(response.body);
      const result = response.body[0];

      expect(response.status).toBe(200);
      expect(result).toEqual(expectedUser);
    });
  });
});

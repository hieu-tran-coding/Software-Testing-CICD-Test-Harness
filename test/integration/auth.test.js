const request = require('supertest');
const app = require('../../src/app');
const memoryDb = require('../../src/store/memoryDb');

describe('Integration Tests: Authentication & User API (SuperTest)', () => {
  beforeEach(() => {
    memoryDb.reset();
  });

  const validUserData = {
    user: {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123'
    }
  };

  test('1. POST /api/users - Should register a new user successfully (201)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(validUserData);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('john@example.com');
    expect(res.body.user.username).toBe('john_doe');
    expect(res.body.user.token).toBeDefined();
    expect(typeof res.body.user.token).toBe('string');
  });

  test('2. POST /api/users - Should return 422 if email or username already taken', async () => {
    // First registration
    await request(app).post('/api/users').send(validUserData);

    // Duplicate email
    const duplicateRes = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'different_user',
          email: 'john@example.com',
          password: 'password123'
        }
      });

    expect(duplicateRes.status).toBe(422);
    expect(duplicateRes.body.errors.email).toBeDefined();
  });

  test('3. POST /api/users - Should return 422 if required fields are missing or invalid', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'u', // too short
          email: 'invalid-email',
          password: '123' // too short
        }
      });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('4. POST /api/users/login - Should login successfully with valid credentials (200)', async () => {
    // Register user first
    await request(app).post('/api/users').send(validUserData);

    // Attempt login
    const res = await request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'john@example.com',
          password: 'password123'
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.user.token).toBeDefined();
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('5. POST /api/users/login - Should return 422 on invalid password or wrong email', async () => {
    await request(app).post('/api/users').send(validUserData);

    // Wrong password
    const wrongPassRes = await request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'john@example.com',
          password: 'wrong_password'
        }
      });
    expect(wrongPassRes.status).toBe(422);

    // Non-existent email
    const nonExistRes = await request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'notfound@example.com',
          password: 'password123'
        }
      });
    expect(nonExistRes.status).toBe(422);
  });

  test('6. GET /api/user - Should retrieve current logged-in user with valid token (200)', async () => {
    const regRes = await request(app).post('/api/users').send(validUserData);
    const token = regRes.body.user.token;

    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Token ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('john_doe');
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('7. GET /api/user - Should return 401 when token is missing or invalid', async () => {
    const resNoToken = await request(app).get('/api/user');
    expect(resNoToken.status).toBe(401);

    const resBadToken = await request(app)
      .get('/api/user')
      .set('Authorization', 'Token invalid.token.value');
    expect(resBadToken.status).toBe(401);
  });

  test('8. PUT /api/user - Should update user bio and image successfully (200)', async () => {
    const regRes = await request(app).post('/api/users').send(validUserData);
    const token = regRes.body.user.token;

    const res = await request(app)
      .put('/api/user')
      .set('Authorization', `Token ${token}`)
      .send({
        user: {
          bio: 'Automated Testing Specialist',
          image: 'https://avatar.png'
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.user.bio).toBe('Automated Testing Specialist');
    expect(res.body.user.image).toBe('https://avatar.png');
  });
});

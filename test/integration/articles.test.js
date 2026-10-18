const request = require('supertest');
const app = require('../../src/app');
const memoryDb = require('../../src/store/memoryDb');

describe('Integration Tests: Articles CRUD & Operations API (SuperTest)', () => {
  let authorToken;
  let secondUserToken;

  beforeEach(async () => {
    memoryDb.reset();

    // Create author user
    const res1 = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'author_one',
          email: 'author@example.com',
          password: 'password123'
        }
      });
    authorToken = res1.body.user.token;

    // Create second user
    const res2 = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'reader_two',
          email: 'reader@example.com',
          password: 'password123'
        }
      });
    secondUserToken = res2.body.user.token;
  });

  test('1. POST /api/articles - Should create article when authenticated (201)', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Comprehensive Guide to CI/CD',
          description: 'Best practices for automated testing in pipeline',
          body: 'Detailed steps on configuring test harnesses with Jest & SuperTest.',
          tagList: ['cicd', 'testing', 'automation']
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.article).toBeDefined();
    expect(res.body.article.title).toBe('Comprehensive Guide to CI/CD');
    expect(res.body.article.slug.startsWith('comprehensive-guide-to-cicd')).toBe(true);
    expect(res.body.article.author.username).toBe('author_one');
    expect(res.body.article.tagList).toContain('cicd');
  });

  test('2. POST /api/articles - Should return 401 when creating article without auth', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({
        article: {
          title: 'Unauthenticated Article',
          description: 'No token',
          body: 'This should fail'
        }
      });

    expect(res.status).toBe(401);
  });

  test('3. POST /api/articles - Should return 422 if required fields are blank', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: '',
          description: '',
          body: ''
        }
      });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('4. GET /api/articles - Should list articles with pagination and tag filter (200)', async () => {
    // Seed 2 articles
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Article 1',
          description: 'Desc 1',
          body: 'Body 1',
          tagList: ['nodejs']
        }
      });

    await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Article 2',
          description: 'Desc 2',
          body: 'Body 2',
          tagList: ['jest']
        }
      });

    const res = await request(app)
      .get('/api/articles?limit=10&offset=0')
      .query({ tag: 'nodejs' });

    expect(res.status).toBe(200);
    expect(res.body.articles.length).toBe(1);
    expect(res.body.articles[0].title).toBe('Article 1');
    expect(res.body.articlesCount).toBe(1);
  });

  test('5. GET /api/articles/:slug - Should get single article by slug (200) or 404', async () => {
    const created = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Single Fetch Test',
          description: 'Desc',
          body: 'Body'
        }
      });
    const slug = created.body.article.slug;

    // Existing article
    const resSuccess = await request(app).get(`/api/articles/${slug}`);
    expect(resSuccess.status).toBe(200);
    expect(resSuccess.body.article.title).toBe('Single Fetch Test');

    // Non-existent article
    const resNotFound = await request(app).get('/api/articles/non-existent-slug-xyz');
    expect(resNotFound.status).toBe(404);
  });

  test('6. PUT /api/articles/:slug - Author can update article (200), non-author gets 403', async () => {
    const created = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Original Title',
          description: 'Original Desc',
          body: 'Original Body'
        }
      });
    const slug = created.body.article.slug;

    // Non-author tries to update -> 403
    const resForbidden = await request(app)
      .put(`/api/articles/${slug}`)
      .set('Authorization', `Token ${secondUserToken}`)
      .send({ article: { title: 'Hacked Title' } });
    expect(resForbidden.status).toBe(403);

    // Author updates -> 200
    const resSuccess = await request(app)
      .put(`/api/articles/${slug}`)
      .set('Authorization', `Token ${authorToken}`)
      .send({ article: { description: 'Updated Description' } });
    expect(resSuccess.status).toBe(200);
    expect(resSuccess.body.article.description).toBe('Updated Description');
  });

  test('7. DELETE /api/articles/:slug - Author can delete article (200), non-author gets 403', async () => {
    const created = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'To Be Deleted',
          description: 'Desc',
          body: 'Body'
        }
      });
    const slug = created.body.article.slug;

    // Non-author attempts delete -> 403
    const resForbidden = await request(app)
      .delete(`/api/articles/${slug}`)
      .set('Authorization', `Token ${secondUserToken}`);
    expect(resForbidden.status).toBe(403);

    // Author deletes -> 200
    const resSuccess = await request(app)
      .delete(`/api/articles/${slug}`)
      .set('Authorization', `Token ${authorToken}`);
    expect(resSuccess.status).toBe(200);

    // Verify deleted
    const resCheck = await request(app).get(`/api/articles/${slug}`);
    expect(resCheck.status).toBe(404);
  });

  test('8. POST & DELETE /api/articles/:slug/favorite - Favorite and unfavorite', async () => {
    const created = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${authorToken}`)
      .send({
        article: {
          title: 'Favorite Test Article',
          description: 'Desc',
          body: 'Body'
        }
      });
    const slug = created.body.article.slug;

    // Favorite
    const favRes = await request(app)
      .post(`/api/articles/${slug}/favorite`)
      .set('Authorization', `Token ${secondUserToken}`);
    expect(favRes.status).toBe(200);
    expect(favRes.body.article.favorited).toBe(true);
    expect(favRes.body.article.favoritesCount).toBe(1);

    // Unfavorite
    const unfavRes = await request(app)
      .delete(`/api/articles/${slug}/favorite`)
      .set('Authorization', `Token ${secondUserToken}`);
    expect(unfavRes.status).toBe(200);
    expect(unfavRes.body.article.favorited).toBe(false);
    expect(unfavRes.body.article.favoritesCount).toBe(0);
  });
});

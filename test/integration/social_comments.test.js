const request = require('supertest');
const app = require('../../src/app');
const memoryDb = require('../../src/store/memoryDb');

describe('Integration Tests: Profiles, Follow, Comments & Tags API (SuperTest)', () => {
  let user1Token;
  let user2Token;
  let articleSlug;

  beforeEach(async () => {
    memoryDb.reset();

    // Register User 1
    const res1 = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'alice_smith',
          email: 'alice@example.com',
          password: 'password123'
        }
      });
    user1Token = res1.body.user.token;

    // Register User 2
    const res2 = await request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'bob_jones',
          email: 'bob@example.com',
          password: 'password123'
        }
      });
    user2Token = res2.body.user.token;

    // Create an article by User 1
    const artRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Token ${user1Token}`)
      .send({
        article: {
          title: 'Social Features in RealWorld',
          description: 'Exploring follow and comments',
          body: 'This article demonstrates social capabilities.',
          tagList: ['community', 'testing']
        }
      });
    articleSlug = artRes.body.article.slug;
  });

  describe('Profiles & Follow', () => {
    test('1. GET /api/profiles/:username - Should fetch profile (200) or 404', async () => {
      const res = await request(app).get('/api/profiles/alice_smith');
      expect(res.status).toBe(200);
      expect(res.body.profile.username).toBe('alice_smith');
      expect(res.body.profile.following).toBe(false);

      const notFoundRes = await request(app).get('/api/profiles/ghost_user');
      expect(notFoundRes.status).toBe(404);
    });

    test('2. POST & DELETE /api/profiles/:username/follow - Should follow and unfollow profile (200)', async () => {
      // Bob follows Alice
      const followRes = await request(app)
        .post('/api/profiles/alice_smith/follow')
        .set('Authorization', `Token ${user2Token}`);
      expect(followRes.status).toBe(200);
      expect(followRes.body.profile.following).toBe(true);

      // Bob unfollows Alice
      const unfollowRes = await request(app)
        .delete('/api/profiles/alice_smith/follow')
        .set('Authorization', `Token ${user2Token}`);
      expect(unfollowRes.status).toBe(200);
      expect(unfollowRes.body.profile.following).toBe(false);
    });
  });

  describe('Comments API', () => {
    test('3. POST /api/articles/:slug/comments - Should add comment with auth (201)', async () => {
      const res = await request(app)
        .post(`/api/articles/${articleSlug}/comments`)
        .set('Authorization', `Token ${user2Token}`)
        .send({
          comment: {
            body: 'Insightful article! Thanks for sharing.'
          }
        });

      expect(res.status).toBe(201);
      expect(res.body.comment).toBeDefined();
      expect(res.body.comment.body).toBe('Insightful article! Thanks for sharing.');
      expect(res.body.comment.author.username).toBe('bob_jones');
    });

    test('4. POST /api/articles/:slug/comments - Should return 401 without auth', async () => {
      const res = await request(app)
        .post(`/api/articles/${articleSlug}/comments`)
        .send({
          comment: {
            body: 'Unauthenticated comment'
          }
        });

      expect(res.status).toBe(401);
    });

    test('5. GET /api/articles/:slug/comments - Should list all comments of an article (200)', async () => {
      // Add comment first
      await request(app)
        .post(`/api/articles/${articleSlug}/comments`)
        .set('Authorization', `Token ${user2Token}`)
        .send({
          comment: { body: 'First comment' }
        });

      const res = await request(app).get(`/api/articles/${articleSlug}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.comments.length).toBe(1);
      expect(res.body.comments[0].body).toBe('First comment');
    });

    test('6. DELETE /api/articles/:slug/comments/:id - Author can delete comment (200), non-author gets 403', async () => {
      const commentRes = await request(app)
        .post(`/api/articles/${articleSlug}/comments`)
        .set('Authorization', `Token ${user2Token}`)
        .send({
          comment: { body: 'Comment to delete' }
        });
      const commentId = commentRes.body.comment.id;

      // Alice tries to delete Bob's comment -> 403
      const resForbidden = await request(app)
        .delete(`/api/articles/${articleSlug}/comments/${commentId}`)
        .set('Authorization', `Token ${user1Token}`);
      expect(resForbidden.status).toBe(403);

      // Bob deletes own comment -> 200
      const resSuccess = await request(app)
        .delete(`/api/articles/${articleSlug}/comments/${commentId}`)
        .set('Authorization', `Token ${user2Token}`);
      expect(resSuccess.status).toBe(200);
    });
  });

  describe('Tags API', () => {
    test('7. GET /api/tags - Should return all tags in the platform (200)', async () => {
      const res = await request(app).get('/api/tags');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.tags)).toBe(true);
      expect(res.body.tags).toContain('community');
      expect(res.body.tags).toContain('testing');
    });
  });
});

const UserModel = require('../../src/models/user');
const ArticleModel = require('../../src/models/article');
const CommentModel = require('../../src/models/comment');

describe('Unit Tests: Domain Models (UserModel, ArticleModel, CommentModel)', () => {
  describe('UserModel', () => {
    test('1. UserModel.validate should accept valid user data', () => {
      const res = UserModel.validate({
        username: 'alice_tester',
        email: 'alice@example.com',
        password: 'password123'
      });
      expect(res.isValid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    test('2. UserModel.validate should return errors for invalid user data', () => {
      const res = UserModel.validate({
        username: 'al',
        email: 'not-an-email',
        password: '123'
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.length).toBe(3);
    });

    test('3. UserModel.create should hash password and initialize user properties with defaults', async () => {
      const raw = {
        username: 'bob_builder',
        email: 'bob@example.com',
        password: 'secretPassword!'
      };
      const user = await UserModel.create(raw);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(raw.username);
      expect(user.email).toBe(raw.email);
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(raw.password);
      expect(Array.isArray(user.following)).toBe(true);
      expect(user.bio).toBe('');
      expect(user.image).toBeDefined();
    });

    test('4. UserModel.create should throw if validation fails', async () => {
      await expect(UserModel.create({ username: 'bad' })).rejects.toThrow();
    });

    test('5. UserModel.verifyPassword accurately checks password against hash and handles nulls', async () => {
      const user = await UserModel.create({
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'mypassword123'
      });

      const isCorrect = await UserModel.verifyPassword('mypassword123', user.passwordHash);
      const isWrong = await UserModel.verifyPassword('wrongpassword', user.passwordHash);
      const isNullPlain = await UserModel.verifyPassword(null, user.passwordHash);
      const isNullHash = await UserModel.verifyPassword('mypassword123', null);

      expect(isCorrect).toBe(true);
      expect(isWrong).toBe(false);
      expect(isNullPlain).toBe(false);
      expect(isNullHash).toBe(false);
    });

    test('6. UserModel.toUserResponse and toProfileResponse format correct payloads and handle nulls', () => {
      expect(UserModel.toUserResponse(null)).toBeNull();
      expect(UserModel.toProfileResponse(null)).toBeNull();

      const user = {
        id: 'u_1',
        username: 'diana',
        email: 'diana@example.com',
        bio: 'Tester bio',
        image: 'https://example.com/avatar.jpg'
      };

      const userRes = UserModel.toUserResponse(user, 'sample-jwt-token');
      expect(userRes.user.email).toBe(user.email);
      expect(userRes.user.token).toBe('sample-jwt-token');

      const profileRes = UserModel.toProfileResponse(user, true);
      expect(profileRes.profile.username).toBe(user.username);
      expect(profileRes.profile.following).toBe(true);

      const profileResNotFollowing = UserModel.toProfileResponse(user, false);
      expect(profileResNotFollowing.profile.following).toBe(false);
    });
  });

  describe('ArticleModel', () => {
    const author = {
      id: 'author_1',
      username: 'author_john',
      bio: 'Author bio',
      image: 'https://avatar.png'
    };

    test('7. ArticleModel.create should generate unique slug and sanitize fields', () => {
      const input = {
        title: 'Jest & SuperTest Mastery',
        description: 'How to write tests',
        body: 'Full guide content',
        tagList: ['NodeJS', 'Testing', 'nodejs'] // duplicate check
      };

      const article = ArticleModel.create(input, author);

      expect(article.slug).toBeDefined();
      expect(article.slug.startsWith('jest-supertest-mastery')).toBe(true);
      expect(article.author.username).toBe(author.username);
      expect(article.tagList).toEqual(['nodejs', 'testing']);
      expect(article.favoritesCount).toBe(0);
    });

    test('8. ArticleModel.create should reject missing author or invalid fields', () => {
      expect(() => ArticleModel.create({ title: 'Valid', description: 'desc', body: 'body' }, null)).toThrow('Article must have an author');
      expect(() => ArticleModel.create({ title: '' }, author)).toThrow();
    });

    test('9. ArticleModel.update should update fields, tags and regenerate slug if title changes', () => {
      expect(() => ArticleModel.update(null)).toThrow('Article to update is required');

      const initial = ArticleModel.create({
        title: 'Initial Title',
        description: 'Initial desc',
        body: 'Initial body'
      }, author);

      const updated = ArticleModel.update(initial, {
        title: 'Updated Title',
        description: 'Updated desc',
        body: 'Updated body content',
        tagList: ['newtag', 'UPDATED']
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.slug.startsWith('updated-title')).toBe(true);
      expect(updated.body).toBe('Updated body content');
      expect(updated.description).toBe('Updated desc');
      expect(updated.tagList).toContain('newtag');
      expect(updated.tagList).toContain('updated');
    });

    test('10. ArticleModel.toArticleResponse evaluates favorited and following states and handles null', () => {
      expect(ArticleModel.toArticleResponse(null)).toBeNull();

      const article = ArticleModel.create({
        title: 'Favorite Me',
        description: 'Desc',
        body: 'Body'
      }, author);

      article.favoritedBy = ['current_user_id'];
      article.favoritesCount = 1;

      const currentUser = {
        id: 'current_user_id',
        username: 'reader',
        following: [author.username]
      };

      const formatted = ArticleModel.toArticleResponse(article, currentUser);
      expect(formatted.article.favorited).toBe(true);
      expect(formatted.article.author.following).toBe(true);
      expect(formatted.article.favoritesCount).toBe(1);

      // Without current user
      const formattedPublic = ArticleModel.toArticleResponse(article, null);
      expect(formattedPublic.article.favorited).toBe(false);
      expect(formattedPublic.article.author.following).toBe(false);
    });
  });

  describe('CommentModel', () => {
    const author = { username: 'commenter', bio: '', image: null };

    test('11. CommentModel.validate and create validates body and formats comment response', () => {
      expect(() => CommentModel.create({ body: 'Hello' }, null, 'slug-1')).toThrow('Comment must have an author');
      expect(() => CommentModel.create({ body: '' }, author, 'slug-1')).toThrow("body can't be blank");

      const comment = CommentModel.create({ body: 'Great article!' }, author, 'slug-1');
      expect(comment.id).toBeDefined();
      expect(comment.body).toBe('Great article!');

      expect(CommentModel.toCommentResponse(null)).toBeNull();

      const formatted = CommentModel.toCommentResponse(comment, null);
      expect(formatted.comment.id).toBe(comment.id);
      expect(formatted.comment.author.username).toBe(author.username);
      expect(formatted.comment.author.following).toBe(false);

      const currentUserFollowing = { username: 'reader', following: [author.username] };
      const formattedFollowing = CommentModel.toCommentResponse(comment, currentUserFollowing);
      expect(formattedFollowing.comment.author.following).toBe(true);
    });
  });
});

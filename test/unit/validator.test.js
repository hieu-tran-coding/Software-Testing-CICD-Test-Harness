const {
  validateEmail,
  validateUsername,
  validatePassword,
  validateArticleInput,
  sanitizeString
} = require('../../src/utils/validator');

describe('Unit Tests: Validator Utility (src/utils/validator.js)', () => {
  describe('validateEmail', () => {
    test('1. should accept valid emails', () => {
      expect(validateEmail('student@university.edu.vn')).toBe(true);
      expect(validateEmail('john.doe+test@gmail.com')).toBe(true);
    });

    test('2. should reject invalid emails', () => {
      expect(validateEmail('not-an-email')).toBe(false);
      expect(validateEmail('@missinguser.com')).toBe(false);
      expect(validateEmail('missingdomain@')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validateUsername', () => {
    test('3. should accept valid usernames (alphanumeric, underscores, hyphens)', () => {
      expect(validateUsername('john_doe')).toBe(true);
      expect(validateUsername('alex-99')).toBe(true);
      expect(validateUsername('admin')).toBe(true);
    });

    test('4. should reject usernames that are too short, too long or contain symbols', () => {
      expect(validateUsername('ab')).toBe(false); // < 3 chars
      expect(validateUsername('a'.repeat(35))).toBe(false); // > 30 chars
      expect(validateUsername('user!@#$')).toBe(false);
      expect(validateUsername('')).toBe(false);
      expect(validateUsername(null)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('5. should enforce minimum password length (default 6)', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('strongPassword123')).toBe(true);
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe('validateArticleInput', () => {
    test('6. should validate that title, description and body are present', () => {
      const valid = validateArticleInput({
        title: 'CI/CD Guide',
        description: 'Comprehensive guide to CI/CD',
        body: 'Details about pipeline'
      });
      expect(valid.isValid).toBe(true);
      expect(valid.errors.length).toBe(0);
    });

    test('7. should flag errors when fields are blank', () => {
      const invalid = validateArticleInput({
        title: '   ',
        description: '',
        body: null
      });
      expect(invalid.isValid).toBe(false);
      expect(invalid.errors).toContain("title can't be blank");
      expect(invalid.errors).toContain("description can't be blank");
      expect(invalid.errors).toContain("body can't be blank");
    });
  });

  describe('sanitizeString', () => {
    test('8. should strip script tags and HTML brackets', () => {
      const dirty = '<script>alert("xss")</script><b>Hello</b>';
      const clean = sanitizeString(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('</script>');
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
      expect(clean).toContain('Hello');
    });

    test('9. should handle non-string values gracefully', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(123)).toBe('');
    });
  });
});

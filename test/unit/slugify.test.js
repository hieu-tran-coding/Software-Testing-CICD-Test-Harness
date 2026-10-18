const { slugify } = require('../../src/utils/slugify');

describe('Unit Tests: Slugify Utility (src/utils/slugify.js)', () => {
  test('1. should convert standard string to lowercase hyphenated slug', () => {
    const title = 'How to Train Your Dragon';
    const result = slugify(title);
    expect(result).toBe('how-to-train-your-dragon');
  });

  test('2. should strip special characters, symbols, and redundant spaces', () => {
    const title = '  Hello, World! @ CI/CD & Testing #2026?  ';
    const result = slugify(title);
    expect(result).toBe('hello-world-cicd-testing-2026');
  });

  test('3. should strip Vietnamese diacritics and accents correctly', () => {
    const title = 'Kiểm thử phần mềm tự động với Jest';
    const result = slugify(title);
    expect(result).toBe('kiem-thu-phan-mem-tu-dong-voi-jest');
  });

  test('4. should handle empty, null or non-string inputs safely', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
    expect(slugify(12345)).toBe('');
  });

  test('5. should append random unique suffix when suffix is set to true', () => {
    const title = 'My Article';
    const result1 = slugify(title, true);
    const result2 = slugify(title, true);

    expect(result1.startsWith('my-article-')).toBe(true);
    expect(result2.startsWith('my-article-')).toBe(true);
    expect(result1).not.toBe(result2);
  });

  test('6. should append custom string suffix when provided', () => {
    const title = 'My Article';
    const result = slugify(title, 'v2');
    expect(result).toBe('my-article-v2');
  });
});

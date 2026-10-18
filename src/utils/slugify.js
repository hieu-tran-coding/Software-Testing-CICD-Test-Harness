/**
 * Convert string to URL-friendly slug
 * @param {string} title - raw title text
 * @param {string|boolean} suffix - optional suffix or boolean to auto-append suffix
 * @returns {string} slug string
 */
function slugify(title, suffix = '') {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Replace Vietnamese đ/Đ and normalize diacritics
  let slug = title
    .replace(/[đĐ]/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  // Replace non-alphanumeric characters with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (suffix === true) {
    const randomHex = Math.random().toString(36).substring(2, 8);
    return slug ? `${slug}-${randomHex}` : randomHex;
  }

  if (typeof suffix === 'string' && suffix.trim() !== '') {
    return slug ? `${slug}-${suffix.trim()}` : suffix.trim();
  }

  return slug;
}

module.exports = {
  slugify
};

const { parsePagination, formatPaginatedResponse } = require('../../src/utils/paginate');

describe('Unit Tests: Pagination Utility (src/utils/paginate.js)', () => {
  describe('parsePagination', () => {
    test('1. should return default limit (20) and offset (0) when query is empty', () => {
      const res = parsePagination({});
      expect(res.limit).toBe(20);
      expect(res.offset).toBe(0);
    });

    test('2. should parse valid integer limit and offset from string query', () => {
      const res = parsePagination({ limit: '10', offset: '30' });
      expect(res.limit).toBe(10);
      expect(res.offset).toBe(30);
    });

    test('3. should clamp limit to maxLimit when exceeding', () => {
      const res = parsePagination({ limit: '500' }, 20, 100);
      expect(res.limit).toBe(100);
    });

    test('4. should handle invalid, negative, or NaN pagination inputs with fallbacks', () => {
      const res = parsePagination({ limit: '-5', offset: 'invalid' });
      expect(res.limit).toBe(20);
      expect(res.offset).toBe(0);
    });
  });

  describe('formatPaginatedResponse', () => {
    test('5. should format metadata accurately with multiple pages and hasMore=true', () => {
      const items = [1, 2, 3, 4, 5];
      const res = formatPaginatedResponse(items, 15, 5, 0);

      expect(res.items).toEqual(items);
      expect(res.totalCount).toBe(15);
      expect(res.limit).toBe(5);
      expect(res.offset).toBe(0);
      expect(res.currentPage).toBe(1);
      expect(res.totalPages).toBe(3);
      expect(res.hasMore).toBe(true);
    });

    test('6. should format metadata when at the last page (hasMore=false)', () => {
      const items = [11, 12];
      const res = formatPaginatedResponse(items, 12, 5, 10);

      expect(res.currentPage).toBe(3);
      expect(res.totalPages).toBe(3);
      expect(res.hasMore).toBe(false);
    });

    test('7. should handle zero total items cleanly', () => {
      const res = formatPaginatedResponse([], 0, 10, 0);
      expect(res.totalCount).toBe(0);
      expect(res.totalPages).toBe(0);
      expect(res.hasMore).toBe(false);
    });
  });
});

/**
 * Parse pagination parameters from request query
 * @param {object} query - request query object
 * @param {number} defaultLimit - default page size (default: 20)
 * @param {number} maxLimit - max allowed page size (default: 100)
 * @returns {{ limit: number, offset: number }}
 */
function parsePagination(query = {}, defaultLimit = 20, maxLimit = 100) {
  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit <= 0) {
    limit = defaultLimit;
  }
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  let offset = parseInt(query.offset, 10);
  if (isNaN(offset) || offset < 0) {
    offset = 0;
  }

  return { limit, offset };
}

/**
 * Format pagination response metadata
 * @param {Array} items - slice of items
 * @param {number} totalCount - total items count
 * @param {number} limit - page limit used
 * @param {number} offset - offset used
 * @returns {object}
 */
function formatPaginatedResponse(items = [], totalCount = 0, limit = 20, offset = 0) {
  const safeTotal = Math.max(0, totalCount);
  const safeLimit = Math.max(1, limit);
  const safeOffset = Math.max(0, offset);

  const totalPages = Math.ceil(safeTotal / safeLimit);
  const currentPage = Math.floor(safeOffset / safeLimit) + 1;
  const hasMore = safeOffset + items.length < safeTotal;

  return {
    items,
    totalCount: safeTotal,
    limit: safeLimit,
    offset: safeOffset,
    currentPage,
    totalPages,
    hasMore
  };
}

module.exports = {
  parsePagination,
  formatPaginatedResponse
};

/**
 * Shared pagination utility.
 *
 * Parses `limit` and `offset` from Express query parameters with sane
 * defaults and a configurable upper bound so that individual routes don't
 * have to repeat the same clamping logic.
 *
 * @param {object} query   - req.query from Express
 * @param {object} [defaults]
 * @param {number} [defaults.limit=50]     - default page size
 * @param {number} [defaults.maxLimit=200] - hard upper bound for limit
 * @returns {{ limit: number, offset: number }}
 */
function parsePagination(query, defaults = { limit: 50, maxLimit: 200 }) {
  const limit = Math.min(
    parseInt(query.limit) || defaults.limit,
    defaults.maxLimit
  );
  const offset = parseInt(query.offset) || 0;
  return { limit, offset };
}

module.exports = { parsePagination };

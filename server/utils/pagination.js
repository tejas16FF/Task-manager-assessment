function getPaginationOptions(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return {
    limit,
    page,
    skip,
  };
}

function getPaginationMeta({ total, page, limit }) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  getPaginationMeta,
  getPaginationOptions,
};

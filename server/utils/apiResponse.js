function sendSuccess(res, {
  data = null,
  message = "Success",
  statusCode = 200,
  meta,
} = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

function sendCreated(res, data, message = "Created successfully") {
  return sendSuccess(res, {
    data,
    message,
    statusCode: 201,
  });
}

module.exports = {
  sendCreated,
  sendSuccess,
};

// src/utils/apiResponse.js
exports.successResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

exports.errorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: 'error',
        message,
    });
};
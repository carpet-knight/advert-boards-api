const errors = require('../utils/errors');
const responseBody = require('../utils/responseBody');


function notFoundHandler(req, res) {
    return res.status(404).json(responseBody.notFound());
}

function notAllowedHandler(req, res) {
    return res.status(405).json(responseBody.methodNotAllowed());
}

function badRequestHandler(err, req, res, next) {
    if (err.status === 400)
        return res.status(400).json(responseBody.badRequest(err.message));

    next(err);
}

function serverErrorHandler(err, req, res, next) {
    if (err.status === 500)
        return res.status(500).json(responseBody.custom(500, 'Internal Server Error', err.message));

    next(err);
}

function basicErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json(responseBody.serverError());
}

module.exports = {
    notFoundHandler,
    notAllowedHandler,
    badRequestHandler,
    serverErrorHandler,
    basicErrorHandler
}
const errors = require('../utils/errors');
const responseBody = require('../utils/responseBody');


function notFoundHandler(req, res) {
    return res.status(404).json(responseBody.notFound());
}

function notAllowedHandler(req, res) {
    return res.status(405).json(responseBody.methodNotAllowed());
}

function emptyQueryHandler(err, req, res, next) {
    if (err.name === errors.emptyQuery.name)
        return res.status(400).json(responseBody.badRequest(err.message))

    next(err);
}

function invalidQueryParamsHandler(err, req, res, next) {
    if (err.name === errors.invalidQueryParams.name)
        return res.status(400).json(responseBody.badRequest(err.message));

    next(err);
}

function basicErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json(responseBody.serverError());
}

module.exports = {
    notFoundHandler,
    notAllowedHandler,
    emptyQueryHandler,
    invalidQueryParamsHandler,
    basicErrorHandler
}
const errors = require('../utils/errors');

function validateParams(req, res, next) {
    const q = req.query.q;

    if (!q)
        return next(errors.emptyQuery);

    // in case q is an Array
    req.query.q = String(q);

    let pmin = req.query.pmin;

    if (pmin) {
        pmin = Number(pmin);
        if (isNaN(pmin) || pmin < 0)
            return next(errors.invalidQueryParams);

        req.query.pmin = pmin;
    }

    let pmax = req.query.pmax;

    if (pmax) {
        pmax = Number(pmax);
        if (isNaN(pmax) || pmax < 0 || (pmin && pmax < pmin))
            return next(errors.invalidQueryParams);

        req.query.pmax = pmax;
    }

    let limit = req.query.limit;

    if (limit) {
        limit = Number(limit);
        if (isNaN(limit) || limit <= 0)
            return next(errors.invalidQueryParams);

        req.query.limit = limit;
    }

    next();
}

module.exports = {
    validateParams
}
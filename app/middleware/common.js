const utils = require('../utils/common');
const errors = require('../utils/errors');
const regions = require('../utils/regions');
const { app } = require('../config/default');
const responseBody = require('../utils/responseBody');

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

    } else {
        limit = app.defaultLimit;
    }

    req.query.limit = limit;

    let region = req.query.region;

    if (region) {
        if (!regions.includes(region))
            return next(errors.invalidQueryParams);

    } else {
        region = app.defaultRegion;
    }

    req.query.region = region;

    next();
}

async function fetchExternalData(req, res, next) {
    let html, doc;

    try {
        html = await utils.getContent(req.externalResourseUrl);
    } catch {
        return next(errors.fetchError);
    }

    try {
        doc = utils.formDocument(html);
        req.doc = doc;
    } catch {
        return next(errors.parseError);
    }

    next();
}

function sendCollectedData(req, res) {
    if (!res.data)
        res.data = [];

    res.json(responseBody.success(res.data));
}

module.exports = {
    validateParams,
    fetchExternalData,
    sendCollectedData
}
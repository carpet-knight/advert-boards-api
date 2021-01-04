const { Router } = require('express');
const avitoMiddleware = require('../middleware/avito');
const commonMiddleware = require('../middleware/common');
const commonErrorHandlers = require('../error_handlers/common');

const router = Router();

router
    .get('/', [
        commonMiddleware.validateParams,
        avitoMiddleware.formExternalResourseUrl,
        commonMiddleware.fetchExternalData,
        avitoMiddleware.getAdvertsData,
        commonMiddleware.sendCollectedData
    ])
    .all('/', commonErrorHandlers.notAllowedHandler);

module.exports = router;
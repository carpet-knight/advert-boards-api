const { Router } = require('express');
const { validateParams } = require('../middleware/common');
const commonErrorHandlers = require('../error_handlers/common');

const router = Router();

router
    .get('/', [
        validateParams,
        (req, res) => res.send('Hello from Avito!')
    ])
    .all('/', commonErrorHandlers.notAllowedHandler)
    .use([
        commonErrorHandlers.emptyQueryHandler,
        commonErrorHandlers.invalidQueryParamsHandler
    ]);

module.exports = router;
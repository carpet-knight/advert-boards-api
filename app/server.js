const express = require('express');

// Config information
const { server } = require('./config/default');

// Routes
const avitoRouter = require('./routes/avito');

// Error handlers (application level)
const commonErrorHandlers = require('./error_handlers/common');

const app = express();

// Remove X-Powered-By HTTP header
app.set('x-powered-by', false);

// Specify routes
app.use('/api/avito', avitoRouter);

// Specify application level error handlers
app.use(commonErrorHandlers.notFoundHandler);
app.use(commonErrorHandlers.badRequestHandler);
app.use(commonErrorHandlers.serverErrorHandler);
app.use(commonErrorHandlers.basicErrorHandler);

app.listen(server.port, server.host, () => {
    console.log(`Running on http://${server.host}:${server.port}`);
});
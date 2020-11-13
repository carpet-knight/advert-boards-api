const express = require('express');

// Config information
const { server } = require('./config/default');

// Routes
const avitoRouter = require('./routes/avito');

// Error handlers (application level)
const commonErrorHandlers = require('./error_handlers/common');

const app = express();
app.use('/api/avito', avitoRouter);

app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.use(commonErrorHandlers);

app.listen(server.port, server.host, () => {
    console.log(`Running on http://${server.host}:${server.port}`);
});
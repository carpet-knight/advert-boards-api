module.exports = {
    server: {
        host: '127.0.0.1',
        port: 9000
    },
    app: {
        parserSettings: {
            locator: {},
            errorHandler: {
                warning: (w) => { }, // suppress warnings
                error: (e) => { },  // suppress minor errors
                fatalError: (e) => console.error(e)
            }
        }
    }
}
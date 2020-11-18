module.exports = {
    emptyQuery: {
        name: 'EmptyQueryError',
        message: `Empty query sent. Parameter 'q' required`
    },

    invalidQueryParams: {
        name: 'InvalidQueryParamsError',
        message: 'Invalid query parameters sent'
    }
}
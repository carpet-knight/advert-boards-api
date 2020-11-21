module.exports = {
    emptyQuery: {
        name: 'EmptyQueryError',
        status: 400,
        message: `Empty query sent. Parameter 'q' required`
    },

    invalidQueryParams: {
        name: 'InvalidQueryParamsError',
        status: 400,
        message: 'Invalid query parameters sent'
    },

    fetchError: {
        name: 'FetchError',
        status: 500,
        message: 'Failed to fetch data from external resource'
    },

    parseError: {
        name: 'ParseError',
        status: 500,
        message: 'Failed to parse data from external resource'
    }
}
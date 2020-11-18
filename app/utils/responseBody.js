module.exports = {
    success: (data) => {
        return {
            status: 200,
            type: 'OK',
            data: data
        }
    },

    badRequest: (message) => {
        return {
            status: 400,
            type: 'Bad Request',
            message: message
        }
    },

    notFound: () => {
        return {
            status: 404,
            type: 'Not Found',
            message: 'Requested resource not found'
        }
    },

    methodNotAllowed: () => {
        return {
            status: 405,
            type: 'Method Not Allowed',
            message: 'Request method not allowed'
        }
    },

    serverError: () => {
        return {
            status: 500,
            type: 'Internal Server Error',
            message: 'Something went terribly wrong'
        }
    },

    custom: (status, type, message) => {
        return {
            status: status,
            type: type,
            message: message
        }
    }
}
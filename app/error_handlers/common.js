function basicErrorHandler(err, req, res, next) {
    console.error(err);
    res.send('500 ERROR');
}

module.exports = [
    basicErrorHandler
]
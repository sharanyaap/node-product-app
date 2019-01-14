// app/lib/appKeyMiddleware.js
module.exports = function(req, res, next) {
    console.log('appkey middleware', req.path, req.query)
    // /protected?APP_KEY=ABC
    const key = req.query.APP_KEY;
    if (key === 'ABC') {
        return next();
    }

    // key is undefined
    if (!key) {
        // bad request
        console.log('bad request, no key');
        return res.status(400).json({
            error: 'KEY is missing'
        });
    }

    console.log('forbidden, key doesnt match' )
    return res.status(403);
}
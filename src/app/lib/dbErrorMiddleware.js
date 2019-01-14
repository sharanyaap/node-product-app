/**
 * Created by sharanya.p on 11/19/2018.
 */
module.exports = function (err, req, res, next) {
    console.log("db error middlware");

    if (err instanceof DbError){
        return res.status(500).json({error: 'DB Error '+ err.code});
    }

    console.log('forward error to next error middlware');
    return next(err);
}
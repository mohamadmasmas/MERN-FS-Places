const jwt = require('jsonwebtoken')
const RequestError = require('../models/http-error');

module.exports = ( req, res, next ) => {

    if(req.method === 'OPTIONS'){
        return next()
    }

    let token;
    try {
        token = req.headers.authorization.split(" ")[1];

        if(!token){
            const error = new RequestError('Authorization failed', 401);
            return next(error)
        };
        const decodedToken = jwt.verify(token, 'my_secret');
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (e) {
        console.log(e)
        const error = new RequestError('Authorization failed', 401);
        return next(error)
    }
    

}
const jwt = require('jsonwebtoken')

const { ForbiddenRequestError } = require('./../errorHandling/errors')

function authorization(req, res, next){

    const token = req.cookies.access_token;
    
	if (!token) {
		console.log("token null")
		return next(new ForbiddenRequestError("Please Login"));
	}

	try{
		const data = jwt.verify(token, "secret_key");
        req.user = {};
		req.user.id = data.id;
		req.user.role = data.role;
        return next();
	} catch(e) {
		return next(new ForbiddenRequestError("Access forbidden for unknown reason"));
	}	
}

module.exports = {
    authorization
}
const jwt = require('jsonwebtoken')

function authorization(req, res, next){

    const token = req.cookies.access_token;
    
	if (!token) {
		res.status(403).send("Please Login Again");
		return;
	}
	try{
		const data = jwt.verify(token, "secret_key");
        req.user = {};
		req.user.id = data.id;
		req.user.role = data.role;
        next();
	} catch(e) {
		res.status(403).send();
	}	
}

module.exports = {
    authorization
}
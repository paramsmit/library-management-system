const { NotFoundError, BadRequestError, DatabaseError, ForbiddenRequestError} = require('./errorHandling/errors')

const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/account.route');
const profileRouter = require('./routes/profile.route');
const bookRouter = require('./routes/book.route');
const bookItemRouter = require('./routes/bookItem.route');

const { ValidationError } = require('express-json-validator-middleware');

const app = express();

app.use(require('cors')({ origin:'http://localhost:3000', credentials:true }));
// app.use(require('cors')());
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/account', accountRouter)
app.use('/api/profile', profileRouter)
app.use('/api/book', bookRouter)
app.use('/api/bookItem', bookItemRouter)

app.use(function (err, req, res, next) {
    if (err instanceof BadRequestError) {
        res.status(err.statusCode).send({message: err.message})
    } else if (err instanceof NotFoundError) { 
        res.status(err.statusCode).send({message: err.message})
    } else if (err instanceof DatabaseError){
        res.status(err.statusCode).send({message: err.message})
    } else if (err instanceof ForbiddenRequestError){
        res.status(err.statusCode).send({message: err.message})
    } else if(err instanceof ValidationError){
        res.status(400).send({message : err.validationErrors.body[0].message});
    } else {
        next(err);
    }
});

module.exports = {
	app
}
 
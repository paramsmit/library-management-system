const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/account.route');
const profileRouter = require('./routes/profile.route');
const bookRouter = require('./routes/book.route');
const bookItemRouter = require('./routes/bookItem.route')

const app = express();

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/account', accountRouter)
app.use('/api/profile', profileRouter)
app.use('/api/book', bookRouter)
app.use('/api/bookItem', bookItemRouter)

module.exports = {
	app
}
 

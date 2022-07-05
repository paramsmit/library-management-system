const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/account.route');
const memberRouter = require('./routes/member.route');
const app = express();

app.use(require('cookie-parser')())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/account', accountRouter)
app.use('/api/member', memberRouter)

module.exports = {
	app
}
 

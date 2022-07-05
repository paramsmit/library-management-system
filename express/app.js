const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/account.route');
const memberRouter = require('./routes/member.route');
const librarianRouter = require('./routes/librarian.route');
const app = express();

app.use(require('cookie-parser')())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/account', accountRouter)
app.use('/api/member', memberRouter)
app.use('/api/librarian', librarianRouter)

module.exports = {
	app
}
 
// problem with this branch
// librarian and member can map to same account
// that seem like a bad design
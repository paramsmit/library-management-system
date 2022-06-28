const models = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const books = await models.book.findAll();
	res.status(200).json(books);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const book = await models.book.findByPk(id);
	if (book) {
		res.status(200).json(book);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.book.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);
	await models.book.update(req.body, {
		where: {
			id: id
		}
	});
	res.status(200).end();
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.book.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};

const models = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const members = await models.member.findAll();
	res.status(200).json(members);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const member = await models.member.findByPk(id);
	if (member) {
		res.status(200).json(member);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.member.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);
	await models.member.update(req.body, {
		where: {
			id: id
		}
	});
	res.status(200).end();
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.member.destroy({
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

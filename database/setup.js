const models = require('../sequelize');

async function reset() {
	await models.sequelize.sync({ force: true })
	console.log('Done!');
}

try{
	reset();
} catch (e){
	console.log(e);
}

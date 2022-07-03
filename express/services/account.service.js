const models = require('../../sequelize');

async function get(){
    
}

async function removeById(id){
    try{
        return await models.account.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function removeByUsername(username){
    try{
        return await models.account.destroy({ where: {username: username} });          
    } catch (e) {
        throw e;
    }
}


async function getById(id){
    try{
        const account = await models.account.findByPk(id);
        return account;    
    } catch (e) {
        throw e;
    }
}

async function getByUsername(username){
    try{
        const account = await models.account.findOne({ where: { username: username } });
        return account;
    } catch (e) {
        throw e;
    }
} 

async function create(body){
    try{
        return await models.account.create(body);
    } catch (e) {
        throw e;
    }
}


module.exports = {
    get,
    getById,
    getByUsername,
    create,
    removeByUsername,
    removeById
}
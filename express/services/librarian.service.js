const models = require('../../sequelize');

async function get(){
    
}

async function removeById(id){
    try{
        return await models.librarian.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function removeByUsername(username){
    try{
        return await models.librarian.destroy({ where: {username: username} });          
    } catch (e) {
        throw e;
    }
}


async function getById(id){
    try{
        const librarian = await models.librarian.findByPk(id);
        return librarian;    
    } catch (e) {
        throw e;
    }
}

async function getByUsername(username){
    try{
        const librarian = await models.librarian.findOne({ where: { username: username } });
        return librarian;
    } catch (e) {
        throw e;
    }
} 

async function create(body){
    try{
        return await models.librarian.create(body);
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
const models = require('../../sequelize');

// only for admin access
async function get(){}

async function removeById(id){
    try{
        return await models.member.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function getById(id){
    try{
        const member = await models.member.findByPk(id);
        return member;    
    } catch (e) {
        throw e;
    }
}

async function create(body){
    try{
        return await models.member.create(body);
    } catch (e) {
        throw e;
    }
}

async function update(id, fieldsToUpdate){
    try{
        return await models.member.update(fieldsToUpdate, { where: { id: id } , returning: true} );
    } catch (e) {
        throw e;
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    removeById
}
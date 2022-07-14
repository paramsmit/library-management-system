const models = require('../../sequelize');

// only for admin access
async function get(){}

async function removeById(id){
    try{
        return await models.profile.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function getById(id){
    try{
        const profile = await models.profile.findByPk(id);
        return profile;    
    } catch (e) {
        throw e;
    }
}

async function getByAccountId(accountId){
    try{
        const profile = await models.profile.findOne({ where: { accountId: accountId } });
        return profile;
    } catch (e) {
        throw e;
    }
}

async function create(body){
    try{
        return await models.profile.create(body);
    } catch (e) {
        throw e;
    }
}

async function update(id, fieldsToUpdate){
    try{
        return await models.profile.update(fieldsToUpdate, { where: { id: id } , returning: true} );
    } catch (e) {
        throw e;
    }
}

module.exports = {
    get,
    getById,
    getByAccountId,
    create,
    update,
    removeById
}
const models = require('../../sequelize');
const { sequelize } = require('../../sequelize');

// only for admin access
async function get(){}

async function getProfilesByFuzzySearch(searchBy, searchString, limit, pageNumber) {
    try{    
        const offset = limit * pageNumber - limit;
        
        const query = `select * from profiles where SIMILARITY( METAPHONE(${searchBy},100), METAPHONE('${searchString}',100)) > 0.3
            order by  SIMILARITY( METAPHONE(${searchBy},100), METAPHONE('${searchString}',100))
            DESC limit ${limit} offset ${offset};`

        const countQuery = `select count(*) from profiles where SIMILARITY(METAPHONE(${searchBy},10), METAPHONE('${searchString}',10)) > 0.3;`;

        const profiles = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        const totalCount = await sequelize.query(countQuery,  { type: sequelize.QueryTypes.SELECT })
        
        return {items: profiles, totalCount : totalCount[0].count} 
    } catch (e) {
        console.log(e);
        throw e;
    }
}


async function removeById(id){
    try{
        return await models.profile.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function getProfileById(id){
    try{
        const profile = await models.profile.findByPk(id);
        return profile;    
    } catch (e) {
        throw e;
    }
}

async function getProfilesByContact(contact){
    try{
        const profiles = await models.profile.findAll({where: {contact: contact}});
        return profiles;    
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
    getProfileById,
    getByAccountId,
    create,
    update,
    removeById,
    getProfilesByFuzzySearch,
    getProfilesByContact
}